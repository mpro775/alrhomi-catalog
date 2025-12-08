// src/pages/CatalogPage.jsx
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  Skeleton,
  Grid,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ImageGrid from "../components/ImageGrid";
import { searchProducts } from "../api/products";
import { fetchCategories } from "../api/admin";
import SEO from "../components/SEO";
import { getItemListSchema, injectStructuredData } from "../utils/structuredData";

const initialFilters = {
  q: "",
  category: "",
};


export default function CatalogPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef();
  const [categories, setCategories] = useState([]);

  const limit = isMdUp ? 12 : isSmUp ? 8 : 6;

  useEffect(() => {
    debounceRef.current = debounce(async (localFilters, currentPage) => {
      setLoading(true);
      try {
        const res = await searchProducts({
          q: localFilters.q,
          category: localFilters.category,
          page: currentPage,
          limit,
        });
        setData(res.data);
      } catch (err) {
        console.error("Fetch products failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      debounceRef.current?.cancel();
    };
  }, [limit]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 100 });
        setCategories(res.data.items);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  useEffect(() => {
    debounceRef.current(filters, page);
  }, [filters, page]);

  // إضافة البيانات المنظمة للكتالوج
  useEffect(() => {
    if (data.items.length > 0) {
      const itemListSchema = getItemListSchema(data.items, filters.category);
      injectStructuredData(itemListSchema);
    }
  }, [data.items, filters.category]);

  const handleFilterChange = (payload) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...payload }));
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters(initialFilters);
  };

  const pageTitle = filters.category
    ? `${filters.category} - كتالوج الرحومي`
    : "كتالوج المنتجات - كتالوج الرحومي";
  
  const pageDescription = filters.category
    ? `تصفح مجموعة ${filters.category} في كتالوج الرحومي. صور منتجات عالية الجودة مع إمكانية التحميل المباشر.`
    : "تصفح كتالوج المنتجات الكامل في كتالوج الرحومي. مجموعة واسعة من صور المنتجات عالية الجودة لجميع الفئات.";

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`كتالوج منتجات, ${filters.category || "منتجات"}, صور منتجات, كتالوج الرحومي`}
        type="website"
      />
      <Container maxWidth="xl">
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 6, md: 8 },
          mb: 5,
          background: `linear-gradient(165deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          borderRadius: 5,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Typography variant={isMdUp ? "h3" : "h4"} sx={{ fontFamily: "'Cairo', 'Segoe UI', 'Tahoma', 'Arial', sans-serif" }}>
              كتالوج المنتجات
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 640, lineHeight: 1.7 }}
            >
              استخدم الفلاتر الذكية للوصول بسرعة إلى المنتج المثالي من بين مئات الخيارات
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          p: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        <SearchBar
          value={filters.q}
          onSearch={(q) => handleFilterChange({ q })}
          placeholder="ابحث باسم المنتج، اللون أو الكود..."
        />
      </Paper>

      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, sm: 12, md: 3 }}>
          <Filters
            categories={categories}
            values={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 12, md: 9 }} >
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" >
                <Box component="span" color="primary.main">
                  {data.totalItems}
                </Box>{" "}
                <Box component="span" color="text.secondary" >
                  منتج
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                صفحة {page} / {data.totalPages}
              </Typography>
            </Paper>

            {loading ? (
              <Grid container spacing={3}>
                {Array.from({
                  length: limit,
                }).map((_, i) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={i}>
                    <Skeleton
                      variant="rectangular"
                      height={400}
                      sx={{ borderRadius: 4 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : data.items.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  py: 10,
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h5" sx={{ mb: 2}}>
                  لم يتم العثور على نتائج
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  جرّب البحث بكلمة مفتاحية أخرى أو أعد ضبط الفلاتر
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  إعادة ضبط الفلاتر
                </Button>
              </Paper>
            ) : (
              <>
                <ImageGrid
                  images={data.items}
                  withDownload
                  onSelect={(img) => navigate(`/product/${img._id}`)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 4,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Pagination
                    count={data.totalPages}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
      </Container>
    </>
  );
}
