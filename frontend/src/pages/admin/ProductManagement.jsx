import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory2 as InventoryIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CheckCircle as CheckCircleIcon,
  Image as ImageIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchImages,
} from "../../api/admin";

const getDefaultForm = () => ({
  productName: "",
  productCode: "",
  model: "",
  category: "",
  subcategory: "",
  description: "",
  note: "",
  tags: [],
  variants: [],
});

export default function ProductManagement() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ category: "", model: "" });
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(getDefaultForm);
  const [tagInput, setTagInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesLoading, setSelectedImagesLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageLibrary, setImageLibrary] = useState({
    items: [],
    loading: false,
    total: 0,
  });
  const [imageLibraryQuery, setImageLibraryQuery] = useState({
    page: 0,
    rowsPerPage: 6,
    search: "",
    assigned: "all",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
    loading: false,
  });

  // Similar products state
  const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);
  const [selectedSimilarProductsLoading, setSelectedSimilarProductsLoading] = useState(false);
  const [similarProductsDialogOpen, setSimilarProductsDialogOpen] = useState(false);
  const [productsLibrary, setProductsLibrary] = useState({
    items: [],
    loading: false,
    total: 0,
  });
  const [productsLibraryQuery, setProductsLibraryQuery] = useState({
    page: 0,
    rowsPerPage: 6,
    search: "",
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchProducts({
        page: page + 1,
        limit: rowsPerPage,
        q: search,
        category: filters.category || undefined,
        model: filters.model || undefined,
      });
      const { items, totalItems } = res.data;

      if (items.length === 0 && totalItems > 0 && page > 0) {
        setPage((prev) => Math.max(prev - 1, 0));
        return;
      }

      setProducts(items);
      setTotalCount(totalItems);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message;
      setError(
        typeof message === "string" ? message : "فشل في تحميل المنتجات. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.model, page, rowsPerPage, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 1000 });
        setCategories(res.data.items || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  const parentCategories = useMemo(
    () => categories.filter((cat) => !cat.parent),
    [categories]
  );

  const subcategoryOptions = useMemo(
    () =>
      categories.filter(
        (cat) => cat.parent && cat.parent._id === form.category
      ),
    [categories, form.category]
  );

  const selectedImageIds = useMemo(
    () => selectedImages.map((image) => image._id),
    [selectedImages]
  );

  const selectedImageIdSet = useMemo(
    () => new Set(selectedImages.map((image) => image._id)),
    [selectedImages]
  );

  const selectedSimilarProductIds = useMemo(
    () => selectedSimilarProducts.map((product) => product._id),
    [selectedSimilarProducts]
  );

  const selectedSimilarProductIdSet = useMemo(
    () => new Set(selectedSimilarProducts.map((product) => product._id)),
    [selectedSimilarProducts]
  );

  const loadImageLibrary = useCallback(async () => {
    if (!imageDialogOpen) return;
    setImageLibrary((prev) => ({ ...prev, loading: true }));
    try {
      const assignedFilter = imageLibraryQuery.assigned;
      const assignedParam =
        assignedFilter === "unassigned"
          ? false
          : assignedFilter === "assigned"
          ? true
          : undefined;
      const res = await fetchImages({
        page: imageLibraryQuery.page + 1,
        limit: imageLibraryQuery.rowsPerPage,
        search: imageLibraryQuery.search,
        assigned: assignedParam,
      });
      const { items, totalItems } = res.data;
      setImageLibrary((prev) => ({
        ...prev,
        items,
        total: totalItems,
      }));
    } catch (err) {
      console.error("Failed to load images", err);
    } finally {
      setImageLibrary((prev) => ({ ...prev, loading: false }));
    }
  }, [imageDialogOpen, imageLibraryQuery]);

  useEffect(() => {
    loadImageLibrary();
  }, [loadImageLibrary]);

  const fetchSelectedImagesMeta = useCallback(async (ids) => {
    if (!ids || ids.length === 0) {
      setSelectedImages([]);
      return;
    }
    setSelectedImagesLoading(true);
    try {
      const res = await fetchImages({
        ids: ids.join(","),
        limit: ids.length,
        page: 1,
      });
      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      if (items.length === 0) {
        setSelectedImages(ids.map((id) => ({ _id: id })));
        return;
      }
      const map = new Map(items.map((item) => [item._id, item]));
      setSelectedImages(ids.map((id) => map.get(id) || { _id: id }));
    } catch (err) {
      console.error("Failed to load selected images", err);
      setSelectedImages(ids.map((id) => ({ _id: id })));
    } finally {
      setSelectedImagesLoading(false);
    }
  }, []);

  // Load products library for similar products dialog
  const loadProductsLibrary = useCallback(async () => {
    if (!similarProductsDialogOpen) return;
    setProductsLibrary((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetchProducts({
        page: productsLibraryQuery.page + 1,
        limit: productsLibraryQuery.rowsPerPage,
        q: productsLibraryQuery.search || undefined,
      });
      const { items, totalItems } = res.data;
      setProductsLibrary((prev) => ({
        ...prev,
        items,
        total: totalItems,
      }));
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setProductsLibrary((prev) => ({ ...prev, loading: false }));
    }
  }, [similarProductsDialogOpen, productsLibraryQuery]);

  useEffect(() => {
    loadProductsLibrary();
  }, [loadProductsLibrary]);

  // Fetch similar products metadata when editing
  const fetchSelectedSimilarProductsMeta = useCallback(async (ids) => {
    if (!ids || ids.length === 0) {
      setSelectedSimilarProducts([]);
      return;
    }
    setSelectedSimilarProductsLoading(true);
    try {
      // Fetch each product individually since we don't have a bulk endpoint
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetchProducts({ page: 1, limit: 1000 });
            const found = res.data.items?.find((p) => p._id === id);
            return found || { _id: id, productName: "منتج غير موجود" };
          } catch {
            return { _id: id, productName: "منتج غير موجود" };
          }
        })
      );
      // Filter unique and valid products
      const uniqueResults = [];
      const seenIds = new Set();
      for (const p of results) {
        if (!seenIds.has(p._id)) {
          seenIds.add(p._id);
          uniqueResults.push(p);
        }
      }
      setSelectedSimilarProducts(uniqueResults);
    } catch (err) {
      console.error("Failed to load similar products", err);
      setSelectedSimilarProducts(ids.map((id) => ({ _id: id, productName: "منتج غير موجود" })));
    } finally {
      setSelectedSimilarProductsLoading(false);
    }
  }, []);

  const handleFormChange = (key) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      if (key === "category") {
        return { ...prev, category: value, subcategory: "" };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleImageSearchChange = (event) => {
    const value = event.target.value;
    setImageLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
  };

  const handleImagePageChange = (_, newPage) => {
    setImageLibraryQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleImageRowsChange = (event) => {
    setImageLibraryQuery((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const handleImageFilterChange = (value) => {
    setImageLibraryQuery((prev) => ({ ...prev, assigned: value, page: 0 }));
  };

  const openImageDialog = () => {
    setImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setImageDialogOpen(false);
  };

  const toggleImageSelection = (image) => {
    setSelectedImages((prev) => {
      const exists = prev.find((img) => img._id === image._id);
      if (exists) {
        return prev.filter((img) => img._id !== image._id);
      }
      return [...prev, image];
    });
  };

  const handleRemoveSelectedImage = (id) => {
    setSelectedImages((prev) => prev.filter((img) => img._id !== id));
  };

  // Similar products dialog handlers
  const openSimilarProductsDialog = () => {
    setSimilarProductsDialogOpen(true);
  };

  const closeSimilarProductsDialog = () => {
    setSimilarProductsDialogOpen(false);
  };

  const handleProductsSearchChange = (event) => {
    const value = event.target.value;
    setProductsLibraryQuery((prev) => ({ ...prev, search: value, page: 0 }));
  };

  const handleProductsPageChange = (_, newPage) => {
    setProductsLibraryQuery((prev) => ({ ...prev, page: newPage }));
  };

  const handleProductsRowsChange = (event) => {
    setProductsLibraryQuery((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const toggleSimilarProductSelection = (product) => {
    // Don't allow selecting the current product being edited
    if (editingProduct && product._id === editingProduct._id) return;
    
    setSelectedSimilarProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveSelectedSimilarProduct = (id) => {
    setSelectedSimilarProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          values: [""],
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

  const handleVariantNameChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], name: value };
      return { ...prev, variants: updated };
    });
  };

  const handleVariantValueChange = (variantIndex, valueIndex, value) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = [...targetVariant.values];
      values[valueIndex] = value;
      variants[variantIndex] = { ...targetVariant, values };
      return { ...prev, variants };
    });
  };

  const handleAddVariantValue = (variantIndex) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = [...targetVariant.values, ""];
      variants[variantIndex] = { ...targetVariant, values };
      return { ...prev, variants };
    });
  };

  const handleRemoveVariantValue = (variantIndex, valueIndex) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      const targetVariant = variants[variantIndex];
      if (!targetVariant) return prev;
      const values = targetVariant.values.filter(
        (_, currentIndex) => currentIndex !== valueIndex
      );
      variants[variantIndex] = { ...targetVariant, values: values.length ? values : [""] };
      return { ...prev, variants };
    });
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const addTagFromInput = () => {
    const value = tagInput.trim();
    if (!value) return;
    setForm((prev) => {
      if (prev.tags.includes(value)) {
        return prev;
      }
      return { ...prev, tags: [...prev.tags, value] };
    });
    setTagInput("");
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTagFromInput();
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const resetForm = () => {
    setForm(getDefaultForm());
    setTagInput("");
    setSelectedImages([]);
    setSelectedSimilarProducts([]);
    setEditingProduct(null);
    setError("");
  };

  const hydrateForm = (product) => {
    if (!product) {
      resetForm();
      return;
    }
    const categoryId =
      categories.find(
        (cat) => !cat.parent && cat.name === product.category
      )?._id || "";
    const subcategoryId =
      categories.find(
        (cat) => cat.parent && cat.name === product.subcategory
      )?._id || "";

    const imageIds = Array.isArray(product.imageIds) ? product.imageIds : [];
    const similarProductIds = Array.isArray(product.similarProductIds) ? product.similarProductIds : [];

    setForm({
      productName: product.productName || "",
      productCode: product.productCode || "",
      model: product.model || "",
      category: categoryId,
      subcategory: subcategoryId,
      description: product.description || "",
      note: product.note || "",
      tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            name: variant?.name || "",
            values:
              Array.isArray(variant?.values) && variant.values.length > 0
                ? variant.values
                : [""],
          }))
        : [],
    });
    setTagInput("");
    fetchSelectedImagesMeta(imageIds);
    fetchSelectedSimilarProductsMeta(similarProductIds);
  };

  const handleOpen = (product = null) => {
    setEditingProduct(product);
    hydrateForm(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const buildPayload = () => {
    const tagsArray = Array.from(
      new Set(form.tags.map((tag) => tag.trim()).filter(Boolean))
    );

    const variantsPayload = form.variants
      .map((variant) => ({
        name: variant.name.trim(),
        values: variant.values.map((value) => value.trim()).filter(Boolean),
      }))
      .filter((variant) => variant.name && variant.values.length > 0);

    return {
      productName: form.productName.trim(),
      productCode: form.productCode.trim(),
      model: form.model.trim(),
      category: form.category,
      subcategory: form.subcategory || null,
      description: form.description.trim() || null,
      note: form.note.trim() || null,
      tags: tagsArray,
      variants: variantsPayload,
      imageIds: selectedImageIds,
      similarProductIds: selectedSimilarProductIds,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = buildPayload();

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
      } else {
        await createProduct(payload);
      }
      handleClose();
      loadProducts();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message;
      setError(
        typeof message === "string" ? message : "فشل في حفظ المنتج. حاول مرة أخرى."
      );
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (product) => {
    setDeleteDialog({
      open: true,
      id: product._id,
      name: product.productName,
      loading: false,
    });
  };

  const closeDeleteDialog = () =>
    setDeleteDialog({ open: false, id: null, name: "", loading: false });

  const handleDeleteProduct = async () => {
    if (!deleteDialog.id) return;
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    setError("");
    try {
      await deleteProduct(deleteDialog.id);
      closeDeleteDialog();
      loadProducts();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message;
      setError(
        typeof message === "string" ? message : "فشل في حذف المنتج. حاول مرة أخرى."
      );
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }));
    setPage(0);
  };

  const disabledSave =
    !form.productName.trim() ||
    !form.productCode.trim() ||
    !form.model.trim() ||
    !form.category ||
    saving;

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{  mb: 1 }}>
            إدارة المنتجات
          </Typography>
          <Typography variant="body2" color="text.secondary">
            تحكم كامل في بيانات المنتجات وربطها بالصور
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen(null)}
          sx={{ borderRadius: 3, px: 3, py: 1.2 }}
        >
          منتج جديد
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="ابحث باسم المنتج، الكود أو الوصف..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            select
            fullWidth
            label="الفئة"
            value={filters.category}
            onChange={handleFilterChange("category")}
          >
            <MenuItem value="">كل الفئات</MenuItem>
            {parentCategories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="الماركة"
            value={filters.model}
            onChange={handleFilterChange("model")}
          />
        </Grid>
      </Grid>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Paper sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المنتج</TableCell>
                <TableCell>الكود</TableCell>
                <TableCell>الفئة</TableCell>
                <TableCell>الماركة</TableCell>
                <TableCell>عدد الصور</TableCell>
                <TableCell align="right">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <InventoryIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="h6" >
                      لا توجد منتجات
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ابدأ بإضافة منتج جديد لإدارته لاحقاً
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography >
                          {product.productName}
                        </Typography>
                        {product.tags && product.tags.length > 0 && (
                          <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {product.tags.slice(0, 3).map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                            {product.tags.length > 3 && (
                              <Chip
                                label={`+${product.tags.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.category || "-"}</Typography>
                      {product.subcategory && (
                        <Typography variant="caption" color="text.secondary">
                          فرعي: {product.subcategory}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>{product.imageCount ?? 0}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="تعديل">
                        <IconButton size="small" onClick={() => handleOpen(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="منتجات لكل صفحة"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
        />
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" >
            {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="اسم المنتج"
                value={form.productName}
                onChange={handleFormChange("productName")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                label="كود المنتج"
                value={form.productCode}
                onChange={handleFormChange("productCode")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                label="الماركة"
                value={form.model}
                onChange={handleFormChange("model")}
                fullWidth
                required
                sx={{
                  mb: 2,
                  input: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                select
                label="الفئة"
                value={form.category}
                onChange={handleFormChange("category")}
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="">اختر فئة</MenuItem>
                {parentCategories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="الفئة الفرعية"
                value={form.subcategory}
                onChange={handleFormChange("subcategory")}
                fullWidth
                disabled={!form.category}
              >
                <MenuItem value="">بدون</MenuItem>
                {subcategoryOptions.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                      <Typography variant="subtitle1" >
                    السمات / المتغيرات
                  </Typography>
                  {form.variants.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      استخدمها لوصف المقاسات، الأوزان أو أي خيارات أخرى
                    </Typography>
                  )}
                </Box>

                {form.variants.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    لا توجد سمات مضافة حتى الآن.
                  </Paper>
                ) : (
                  form.variants.map((variant, variantIndex) => (
                    <Box
                      key={`variant-${variantIndex}`}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        backgroundColor: theme.palette.action.hover,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2">
                          السمة #{variantIndex + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveVariant(variantIndex)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <TextField
                        label="اسم السمة"
                        value={variant.name}
                        onChange={(event) =>
                          handleVariantNameChange(variantIndex, event.target.value)
                        }
                        fullWidth
                        sx={{
                          mb: 2,
                          input: {
                            textAlign: "right",
                          },
                        }}
                      />
                      {variant.values.map((value, valueIndex) => (
                        <Box
                          key={`variant-${variantIndex}-value-${valueIndex}`}
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <TextField
                            label={`قيمة ${valueIndex + 1}`}
                            value={value}
                            onChange={(event) =>
                              handleVariantValueChange(
                                variantIndex,
                                valueIndex,
                                event.target.value
                              )
                            }
                            fullWidth
                            sx={{
                              input: {
                                textAlign: "right",
                              },
                            }}
                          />
                          <Tooltip title="إزالة القيمة">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleRemoveVariantValue(variantIndex, valueIndex)
                                }
                                disabled={variant.values.length === 1}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      ))}
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddVariantValue(variantIndex)}
                        sx={{ borderRadius: 3 }}
                      >
                        إضافة قيمة
                      </Button>
                    </Box>
                  ))
                )}

                <Button
                  fullWidth={form.variants.length === 0}
                  variant={form.variants.length === 0 ? "outlined" : "text"}
                  startIcon={<AddIcon />}
                  onClick={handleAddVariant}
                  sx={{ borderRadius: 3 }}
                >
                  إضافة سمة جديدة
                </Button>
              </Box>

              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" >
                      الصور المرتبطة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      اختر صوراً جاهزة من مكتبة الوسائط لربطها بهذا المنتج
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<PhotoLibraryIcon />}
                      onClick={openImageDialog}
                      sx={{ borderRadius: 3 }}
                    >
                      اختيار من المخزن
                    </Button>
                  </Box>
                </Box>

                {selectedImagesLoading ? (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircularProgress size={24} />
                    <Typography>جاري تحميل معلومات الصور...</Typography>
                  </Box>
                ) : selectedImages.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    <PhotoLibraryIcon sx={{ mb: 1 }} />
                    <Typography>لا توجد صور مرتبطة حالياً.</Typography>
                    <Typography variant="body2">استخدم زر "اختيار من المخزن" أعلاه.</Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {selectedImages.map((image) => {
                      const url = image.watermarkedUrl || image.originalUrl || "";
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                pt: "56.25%",
                                backgroundColor: "action.hover",
                              }}
                            >
                              {url ? (
                                <Box
                                  component="img"
                                  src={url}
                                  alt={image.productName || image.productCode || image._id}
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.secondary",
                                  }}
                                >
                                  <ImageIcon fontSize="large" />
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ p: 2, flexGrow: 1 }}>
                              <Typography >
                                {image.productName || "صورة بدون اسم"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {image.productCode || image._id}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                px: 2,
                                pb: 2,
                              }}
                            >
                              <Chip
                                label={`#${image._id.slice(-5)}`}
                                size="small"
                                variant="outlined"
                              />
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveSelectedImage(image._id)}
                              >
                                إزالة
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>

              {/* Similar Products Section */}
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      المنتجات المشابهة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      اختر منتجات مشابهة لعرضها في صفحة تفاصيل هذا المنتج
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={openSimilarProductsDialog}
                      sx={{ borderRadius: 3 }}
                    >
                      اختيار منتجات
                    </Button>
                  </Box>
                </Box>

                {selectedSimilarProductsLoading ? (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircularProgress size={24} />
                    <Typography>جاري تحميل المنتجات المشابهة...</Typography>
                  </Box>
                ) : selectedSimilarProducts.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderStyle: "dashed",
                      color: "text.secondary",
                    }}
                  >
                    <LinkIcon sx={{ mb: 1 }} />
                    <Typography>لا توجد منتجات مشابهة محددة.</Typography>
                    <Typography variant="body2">استخدم زر "اختيار منتجات" أعلاه.</Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {selectedSimilarProducts.map((product) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box sx={{ p: 2, flexGrow: 1 }}>
                            <Typography fontWeight="medium">
                              {product.productName || "منتج بدون اسم"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.productCode || product._id}
                            </Typography>
                            {product.category && (
                              <Chip
                                label={product.category}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              px: 2,
                              pb: 2,
                            }}
                          >
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveSelectedSimilarProduct(product._id)}
                            >
                              إزالة
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              <TextField
                label="الوصف"
                value={form.description}
                onChange={handleFormChange("description")}
                fullWidth
                multiline
                rows={3}
                sx={{
                  mb: 2,
                  textarea: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <TextField
                label="ملاحظات"
                value={form.note}
                onChange={handleFormChange("note")}
                fullWidth
                multiline
                rows={2}
                sx={{
                  mb: 2,
                  textarea: {
                    textAlign: "right",
                  },
                }}
                slotProps={{
                  formHelperText: {
                    sx: { textAlign: "right" },
                  },
                }}
              />
              <Box
                sx={{
                  border: `1px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  الوسوم
                </Typography>
                <TextField
                  placeholder="اكتب الوسم واضغط إنتر"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  fullWidth
                  helperText="مثال: جديد، مميز، عرض"
                  sx={{
                    mb: 1,
                    input: {
                      textAlign: "right",
                    },
                  }}
                  slotProps={{
                    formHelperText: {
                      sx: { textAlign: "right" },
                    },
                  }}
                />
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addTagFromInput}
                  sx={{ borderRadius: 3, mb: 1 }}
                >
                  إضافة الوسم الحالي
                </Button>
                {form.tags.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    لا توجد وسوم مضافة حالياً.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {form.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleTagDelete(tag)}
                        deleteIcon={<CloseIcon />}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={disabledSave}
            startIcon={saving ? <CircularProgress size={18} /> : null}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {saving ? "جارٍ الحفظ..." : editingProduct ? "حفظ التعديلات" : "إنشاء المنتج"}
          </Button>
          <Button onClick={handleClose} sx={{ borderRadius: 3 }}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={imageDialogOpen}
        onClose={closeImageDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" >
            مكتبة الصور
          </Typography>
          <IconButton onClick={closeImageDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="ابحث باسم المنتج، الكود أو الوسوم..."
                value={imageLibraryQuery.search}
                onChange={handleImageSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {[
                  { value: "unassigned", label: "صور متاحة" },
                  { value: "assigned", label: "صور مرتبطة" },
                  { value: "all", label: "الكل" },
                ].map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    color={imageLibraryQuery.assigned === option.value ? "primary" : "default"}
                    variant={imageLibraryQuery.assigned === option.value ? "filled" : "outlined"}
                    onClick={() => handleImageFilterChange(option.value)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          {imageLibrary.loading && imageLibrary.items.length === 0 ? (
            <Grid container spacing={2}>
              {Array.from({ length: imageLibraryQuery.rowsPerPage }).map((_, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : imageLibrary.items.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderStyle: "dashed",
                color: "text.secondary",
              }}
            >
              <PhotoLibraryIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" >
                لا توجد صور مطابقة
              </Typography>
              <Typography variant="body2">
                جرّب تعديل شروط البحث أو تغيير الفلتر أعلاه.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {imageLibrary.items.map((image) => {
                const url = image.watermarkedUrl || image.originalUrl || "";
                const isSelected = selectedImageIdSet.has(image._id);
                const isAssignedToAnother =
                  image.productId &&
                  (!editingProduct || image.productId !== editingProduct._id);
                const isSelectable = !isAssignedToAnother || isSelected;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image._id}>
                    <Card
                      onClick={() => {
                        if (!isSelectable) return;
                        toggleImageSelection(image);
                      }}
                      sx={{
                        borderRadius: 3,
                        cursor: isSelectable ? "pointer" : "not-allowed",
                        opacity: isSelectable ? 1 : 0.55,
                        position: "relative",
                      }}
                    >
                      <Box sx={{ position: "relative", pt: "56.25%" }}>
                        {url ? (
                          <Box
                            component="img"
                            src={url}
                            alt={image.productName || image.productCode || image._id}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "text.secondary",
                            }}
                          >
                            <ImageIcon fontSize="large" />
                          </Box>
                        )}
                        {isSelected && (
                          <CheckCircleIcon
                            color="success"
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              backgroundColor: "background.paper",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography >
                          {image.productName || "صورة بدون اسم"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {image.productCode || image._id}
                        </Typography>
                        {isAssignedToAnother && (
                          <Chip
                            label="مربوطة بمنتج آخر"
                            color="warning"
                            size="small"
                          />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <TablePagination
            component="div"
            count={imageLibrary.total}
            page={imageLibraryQuery.page}
            onPageChange={handleImagePageChange}
            rowsPerPage={imageLibraryQuery.rowsPerPage}
            onRowsPerPageChange={handleImageRowsChange}
            rowsPerPageOptions={[6, 12, 24]}
            labelRowsPerPage="صور لكل صفحة"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            تم اختيار {selectedImages.length} {selectedImages.length === 1 ? "صورة" : "صور"} لهذا
            المنتج.
          </Typography>
          <Button onClick={closeImageDialog} sx={{ borderRadius: 3 }}>
            تم
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <WarningIcon color="error" />
          <Typography variant="h6" >
            تأكيد الحذف
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography>
            هل أنت متأكد من حذف المنتج "{deleteDialog.name}"؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
          }}
        >
          <Button onClick={closeDeleteDialog} disabled={deleteDialog.loading}>
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
            startIcon={
              deleteDialog.loading ? <CircularProgress size={16} /> : <DeleteIcon />
            }
            disabled={deleteDialog.loading}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Similar Products Dialog */}
      <Dialog
        open={similarProductsDialogOpen}
        onClose={closeSimilarProductsDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6">
            اختيار المنتجات المشابهة
          </Typography>
          <IconButton onClick={closeSimilarProductsDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                placeholder="ابحث باسم المنتج أو الكود..."
                value={productsLibraryQuery.search}
                onChange={handleProductsSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {productsLibrary.loading && productsLibrary.items.length === 0 ? (
            <Grid container spacing={2}>
              {Array.from({ length: productsLibraryQuery.rowsPerPage }).map((_, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : productsLibrary.items.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderStyle: "dashed",
                color: "text.secondary",
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6">
                لا توجد منتجات مطابقة
              </Typography>
              <Typography variant="body2">
                جرّب تعديل شروط البحث.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {productsLibrary.items.map((product) => {
                const isSelected = selectedSimilarProductIdSet.has(product._id);
                const isCurrentProduct = editingProduct && product._id === editingProduct._id;
                const isSelectable = !isCurrentProduct;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                    <Card
                      onClick={() => {
                        if (!isSelectable) return;
                        toggleSimilarProductSelection(product);
                      }}
                      sx={{
                        borderRadius: 3,
                        cursor: isSelectable ? "pointer" : "not-allowed",
                        opacity: isSelectable ? 1 : 0.55,
                        position: "relative",
                        border: isSelected ? `2px solid ${theme.palette.primary.main}` : undefined,
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="medium">
                              {product.productName || "منتج بدون اسم"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {product.productCode}
                            </Typography>
                            {product.category && (
                              <Chip
                                label={product.category}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          {isSelected && (
                            <CheckCircleIcon
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                        {isCurrentProduct && (
                          <Chip
                            label="المنتج الحالي"
                            color="warning"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <TablePagination
            component="div"
            count={productsLibrary.total}
            page={productsLibraryQuery.page}
            onPageChange={handleProductsPageChange}
            rowsPerPage={productsLibraryQuery.rowsPerPage}
            onRowsPerPageChange={handleProductsRowsChange}
            rowsPerPageOptions={[6, 12, 24]}
            labelRowsPerPage="منتجات لكل صفحة"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            تم اختيار {selectedSimilarProducts.length} {selectedSimilarProducts.length === 1 ? "منتج" : "منتجات"} مشابهة.
          </Typography>
          <Button onClick={closeSimilarProductsDialog} sx={{ borderRadius: 3 }}>
            تم
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

