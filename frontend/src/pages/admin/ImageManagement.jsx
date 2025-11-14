// src/pages/admin/ImageManagement.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  CloudUpload,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";
import {
  deleteImage,
  fetchImages,
  fetchProducts,
  toggleWatermark,
  uploadImage,
} from "../../api/admin";

const STATUS_META = {
  queued: { label: "بالانتظار", color: "warning" },
  processing: { label: "جاري", color: "info" },
  completed: { label: "مكتمل", color: "success" },
  failed: { label: "فشل", color: "error" },
};

function PageHeader({ isMobile, onAdd }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant={isMobile ? "h5" : "h4"} >
          إدارة الصور
        </Typography>
        <Typography variant="body1" color="text.secondary">
          تنظيم مكتبة الصور والتحكم بالعلامة المائية
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onAdd}
        startIcon={<AddIcon />}
        sx={{
          borderRadius: 999,
          px: 3,
          py: 1.2,
          boxShadow: "0 10px 25px rgba(21,101,192,0.25)",
        }}
      >
        {isMobile ? "صورة جديدة" : "إضافة صورة جديدة"}
      </Button>
    </Stack>
  );
}

function SearchToolbar({ search, onSearch, theme }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.03)"
          : "linear-gradient(135deg, rgba(21,101,192,0.03), rgba(2,119,189,0.05))",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          value={search}
          onChange={onSearch}
          placeholder="ابحث عن صورة أو منتج..."
          variant="outlined"
          size="medium"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 },
          }}
        />
      </Stack>
    </Paper>
  );
}

function EmptyState({ isMobile, search, onAdd }) {
  return (
    <Stack
      alignItems="center"
      spacing={2}
      sx={{
        py: { xs: 6, md: 8 },
        textAlign: "center",
        px: { xs: 2, md: 10 },
      }}
    >
      <Box
        sx={{
          width: { xs: 64, md: 96 },
          height: { xs: 64, md: 96 },
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1565c0, #0277bd)",
          opacity: 0.1,
        }}
      />
      <Typography variant={isMobile ? "h6" : "h5"}>
        {!search ? "لا توجد صور حتى الآن" : "لا توجد نتائج مطابقة"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {!search
          ? "ابدأ بإضافة صور جديدة وإدارتها بسهولة"
          : "حاول تغيير كلمات البحث أو إعادة التعيين"}
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
        إضافة صورة
      </Button>
    </Stack>
  );
}

function ImageCard({ theme, img, isMobile, onToggle, onDelete, onPreview }) {
  const statusKey = img.status || "queued";
  const statusMeta = STATUS_META[statusKey] || STATUS_META.queued;
  const displayImage =
    img.watermarkedUrl ||
    img.originalUrl ||
    "https://placehold.co/600x400?text=Image";

  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === "dark"
          ? "rgba(18,18,18,0.8)"
          : "linear-gradient(180deg, #fff, rgba(255,255,255,0.85))",
        backdropFilter: "blur(6px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.4)"
            : "0 20px 45px rgba(15,60,150,0.08)",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 25px 60px rgba(0,0,0,0.5)"
              : "0 25px 60px rgba(15,60,150,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={displayImage}
          alt={img.productName}
          sx={{ objectFit: "cover" }}
        />
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <Chip
            label={
              statusKey === "processing" && img.progress != null
                ? `${statusMeta.label} (${img.progress}%)`
                : statusMeta.label
            }
            color={statusMeta.color}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(6px)",
            }}
          />
          <Tooltip
            title={img.isWatermarked ? "إزالة العلامة المائية" : "تفعيل العلامة المائية"}
          >
            <Chip
              icon={img.isWatermarked ? <CheckIcon /> : undefined}
              label={img.isWatermarked ? "مُعلّمة" : "بدون علامة"}
              onClick={onToggle}
              color={img.isWatermarked ? "success" : "default"}
              size="small"
              sx={{
                cursor: "pointer",
                backgroundColor: "rgba(255,255,255,0.95)",
              }}
            />
          </Tooltip>
        </Stack>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            {img.category || "فئة غير محددة"}
          </Typography>
          {img.productCode && (
            <Chip label={`كود ${img.productCode}`} size="small" variant="outlined" />
          )}
        </Stack>

        <Typography variant={isMobile ? "subtitle1" : "h6"} >
          {img.productName || "صورة بدون منتج"}
        </Typography>

        {img.model && (
          <Typography variant="body2" color="text.secondary">
            موديل: {img.model}
          </Typography>
        )}
        {img.note && (
          <Typography variant="body2" color="text.secondary">
            ملاحظة: {img.note}
          </Typography>
        )}
        {img.description && (
          <Typography variant="body2" color="text.secondary">
            الوصف: {img.description}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: "auto" }}>
          تم الرفع: {img.uploadedAt ? new Date(img.uploadedAt).toLocaleDateString("ar-EG") : "--"}
        </Typography>
      </CardContent>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pb: 2 }}>
        <Tooltip title="عرض الصورة بالكامل">
          <IconButton
            size="small"
            onClick={onPreview}
            sx={{
              borderRadius: 2,
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف الصورة">
          <IconButton
            size="small"
            color="error"
            onClick={onDelete}
            sx={{ borderRadius: 2 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}

function ImagesGrid({
  images,
  loading,
  rowsPerPage,
  totalSkeletons,
  theme,
  isMobile,
  onToggle,
  onDelete,
  onPreview,
}) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: totalSkeletons }).map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4, mb: 1 }} />
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {images.map((img) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={img._id}>
          <ImageCard
            theme={theme}
            img={img}
            isMobile={isMobile}
            onToggle={onToggle(img._id)}
            onDelete={() => onDelete(img._id)}
            onPreview={() => onPreview(img)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function UploadDialog({
  open,
  isMobile,
  theme,
  form,
  productOptions,
  productLookupLoading,
  selectedProduct,
  uploading,
  onClose,
  onFileChange,
  onProductChange,
  onProductSearch,
  onNavigateProducts,
  onUpload,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Typography variant="h6" >
          إضافة صورة جديدة
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 3,
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 2,
                gap: 1,
                backgroundColor: form.file
                  ? theme.palette.background.default
                  : "transparent",
                transition: "border-color 0.3s",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {form.file ? (
                <>
                  <CheckIcon sx={{ fontSize: 48, color: theme.palette.success.main }} />
                  <Typography >{form.file.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    تم اختيار الملف بنجاح
                  </Typography>
                  <Button variant="outlined" component="label" size="small" sx={{ mt: 1 }}>
                    تغيير الملف
                    <input type="file" hidden accept="image/*" onChange={onFileChange("file")} />
                  </Button>
                </>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                  <Typography>اسحب وأفلت الصورة هنا</Typography>
                  <Typography variant="caption" color="text.secondary">
                    أو انقر لاختيار ملف من جهازك
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ mt: 1 }}
                  >
                    اختر ملفًا
                    <input type="file" hidden accept="image/*" onChange={onFileChange("file")} />
                  </Button>
                </>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1"sx={{ mb: 1 }}>
              ربط الصورة بمنتج (اختياري)
            </Typography>
            <Autocomplete
              options={productOptions}
              value={selectedProduct}
              loading={productLookupLoading}
              onChange={(_, newValue) => onProductChange(newValue)}
              onInputChange={(_, newVal) => onProductSearch(newVal)}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) =>
                option
                  ? `${option.productName}${option.productCode ? ` (${option.productCode})` : ""}`
                  : ""
              }
              noOptionsText="لا توجد نتائج"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="اختر المنتج"
                  placeholder="اكتب اسم المنتج أو الكود"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {productLookupLoading ? <CircularProgress size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                تحتاج لتعديل بيانات المنتج؟
              </Typography>
              <Button size="small" onClick={onNavigateProducts}>
                إدارة المنتجات
              </Button>
            </Stack>
            {selectedProduct && (
              <Box
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography >{selectedProduct.productName}</Typography>
                {selectedProduct.productCode && (
                  <Typography variant="body2" color="text.secondary">
                    الكود: {selectedProduct.productCode}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  الفئة: {selectedProduct.category || "غير محددة"}
                </Typography>
                {selectedProduct.model && (
                  <Typography variant="body2" color="text.secondary">
                    الموديل: {selectedProduct.model}
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
          إلغاء
        </Button>
        <Button
          onClick={onUpload}
          variant="contained"
          disabled={uploading || !form.file}
          startIcon={uploading ? <CircularProgress size={18} /> : <UploadIcon />}
          sx={{ borderRadius: 3, px: 4 }}
        >
          {uploading ? "جارٍ الرفع..." : "رفع الصورة"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DeleteDialog({ open, isMobile, deleting, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={isMobile}>
      <DialogTitle >تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Typography>
          هل أنت متأكد أنك تريد حذف هذه الصورة؟ هذا الإجراء لا يمكن التراجع عنه.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
          إلغاء
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {deleting ? "جاري الحذف..." : "حذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ImagePreviewDialog({ open, image, isMobile, onClose }) {
  if (!image) return null;

  const displayImage = image.watermarkedUrl || image.originalUrl || "https://placehold.co/600x400?text=Image";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          maxHeight: isMobile ? '100vh' : '90vh',
          maxWidth: isMobile ? '100vw' : '90vw',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme => theme.palette.divider}`,
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {image.productName || "عرض الصورة"}
          </Typography>
          {image.productCode && (
            <Typography variant="body2" color="text.secondary">
              كود المنتج: {image.productCode}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: isMobile ? 'calc(100vh - 140px)' : 'calc(90vh - 140px)' }}>
        <Box
          component="img"
          src={displayImage}
          alt={image.productName || "صورة"}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 1,
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme => theme.palette.divider}`,
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center' }}>
          <Chip
            label={`الحالة: ${STATUS_META[image.status || "queued"]?.label || "غير محدد"}`}
            color={STATUS_META[image.status || "queued"]?.color || "default"}
            size="small"
          />
          <Chip
            label={image.isWatermarked ? "مع علامة مائية" : "بدون علامة مائية"}
            color={image.isWatermarked ? "success" : "default"}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
          {image.category && (
            <Chip label={`الفئة: ${image.category}`} variant="outlined" size="small" />
          )}
          {image.model && (
            <Chip label={`الموديل: ${image.model}`} variant="outlined" size="small" />
          )}
          {image.uploadedAt && (
            <Chip
              label={`تم الرفع: ${new Date(image.uploadedAt).toLocaleDateString("ar-EG")}`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        {image.note && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            ملاحظة: {image.note}
          </Typography>
        )}
        {image.description && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            الوصف: {image.description}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default function ImageManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: "", file: null });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productLookupLoading, setProductLookupLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchImages({
        page: page + 1,
        limit: rowsPerPage,
        search,
      });
      const { items, totalItems } = res.data;

      if (items.length === 0 && totalItems > 0 && page > 0) {
        setPage((prev) => Math.max(prev - 1, 0));
        return;
      }

      setImages(items);
      setTotalCount(totalItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!open) return;
    let isActive = true;

    const handler = setTimeout(async () => {
      try {
        const res = await fetchProducts({ page: 1, limit: 50, q: productSearch });
        if (!isActive) return;
        setProductOptions(res.data.items || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        if (isActive) {
          setProductLookupLoading(false);
        }
      }
    }, 350);

    setProductLookupLoading(true);

    return () => {
      isActive = false;
      clearTimeout(handler);
    };
  }, [open, productSearch]);

  const openDialog = () => {
    setForm({ productId: "", file: null });
    setProductSearch("");
    setSelectedProduct(null);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setForm({ productId: "", file: null });
    setSelectedProduct(null);
  };

  const handleChange = (key) => (e) => {
    const value = key === "file" ? e.target.files[0] : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async () => {
    if (!form.file) return;
    setUploading(true);

    const fd = new FormData();
    fd.append("file", form.file);
    if (form.productId) {
      fd.append("productId", form.productId);
    }

    try {
      const res = await uploadImage(fd);
      const { id, jobId, originalUrl } = res.data;
      const linkedProduct = selectedProduct || null;

      setImages((imgs) => [
        {
          _id: id,
          jobId,
          originalUrl,
          watermarkedUrl: null,
          status: "queued",
          progress: 0,
          model: linkedProduct?.model || "",
          category: linkedProduct?.category || "",
          note: linkedProduct?.note || "",
          productName: linkedProduct?.productName || form.file.name,
          productCode: linkedProduct?.productCode || "",
          productId: linkedProduct?._id || null,
          uploadedAt: new Date().toISOString(),
          isWatermarked: false,
        },
        ...imgs,
      ]);

      closeDialog();
      loadImages();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = (id) => async () => {
    try {
      await toggleWatermark(id);
      setImages((imgs) =>
        imgs.map((img) =>
          img._id === id ? { ...img, isWatermarked: !img.isWatermarked } : img
        )
      );
    } catch (err) {
      console.error("Failed to toggle watermark:", err);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteImage(id);
      setImages((imgs) => imgs.filter((img) => img._id !== id));
      setDeleteConfirm(null);
      loadImages();
    } catch (err) {
      console.error("Failed to delete image:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handlePreview = (image) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hasImages = images.length > 0;
  const deleteDialogOpen = Boolean(deleteConfirm);
  const deleting = deleteConfirm ? deletingId === deleteConfirm : false;

  const paginatedInfo = useMemo(
    () => ({
      count: totalCount,
      page,
      rowsPerPage,
    }),
    [page, rowsPerPage, totalCount]
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 2, pb: 6 }}>
      <PageHeader isMobile={isMobile} onAdd={openDialog} />
      <SearchToolbar search={search} onSearch={handleSearchChange} theme={theme} />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          p: { xs: 2, md: 3 },
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.mode === "dark"
            ? "rgba(15,15,15,0.9)"
            : "rgba(255,255,255,0.95)",
        }}
      >
        {!hasImages && !loading ? (
          <EmptyState isMobile={isMobile} search={search} onAdd={openDialog} />
        ) : (
          <>
            <ImagesGrid
              images={images}
              loading={loading}
              rowsPerPage={rowsPerPage}
              totalSkeletons={rowsPerPage}
              theme={theme}
              isMobile={isMobile}
              onToggle={handleToggle}
              onDelete={(id) => setDeleteConfirm(id)}
              onPreview={handlePreview}
            />
            <TablePagination
              component="div"
              count={paginatedInfo.count}
              page={paginatedInfo.page}
              onPageChange={handleChangePage}
              rowsPerPage={paginatedInfo.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[8, 16, 24]}
              labelRowsPerPage="صور لكل صفحة"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
              sx={{
                mt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                "& .MuiTablePagination-toolbar": {
                  flexWrap: "wrap",
                  justifyContent: "center",
                },
              }}
            />
          </>
        )}
      </Paper>

      <UploadDialog
        open={open}
        isMobile={isMobile}
        theme={theme}
        form={form}
        productOptions={productOptions}
        productLookupLoading={productLookupLoading}
        selectedProduct={selectedProduct}
        uploading={uploading}
        onClose={closeDialog}
        onFileChange={handleChange}
        onProductChange={(product) => {
          setSelectedProduct(product);
          setForm((prev) => ({ ...prev, productId: product?._id || "" }));
        }}
        onProductSearch={(value) => setProductSearch(value || "")}
        onNavigateProducts={() => {
          closeDialog();
          navigate("/admin/products");
        }}
        onUpload={handleUpload}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        isMobile={isMobile}
        deleting={deleting}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
      />

      <ImagePreviewDialog
        open={!!previewImage}
        image={previewImage}
        isMobile={isMobile}
        onClose={closePreview}
      />
    </Container>
  );
}
