import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Skeleton,
  alpha,
  Breadcrumbs,
  Link,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import Home from "@mui/icons-material/Home";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import Refresh from "@mui/icons-material/Refresh";
import { fetchCategories } from "../api/admin";
import SEO from "../components/SEO";
import { Category } from "../types/models.types";
import { onImageError } from "../utils/fallbackImage";

interface OrganizedCategory extends Category {
  children: Category[];
}

export default function CategoriesPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchCategories({ page: 1, limit: 100 });
      setCategories(res.items || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("تعذر تحميل الفئات حاليًا. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const organizedCategories = useMemo(() => {
    if (loading || !categories.length) return [];

    const parentCategories = categories.filter((cat) => !cat.parent);
    const childCategories = categories.filter((cat) => cat.parent);

    const childrenMap = childCategories.reduce<Record<string, Category[]>>(
      (acc, child) => {
        const parentId =
          child.parent && typeof child.parent === "object"
            ? child.parent._id
            : null;

        if (parentId) {
          if (!acc[parentId]) {
            acc[parentId] = [];
          }
          acc[parentId].push(child);
        }

        return acc;
      },
      {}
    );

    return parentCategories.map(
      (parent): OrganizedCategory => ({
        ...parent,
        children: childrenMap[parent._id] || [],
      })
    );
  }, [categories, loading]);

  const handleCategoryClick = (category: Category) => {
    navigate(`/catalog?category=${category._id}`);
  };

  return (
    <>
      <SEO
        title="فئات المنتجات - كتالوج المرحومي"
        description="استكشف فئات المرحومي: أطقم القهوة والشاي، صواني التقديم، أواني المطبخ، المباخر ومستلزمات الضيافة والمنزل."
        keywords="فئات المنتجات, أواني المطبخ, أطقم القهوة, مستلزمات الضيافة, المرحومي"
        type="website"
      />

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Breadcrumbs sx={{ mb: 4 }} separator="›" aria-label="breadcrumb">
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: 20 }} />
              الرئيسية
            </Link>
            <Typography color="text.primary">الفئات</Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              جميع الفئات
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto", lineHeight: 1.8 }}
            >
              استكشف مجموعتنا الكاملة من الفئات والمنتجات المتخصصة
            </Typography>
          </Box>

          <Box sx={{ minHeight: 520 }}>
            {loading ? (
              <Grid container spacing={4}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Grid size={{ xs: 12, md: 6 }} key={idx}>
                    <Card
                      elevation={0}
                      sx={{ borderRadius: 4, overflow: "hidden" }}
                    >
                      <Skeleton variant="rectangular" height={250} />
                      <CardContent sx={{ p: 3 }}>
                        <Skeleton width="70%" height={32} sx={{ mb: 2 }} />
                        <Skeleton width="50%" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : error ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: "center",
                }}
              >
                <Alert severity="error" sx={{ mb: 3, textAlign: "right" }}>
                  {error}
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={loadCategories}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  إعادة المحاولة
                </Button>
              </Paper>
            ) : organizedCategories.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  py: 10,
                  px: 3,
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <FolderOutlined
                  sx={{
                    fontSize: 72,
                    color: alpha(theme.palette.text.secondary, 0.35),
                    mb: 2,
                  }}
                />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  لا توجد فئات متاحة
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 520, mx: "auto", lineHeight: 1.8 }}
                >
                  لم يتم العثور على أي فئات حاليًا. يمكنك المحاولة لاحقًا أو التحقق
                  من بيانات الفئات من لوحة الإدارة.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={6}>
                {organizedCategories.map((parentCategory) => (
                  <Box key={parentCategory._id}>
                    <Box
                      sx={{
                        mb: 3,
                        pb: 2,
                        borderBottom: `2px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: "primary.main",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <FolderOutlined sx={{ fontSize: 32 }} />
                        {parentCategory.name}
                      </Typography>

                      {parentCategory.description && (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mt: 1, lineHeight: 1.7 }}
                        >
                          {parentCategory.description}
                        </Typography>
                      )}
                    </Box>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          elevation={0}
                          onClick={() => handleCategoryClick(parentCategory)}
                          sx={{
                            borderRadius: 4,
                            height: "100%",
                            overflow: "hidden",
                            border: `2px solid ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            bgcolor: "background.paper",
                            position: "relative",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: `0 12px 40px ${alpha(
                                theme.palette.primary.main,
                                0.2
                              )}`,
                              borderColor: theme.palette.primary.main,
                              "& .category-image": {
                                transform: "scale(1.1)",
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              height: 250,
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              overflow: "hidden",
                            }}
                          >
                            {parentCategory.image ? (
                              <CardMedia
                                component="img"
                                image={parentCategory.image}
                                alt={parentCategory.name}
                                onError={onImageError}
                                className="category-image"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <FolderOutlined
                                  sx={{
                                    fontSize: 100,
                                    color: alpha(theme.palette.primary.main, 0.3),
                                  }}
                                />
                              </Box>
                            )}

                            <Box
                              sx={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                bgcolor: alpha(theme.palette.primary.main, 0.95),
                                color: "white",
                                px: 2,
                                py: 0.75,
                                borderRadius: 2,
                                fontSize: "0.875rem",
                                fontWeight: 700,
                              }}
                            >
                              {parentCategory.itemsCount ?? 0} منتج
                            </Box>
                          </Box>

                          <CardContent sx={{ p: 3.5 }}>
                            <Stack spacing={1.5}>
                              <Typography
                                variant="h5"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                }}
                              >
                                {parentCategory.name}
                              </Typography>

                              {parentCategory.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    lineHeight: 1.6,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {parentCategory.description}
                                </Typography>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>

                      {parentCategory.children.map((childCategory) => (
                        <Grid
                          size={{ xs: 12, sm: 6, md: 4 }}
                          key={childCategory._id}
                        >
                          <Card
                            elevation={0}
                            onClick={() => handleCategoryClick(childCategory)}
                            sx={{
                              borderRadius: 4,
                              height: "100%",
                              overflow: "hidden",
                              border: `1px solid ${alpha(
                                theme.palette.divider,
                                0.5
                              )}`,
                              borderRight: `4px solid ${theme.palette.secondary.main}`,
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              bgcolor: alpha(theme.palette.secondary.main, 0.02),
                              position: "relative",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: `0 12px 40px ${alpha(
                                  theme.palette.secondary.main,
                                  0.15
                                )}`,
                                borderColor: theme.palette.secondary.main,
                                "& .category-image": {
                                  transform: "scale(1.1)",
                                },
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "relative",
                                height: 200,
                                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                overflow: "hidden",
                              }}
                            >
                              {childCategory.image ? (
                                <CardMedia
                                  component="img"
                                  image={childCategory.image}
                                  alt={childCategory.name}
                                  onError={onImageError}
                                  className="category-image"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CategoryOutlined
                                    sx={{
                                      fontSize: 80,
                                      color: alpha(
                                        theme.palette.secondary.main,
                                        0.3
                                      ),
                                    }}
                                  />
                                </Box>
                              )}

                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  bgcolor: alpha(
                                    theme.palette.secondary.main,
                                    0.9
                                  ),
                                  color: "white",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 2,
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                {childCategory.itemsCount ?? 0} منتج
                              </Box>
                            </Box>

                            <CardContent sx={{ p: 3 }}>
                              <Stack spacing={1.5}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <CategoryOutlined
                                    sx={{
                                      fontSize: 18,
                                      color: "secondary.main",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "secondary.main",
                                      fontWeight: 600,
                                    }}
                                  >
                                    فرعية
                                  </Typography>
                                </Box>

                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {childCategory.name}
                                </Typography>

                                {childCategory.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      lineHeight: 1.6,
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {childCategory.description}
                                  </Typography>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}