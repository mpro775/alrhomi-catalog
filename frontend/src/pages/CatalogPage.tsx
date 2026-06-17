import { useState, useEffect, ReactNode } from "react";
import {
  Container,
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  Grid,
  Stack,
  Button,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  Paper,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import {
  Tune,
  RefreshRounded,
  SearchOffRounded,
  ErrorOutlineRounded,
} from "@mui/icons-material";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import { searchProducts } from "../api/products";
import { fetchCategories } from "../api/admin";
import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";
import type { Product, Category } from "../types/models.types";

type CatalogFilters = {
  q: string;
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const parsePageParam = (value: string | null): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const cardSx = {
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 3,
  boxShadow: "var(--shadow-soft)",
} as const;

const StateWrap = ({ children }: { children: ReactNode }) => (
  <Paper
    elevation={0}
    sx={{
      ...cardSx,
      p: { xs: 4, md: 8 },
      textAlign: "center",
    }}
  >
    <Stack spacing={2} alignItems="center">
      {children}
    </Stack>
  </Paper>
);

export default function CatalogPage() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filters: CatalogFilters = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const page = parsePageParam(searchParams.get("page"));

  const [data, setData] = useState<{
    items: Product[];
    totalPages: number;
    totalItems: number;
  }>({
    items: [],
    totalPages: 1,
    totalItems: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const limit = isMdUp ? 12 : 8;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 100 });
        setCategories(res.items || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await searchProducts({
          q: filters.q,
          category: filters.category,
          page,
          limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        setData({
          items: res.data.items,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalItems || 0,
        });
      } catch {
        setError("تعذّر تحميل المنتجات حالياً. تأكد من اتصالك وحاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.q,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
    page,
    limit,
    reloadKey,
  ]);

  const handleFilterChange = (
    payload: Partial<CatalogFilters & { page: string }>
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries({ ...filters, ...payload }).forEach(([key, val]) => {
      if (val) nextParams.set(key, String(val));
      else nextParams.delete(key);
    });

    if (!("page" in payload)) nextParams.delete("page");

    setSearchParams(nextParams);
  };

  const hasActiveFilters = Boolean(filters.q || filters.category);

  return (
    <PageTransition>
      <SEO
        title="كتالوج المرحومي · المنتجات"
        description="تصفّح تشكيلة المرحومي من أواني المطبخ ومستلزمات الضيافة والمنزل."
      />

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "2rem", md: "2.6rem" },
            }}
          >
            كتالوج المرحومي
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            اختر ما يناسب مطبخك وضيافتك، وتواصل معنا عبر واتساب لإتمام طلبك.
          </Typography>

          <Box className="motif-rule" sx={{ mt: 2 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Sidebar filters */}
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              display: {
                xs: showMobileFilters ? "block" : "none",
                md: "block",
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                ...cardSx,
                p: 3,
                position: "sticky",
                top: 88,
              }}
            >
              <Filters
                categories={categories}
                values={filters}
                onChange={handleFilterChange}
                onReset={() => setSearchParams(new URLSearchParams())}
              />
            </Paper>
          </Grid>

          {/* Main */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ ...cardSx, p: 1.5 }}>
                <SearchBar
                  value={filters.q}
                  onSearch={(q) => handleFilterChange({ q })}
                  placeholder="ابحث عن منتج..."
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  ...cardSx,
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary" }}
                >
                  {loading ? "جارٍ التحميل…" : `${data.totalItems} منتج`}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Button
                    sx={{ display: { md: "none" } }}
                    variant="outlined"
                    startIcon={<Tune />}
                    onClick={() => setShowMobileFilters((s) => !s)}
                  >
                    الفلاتر
                  </Button>

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <Select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split("-");
                        handleFilterChange({
                          sortBy,
                          sortOrder: sortOrder as "asc" | "desc",
                        });
                      }}
                    >
                      <MenuItem value="createdAt-desc">الأحدث</MenuItem>
                      <MenuItem value="createdAt-asc">الأقدم</MenuItem>
                      <MenuItem value="productName-asc">الاسم: أ - ي</MenuItem>
                      <MenuItem value="productName-desc">الاسم: ي - أ</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>

              {/* Grid / states */}
              {loading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: limit }).map((_, i) => (
                    <Grid size={{ xs: 6, sm: 6, lg: 4 }} key={i}>
                      <Box sx={{ ...cardSx, overflow: "hidden" }}>
                        <Box sx={{ paddingTop: "100%", bgcolor: "#f1e9dc" }} />
                        <Box sx={{ p: 2 }}>
                          <Box
                            sx={{
                              height: 16,
                              bgcolor: "#efe7d9",
                              borderRadius: 1,
                              mb: 1,
                            }}
                          />
                          <Box
                            sx={{
                              height: 16,
                              width: "60%",
                              bgcolor: "#efe7d9",
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : error ? (
                <StateWrap>
                  <ErrorOutlineRounded
                    sx={{ fontSize: 56, color: "warning.main" }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    حدث خطأ
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<RefreshRounded />}
                    onClick={() => setReloadKey((k) => k + 1)}
                  >
                    إعادة المحاولة
                  </Button>
                </StateWrap>
              ) : data.items.length === 0 ? (
                <StateWrap>
                  <SearchOffRounded
                    sx={{ fontSize: 56, color: "secondary.main" }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    لا توجد نتائج
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {hasActiveFilters
                      ? "لم نعثر على منتجات تطابق بحثك الحالي. جرّب تعديل الفلاتر."
                      : "لا توجد منتجات لعرضها حالياً."}
                  </Typography>

                  {hasActiveFilters && (
                    <Button
                      variant="outlined"
                      onClick={() => setSearchParams(new URLSearchParams())}
                    >
                      إعادة ضبط الفلاتر
                    </Button>
                  )}
                </StateWrap>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {data.items.map((product) => (
                      <Grid size={{ xs: 6, sm: 6, lg: 4 }} key={product._id}>
                        <ProductCard
                          _id={product._id}
                          productName={product.productName}
                          productCode={product.productCode}
                          category={
                            typeof product.category === "string"
                              ? product.category
                              : product.category?.name
                          }
                          model={product.model}
                          description={product.description}
                          originalUrl={(product as any).originalUrl || null}
                          watermarkedUrl={(product as any).watermarkedUrl || null}
                          tags={product.tags}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {data.totalPages > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                      }}
                    >
                      <Pagination
                        count={data.totalPages}
                        page={page}
                        onChange={(_, p) =>
                          handleFilterChange({ page: p.toString() })
                        }
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}