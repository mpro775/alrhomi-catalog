import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Tooltip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  Skeleton,
  useTheme,
  alpha,
  Alert,
  Fade,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  AccountTree as FolderTreeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import API, {
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} from "../../api/admin";

export default function CategoryManagement() {
  const { t } = useTranslation();

  const [allCategories, setAllCategories] = useState([]);
  const [categoriesForTree, setCategoriesForTree] = useState([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    parent: "",
    image: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // state for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const theme = useTheme();

  // ثاني useEffect: تحميل كل الفئات للعرض في الجدول وللـ Dropdown
  useEffect(() => {
    setTreeLoading(true);
    API.get("/admin/categories", { params: { page: 1, limit: 1000 } })
      .then((res) => {
        setAllCategories(res.data.items);
        setCategoriesForTree(res.data.items);
        setTotalCount(res.data.items.length);
      })
      .catch(console.error)
      .finally(() => {
        setTreeLoading(false);
        setInitialLoading(false);
      });
  }, []);

  const resetFormState = () => {
    setForm({ name: "", description: "", parent: "", image: "" });
    setEditing(null);
    setImageError("");
    setImageUploading(false);
  };

  const handleOpen = (category = null) => {
    if (category) {
      setEditing(category);
      setForm({
        name: category.name,
        description: category.description || "",
        parent: category.parent?._id || "",
        image: category.image || "",
      });
    } else {
      resetFormState();
    }
    setImageError("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFormState();
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const normalizedImage = (form.image || "").trim();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        parent: form.parent || null,
      };
      if (normalizedImage || editing) {
        payload.image = normalizedImage;
      }
      if (editing) {
        await updateCategory(editing._id, payload);
      } else {
        await createCategory(payload);
      }
      handleClose();
      setPage(0);
      // إعادة تحميل جميع الفئات للعرض في الجدول
      setTreeLoading(true);
      API.get("/admin/categories", { params: { page: 1, limit: 1000 } })
        .then((res) => {
          setAllCategories(res.data.items);
          setCategoriesForTree(res.data.items);
          setTotalCount(res.data.items.length);
        })
        .catch(console.error)
        .finally(() => setTreeLoading(false));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("saveCategoryFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");

    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      setImageError(t("imageSizeError"));
      event.target.value = "";
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImage(formData);
      const { watermarkedUrl, originalUrl } = res.data || {};
      const imageUrl = watermarkedUrl || originalUrl;
      if (!imageUrl) {
        setImageError(t("imageUrlError"));
      } else {
        setForm((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (err) {
      console.error(err);
      setImageError(err.response?.data?.message || t("uploadImageFailed"));
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };
  // مساعدة لبناء الشجرة
  function buildTree(list) {
    const map = {},
      roots = [];
    list.forEach((item) => {
      map[item._id] = { ...item, children: [] };
    });
    list.forEach((item) => {
      if (item.parent) {
        map[item.parent._id]?.children.push(map[item._id]);
      } else {
        roots.push(map[item._id]);
      }
    });
    return roots;
  }

  // رسم جدول الصفوف بشكل متداخل
  const renderRows = (nodes, depth = 0) => {
    return nodes.flatMap((node) => [
      <TableRow
        key={node._id}
        hover
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
          "& td": {
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        <TableCell
          sx={{
            width: 110,
            py: 2,
          }}
        >
          <Avatar
            variant="rounded"
            src={node.image || undefined}
            sx={{
              width: 60,
              height: 60,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <ImageIcon />
          </Avatar>
        </TableCell>
        <TableCell
          sx={{
            pl: { xs: 1, sm: 2 + depth * 3 },
            py: 2,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {depth > 0 && (
              <Box
                sx={{
                  width: 2,
                  height: 20,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 1,
                  opacity: 0.5,
                }}
              />
            )}
            <CategoryIcon
              sx={{
                fontSize: { xs: 18, sm: 20 },
                color: theme.palette.primary.main,
                opacity: 0.7,
              }}
            />
            {node.name}
            <Chip
              label={node.parent ? t("subcategory") : t("mainCategory")}
              size="small"
              color={node.parent ? "default" : "primary"}
              variant={node.parent ? "outlined" : "filled"}
              sx={{ ml: 0.5 }}
            />
          </Box>
        </TableCell>
        <TableCell
          sx={{
            py: 2,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            color: "text.secondary",
          }}
        >
          {node.description || (
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", opacity: 0.5 }}
            >
              {t("noDescription")}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right" sx={{ py: 2 }}>
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
            <Tooltip title={t("edit")} arrow>
              <IconButton
                size="small"
                onClick={() => handleOpen(node)}
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("delete")} arrow>
              <IconButton
                size="small"
                color="error"
                onClick={() => openDeleteDialog(node._id, node.name)}
                sx={{
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>,
      // ثم أبناؤه
      ...renderRows(node.children, depth + 1),
    ]);
  };

  const openDeleteDialog = (id, name = "") => {
    setDeleteDialog({ open: true, id, name });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null, name: "" });
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteCategory(deleteDialog.id);
      closeDeleteDialog();
      // إعادة تحميل جميع الفئات للعرض في الجدول
      setTreeLoading(true);
      API.get("/admin/categories", { params: { page: 1, limit: 1000 } })
        .then((res) => {
          setAllCategories(res.data.items);
          setCategoriesForTree(res.data.items);
          setTotalCount(res.data.items.length);
        })
        .catch(console.error)
        .finally(() => setTreeLoading(false));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("deleteCategoryFailed"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          pb: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                mb: 0.5,
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    : `linear-gradient(135deg, #1565c0 0%, #0277bd 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("categoriesManagement")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {t("categoriesManagementDesc")}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              },
            }}
          >
            {t("newCategory")}
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 3, borderRadius: 3 }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Stats Card */}
      <Box sx={{ mb: 3 }}>
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.05
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <FolderTreeIcon sx={{ color: theme.palette.primary.main }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t("totalCategories")}
              </Typography>
              <Typography variant="h5">
                {totalCount}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Table Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {treeLoading || initialLoading ? (
          <Box sx={{ p: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={60}
                sx={{ mb: 1, borderRadius: 2 }}
              />
            ))}
          </Box>
        ) : !initialLoading && categoriesForTree.length === 0 ? (
          <Box
            sx={{
              p: 8,
              textAlign: "center",
            }}
          >
            <CategoryIcon
              sx={{
                fontSize: 64,
                color: "text.secondary",
                opacity: 0.3,
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("noCategories")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("startCreateCategory")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{ borderRadius: 3 }}
            >
              {t("createNewCategory")}
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : alpha(theme.palette.primary.main, 0.05),
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        width: 120,
                      }}
                    >
                      {t("image")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {t("categoryName")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {t("description")}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {t("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderRows(buildTree(categoriesForTree))}</TableBody>
              </Table>
            </Box>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20, 50]}
              labelRowsPerPage={t("categoriesPerPage")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} من ${count}`
              }
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            />
          </>
        )}
      </Card>

      {/* Dialog for create/edit */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 12px 48px rgba(0,0,0,0.5)"
                : "0 12px 48px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CategoryIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{  flexGrow: 1 }}>
            {editing ? t("editCategoryDialog") : t("createCategoryDialog")}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="parent-label">{t("parentCategory")}</InputLabel>
            <Select
              labelId="parent-label"
              label={t("parentCategory")}
              value={form.parent}
              onChange={(e) =>
                setForm((f) => ({ ...f, parent: e.target.value }))
              }
              renderValue={(val) =>
                val ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FolderTreeIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                    {allCategories.find((c) => c._id === val)?.name}
                  </Box>
                ) : (
                  t("noParent")
                )
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CategoryIcon sx={{ fontSize: 18, opacity: 0.5 }} />
                  {t("noParent")}
                </Box>
              </MenuItem>
              {allCategories
                .filter((c) => editing?._id !== c._id)
                .map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FolderTreeIcon sx={{ fontSize: 18, opacity: 0.7 }} />
                      {c.name}
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label={t("categoryName")}
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            sx={{
              mb: 3,
              borderRadius: 2,
              input: {
                color: theme.palette.text.primary,
                textAlign: "right",
              },
              "& .MuiFormHelperText-root": {
                textAlign: "right",
              },
            }}
            required
            error={!form.name.trim()}
            helperText={!form.name.trim() ? t("categoryNameRequired") : ""}
          />
          <TextField
            margin="dense"
            label={t("descriptionOptional")}
            fullWidth
            variant="outlined"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            multiline
            rows={3}
            sx={{ borderRadius: 2 }}
            InputProps={{
              endAdornment: (
                <DescriptionIcon
                  sx={{ ml: 1, color: "text.secondary", opacity: 0.5 }}
                />
              ),
            }}
          />
          <Box
            sx={{
              mt: 3,
              p: 2,
              border: `1px dashed ${alpha(
                imageError ? theme.palette.error.main : theme.palette.divider,
                0.8
              )}`,
              borderRadius: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              variant="rounded"
              src={form.image || undefined}
              sx={{
                width: 96,
                height: 96,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <ImageIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" >
                {t("categoryImage")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t("uploadImageDesc")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={
                    imageUploading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <CloudUploadIcon />
                    )
                  }
                  component="label"
                  disabled={imageUploading}
                  sx={{ borderRadius: 2 }}
                >
                  {imageUploading ? t("uploading") : t("uploadImageBtn")}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </Button>
                {form.image && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setImageError("");
                      setForm((prev) => ({ ...prev, image: "" }));
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    {t("removeCurrentImage")}
                  </Button>
                )}
              </Box>
              {imageError && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {imageError}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{ borderRadius: 2, px: 3 }}
            disabled={saving}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim() || saving}
            sx={{
              borderRadius: 2,
              px: 3,
              minWidth: 120,
            }}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? t("saving") : editing ? t("saveChanges") : t("create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for delete confirmation */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 12px 48px rgba(0,0,0,0.5)"
                : "0 12px 48px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <WarningIcon sx={{ color: theme.palette.error.main }} />
          <Typography variant="h6" >
            {t("confirmDelete")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {t("confirmDeleteCategory")} "{deleteDialog.name}"؟
            </Typography>
            <Typography variant="body2">{t("deleteWarning")}</Typography>
          </Alert>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            onClick={closeDeleteDialog}
            sx={{ borderRadius: 2, px: 3 }}
            disabled={deleting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              borderRadius: 2,
              px: 3,
              minWidth: 100,
            }}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deleting ? t("deleting") : t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
