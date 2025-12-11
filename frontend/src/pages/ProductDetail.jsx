import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Skeleton,
  Chip,
  Stack,
  Divider,
  Paper,
  Button,
  Card,
  CardContent,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  WhatsApp,
  Category,
  Style,
  QrCode,
  CalendarToday,
  LocalOffer,
  Info,
} from "@mui/icons-material";
import ImageGrid from "../components/ImageGrid";
import { getProductById } from "../api/products";
import { getRelatedImages } from "../api/images";
import SEO from "../components/SEO";
import {
  getProductSchema,
  getBreadcrumbSchema,
  injectMultipleSchemas,
} from "../utils/structuredData";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("تعذر تحميل بيانات المنتج");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!product?._id) return;
    
    // If product has manually selected similar products, use them
    if (product.similarProducts && product.similarProducts.length > 0) {
      // Transform similar products to match ImageGrid expected format
      const transformedSimilarProducts = product.similarProducts.map((p) => ({
        _id: p._id,
        productName: p.productName,
        productCode: p.productCode,
        category: p.category,
        model: p.model,
        originalUrl: p.originalUrl,
        watermarkedUrl: p.watermarkedUrl,
      }));
      setRelated(transformedSimilarProducts);
      setRelatedLoading(false);
      return;
    }

    // Otherwise, fetch automatic related products
    (async () => {
      setRelatedLoading(true);
      try {
        const res = await getRelatedImages(product._id);
        setRelated(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch related products", err);
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    })();
  }, [product?._id, product?.similarProducts]);

  // إضافة البيانات المنظمة للمنتج
  useEffect(() => {
    if (product) {
      const firstImage = product.images && product.images.length > 0 
        ? (product.images[0].watermarkedUrl || product.images[0].originalUrl)
        : null;
      
      const productSchema = getProductSchema({
        id: product._id,
        name: product.productName || product.name || "منتج",
        description: product.description || `منتج ${product.productName || "منتج"} عالية الجودة`,
        imageUrl: firstImage,
        category: product.category || "منتجات عامة",
      });

      const breadcrumbSchema = getBreadcrumbSchema([
        { name: "الرئيسية", path: "/" },
        { name: "الكتالوج", path: "/catalog" },
        { name: product.productName || product.name || "المنتج", path: `/product/${product._id}` },
      ]);

      injectMultipleSchemas([productSchema, breadcrumbSchema]);
    }
  }, [product]);

  const metaInfo = useMemo(() => {
    if (!product) return [];
    return [
      {
        label: "الفئة",
        value: product.category,
        icon: Category,
        color: "primary",
      },
      {
        label: "الموديل",
        value: product.model,
        icon: Style,
        color: "secondary",
      },
      {
        label: "الكود",
        value: product._id?.slice(-8)?.toUpperCase(),
        icon: QrCode,
        color: "info",
      },
      {
        label: "تاريخ الإنشاء",
        value: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "—",
        icon: CalendarToday,
        color: "success",
      },
    ];
  }, [product]);

  const pageTitle = product
    ? `${product.productName || product.name || "منتج"} - كتالوج الرحومي`
    : "تفاصيل المنتج - كتالوج الرحومي";
  
  const pageDescription = product
    ? `تفاصيل ${product.productName || product.name || "منتج"} في كتالوج الرحومي${
        product.category ? ` - فئة ${product.category}` : ""
      }. منتج عالي الجودة مع صور متعددة.`
    : "تفاصيل المنتج في كتالوج الرحومي. صور منتجات عالية الجودة.";

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${product?.productName || product?.name || "منتج"}, ${product?.category || "منتجات"}, صور منتجات, كتالوج الرحومي`}
        image={product?.images && product.images.length > 0 ? (product.images[0].watermarkedUrl || product.images[0].originalUrl) : "/logo512.png"}
        type="product"
      />
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            الرئيسية
          </Link>
          <Link
            component={RouterLink}
            to="/catalog"
            sx={{
              textDecoration: "none",
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            الكتالوج
          </Link>
          <Typography
            color="text.primary"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {product?.productName || product?.description || "تفاصيل المنتج"}
          </Typography>
        </Breadcrumbs>

        {error && (
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: { xs: 4, sm: 6 },
              mx: { xs: 1, sm: 0 },
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography color="error" variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              {error}
            </Typography>
          </Paper>
        )}

        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          <Grid item size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "100%",
                    height: { xs: 300, sm: 400, md: 500, lg: 600 },
                    borderRadius: 4,
                  }}
                />
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: { xs: 3, sm: 4 },
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha(
                        theme.palette.primary.main,
                        0.05
                      )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={
                      product.images && product.images.length > 0
                        ? (product.images[0].watermarkedUrl || product.images[0].originalUrl)
                        : null
                    }
                    alt={product.productName || product.description}
                    sx={{
                      width: "100%",
                      height: "auto",
                      maxHeight: { xs: 400, sm: 500, md: 600, lg: 700 },
                      objectFit: "contain",
                      display: "block",
                      position: "relative",
                      zIndex: 1,
                      p: { xs: 2, sm: 3 },
                    }}
                  />
                </Paper>
              )}
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, sm: 12, md: 6, lg: 7 }}>
            {loading ? (
              <Stack spacing={3} sx={{ px: { xs: 1, sm: 0 } }}>
                <Skeleton width="70%" height={50} />
                <Skeleton width="50%" height={30} />
                <Skeleton width="90%" height={100} />
              </Stack>
            ) : (
              <Stack spacing={{ xs: 3, sm: 3.5, md: 4 }} sx={{ px: { xs: 1, sm: 0 } }}>
                {/* العنوان والوصف */}
                <Box>
                  <Typography
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem", lg: "3rem" },
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1.2,
                    }}
                  >
                    {product.productName || product.description}
                  </Typography>
                  {product.note && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: { xs: 2, sm: 2.5 },
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        border: `1px dashed ${alpha(
                          theme.palette.info.main,
                          0.3
                        )}`,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 1.5 }}
                        alignItems="flex-start"
                      >
                        <Info
                          sx={{
                            color: "info.main",
                            fontSize: { xs: 18, sm: 20 },
                            mt: 0.3,
                          }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.8,
                            flex: 1,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          }}
                        >
                          {product.note}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}
                </Box>

                {/* التاجات */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: { xs: "0.875rem", sm: "0.975rem" },
                    }}
                  >
                    <LocalOffer sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    التصنيفات
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, sm: 1.5 }}
                    flexWrap="wrap"
                    gap={{ xs: 1, sm: 1.5 }}
                  >
                    <Chip
                      icon={<Category sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                      label={product.category}
                      color="primary"
                      sx={{
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        py: { xs: 2, sm: 2.5 },
                        px: { xs: 0.5, sm: 1 },
                        height: { xs: 36, sm: 40 },
                        "& .MuiChip-icon": { mr: 0.5 },
                      }}
                    />
                    {product.model && (
                      <Chip
                        icon={<Style sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                        label={product.model}
                        color="secondary"
                        variant="outlined"
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          py: { xs: 2, sm: 2.5 },
                          px: { xs: 0.5, sm: 1 },
                          height: { xs: 36, sm: 40 },
                          borderWidth: 2,
                          "& .MuiChip-icon": { mr: 0.5 },
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />

                {/* معلومات المنتج */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: { xs: 2, sm: 2.5 },
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    معلومات المنتج
                  </Typography>
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {metaInfo.map(
                      (item) =>
                        item.value && (
                          <Grid item size={{ xs: 12, sm: 6 }} key={item.label}>
                            <Card
                              elevation={0}
                              sx={{
                                height: "100%",
                                borderRadius: { xs: 2.5, sm: 3 },
                                border: `1px solid ${alpha(
                                  theme.palette[item.color].main,
                                  0.2
                                )}`,
                                bgcolor: alpha(
                                  theme.palette[item.color].main,
                                  0.04
                                ),
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: alpha(
                                    theme.palette[item.color].main,
                                    0.08
                                  ),
                                  transform: "translateY(-2px)",
                                  boxShadow: `0 4px 12px ${alpha(
                                    theme.palette[item.color].main,
                                    0.15
                                  )}`,
                                },
                              }}
                            >
                              <CardContent
                                sx={{
                                  p: { xs: 2, sm: 2.5 },
                                  "&:last-child": { pb: { xs: 2, sm: 2.5 } },
                                }}
                              >
                                <Stack spacing={{ xs: 1.5, sm: 1.5 }}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: { xs: 28, sm: 32 },
                                        height: { xs: 28, sm: 32 },
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        bgcolor: alpha(
                                          theme.palette[item.color].main,
                                          0.15
                                        ),
                                      }}
                                    >
                                      <item.icon
                                        sx={{
                                          color: `${item.color}.main`,
                                          fontSize: { xs: 16, sm: 18 },
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    sx={{
                                      fontSize: { xs: "0.9rem", sm: "1rem" },
                                      pr: { xs: 4, sm: 5 },
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.value}
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
                  </Grid>
                </Box>

                {/* وصف المنتج */}
                {product.description && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: { xs: 2, sm: 2.5 },
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      }}
                    >
                      وصف المنتج
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: { xs: 2.5, sm: 3 },
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{
                          lineHeight: 2,
                          fontSize: { xs: "0.95rem", sm: "1.05rem" },
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {product.description}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* زر واتساب */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={
                    <WhatsApp sx={{ fontSize: { xs: 24, sm: 28 }, ml: 1 }} />
                  }
                  onClick={() => {
                    const productUrl = `${window.location.origin}/product/${product._id}`;
                    const message = `مرحباً، أرغب في الاستفسار عن المنتج:\n${
                      product.productName || product.description
                    }\n\nرابط المنتج: ${productUrl}`;
                    window.open(
                      `https://wa.me/967775017485?text=${encodeURIComponent(message)}`,
                      "_blank"
                    );
                  }}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 2.5, sm: 3 },
                    fontSize: { xs: "0.95rem", sm: "1.1rem" },
                    background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                    boxShadow: `0 4px 14px ${alpha("#25D366", 0.4)}`,
                    "&:hover": {
                      background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                      transform: "translateY(-3px)",
                      boxShadow: `0 6px 20px ${alpha("#128C7E", 0.5)}`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  استفسر عن المنتج عبر واتساب
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>

        {product?.images && product.images.length > 1 && (
          <Box sx={{ mt: { xs: 6, sm: 8, md: 10 }, px: { xs: 1, sm: 0 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: { xs: 3, sm: 4 },
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              صور المنتج
            </Typography>
            <ImageGrid
              images={product.images.map(img => ({
                _id: img._id,
                productName: product.productName,
                description: product.description,
                category: product.category,
                originalUrl: img.originalUrl,
                watermarkedUrl: img.watermarkedUrl,
                isWatermarked: img.isWatermarked,
              }))}
              withDownload
              onSelect={(img) => {
                // يمكن إضافة modal للصور هنا
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: { xs: 6, sm: 8, md: 10 }, px: { xs: 1, sm: 0 } }}>
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 3, sm: 4 },
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            منتجات مشابهة
          </Typography>
          {relatedLoading ? (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                  <Grid  size={{ xs: 6, sm: 6, md: 3 }} key={idx}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      width: "100%",
                      height: { xs: 180, sm: 240, md: 280 },
                      borderRadius: { xs: 3, sm: 4 },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : related.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                py: { xs: 6, sm: 8 },
                mx: { xs: 1, sm: 0 },
                borderRadius: { xs: 3, sm: 4 },
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                color="text.secondary"
                variant="body1"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                لا توجد منتجات مشابهة حالياً
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ mx: { xs: -1, sm: 0 } }}>
              <ImageGrid
                images={related}
                onSelect={(img) => navigate(`/product/${img._id}`)}
              />
            </Box>
          )}
        </Box>
      </Container>
      </Box>
    </>
  );
}

