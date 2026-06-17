import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  IconButton,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WhatsApp from "@mui/icons-material/WhatsApp";
import Category from "@mui/icons-material/Category";
import Style from "@mui/icons-material/Style";
import QrCode from "@mui/icons-material/QrCode";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocalOffer from "@mui/icons-material/LocalOffer";
import Info from "@mui/icons-material/Info";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ImageGrid from "../components/ImageGrid";
import { getProductById } from "../api/products";
import { getRelatedImages } from "../api/images";
import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";
import ImageThumbnails from "../components/ImageThumbnails";
import ImageLightbox from "../components/ImageLightbox";
import { Helmet } from "react-helmet-async";
import { getWhatsAppUrl, buildProductWhatsAppMessage } from "../utils/whatsapp";
import {
  getProductSchema,
  getBreadcrumbSchema,
  injectMultipleSchemas,
} from "../utils/structuredData";
import { Product } from "../types/models.types";

// Type for related images in the grid
interface RelatedImage {
  _id: string;
  productName?: string;
  productCode?: string;
  category?: string;
  model?: string;
  originalUrl?: string;
  watermarkedUrl?: string;
}

export default function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id!);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError(t('product.load_error'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, t]);

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
        // res.data is Image[] from AxiosResponse
        const relatedData = Array.isArray(res.data) ? res.data : [];
        setRelated(relatedData);
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
        name: product.productName || "منتج",
        description: product.description || `منتج ${product.productName || "منتج"} عالية الجودة`,
        imageUrl: firstImage || undefined,
        category: product.category || "منتجات عامة",
      });

      const breadcrumbSchema = getBreadcrumbSchema([
        { name: t('home.hero_badge'), path: "/" },
        { name: t('catalog.title'), path: "/catalog" },
        { name: product.productName || t('product.details'), path: `/product/${product._id}` },
      ]);

      injectMultipleSchemas([productSchema, breadcrumbSchema]);
    }
  }, [product, t]);

  const metaInfo = useMemo(() => {
    if (!product) return [];
    return [
      {
        label: t('product.labels.category'),
        value: product.category,
        icon: Category,
        color: "primary" as const,
      },
      {
        label: t('product.labels.model'),
        value: product.model,
        icon: Style,
        color: "secondary" as const,
      },
      {
        label: t('product.labels.code'),
        value: product.productCode || product._id?.slice(-8)?.toUpperCase(),
        icon: QrCode,
        color: "info" as const,
        copyable: true,
      },
      {
        label: t('product.labels.created_at'),
        value: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          : "—",
        icon: CalendarToday,
        color: "success" as const,
      },
    ];
  }, [product, t]);

  const pageTitle = product
    ? `${product.productName || t('product.details')} - ${t('home.hero_title')}`
    : `${t('product.details')} - ${t('home.hero_title')}`;

  const pageDescription = product
    ? `تفاصيل ${product.productName || "منتج"} في كتالوج المرحومي${product.category ? ` - فئة ${product.category}` : ""
    }. منتج عالي الجودة مع صور متعددة.`
    : "تفاصيل المنتج في كتالوج المرحومي. صور منتجات عالية الجودة.";

  return (
    <PageTransition>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${product?.productName || "منتج"}, ${product?.category || "منتجات"}, صور منتجات, كتالوج المرحومي`}
        image={product?.images && product.images.length > 0 ? (product.images[0].watermarkedUrl || product.images[0].originalUrl) : "/logo512.png"}
        type="product"
      />
      <Helmet>
        {product?.productCode && (
          <meta property="product:retailer_item_id" content={product.productCode} />
        )}
        <meta property="product:brand" content="المرحومي" />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
      </Helmet>
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          py: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 10, sm: 3, md: 4 },
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
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
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
                  <>
                    <Paper
                      elevation={0}
                      className={theme.palette.mode === 'dark' ? 'glass' : 'glass-light'}
                      sx={{
                        borderRadius: 5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: theme.shadows[10],
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          product?.images && product.images.length > 0
                            ? (product.images[selectedImageIndex]?.watermarkedUrl || product.images[selectedImageIndex]?.originalUrl)
                            : undefined
                        }
                        alt={product?.productName || product?.description || ""}
                        onClick={() => setLightboxOpen(true)}
                        sx={{
                          width: "100%",
                          height: "auto",
                          maxHeight: { xs: 400, sm: 500, md: 600, lg: 700 },
                          objectFit: "contain",
                          display: "block",
                          p: { xs: 2, sm: 4 },
                          cursor: "zoom-in",
                          transition: "transform 0.5s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                          }
                        }}
                      />
                    </Paper>

                    {product?.images && product.images.length > 1 && (
                      <ImageThumbnails
                        images={product.images}
                        selectedIndex={selectedImageIndex}
                        onSelect={setSelectedImageIndex}
                      />
                    )}
                  </>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 7 }}>
              {loading ? (
                <Stack spacing={3}>
                  <Skeleton width="70%" height={60} />
                  <Skeleton width="40%" height={30} />
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
                </Stack>
              ) : (
                <Stack spacing={4}>
                  {/* Title & Badge */}
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 2,
                        fontWeight: 800,
                        color: "primary.main",
                        lineHeight: 1.2,
                      }}
                    >
                      {product?.productName || product?.description}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        label={product?.category}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                      <Chip
                        label={product?.model}
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </Stack>
                  </Box>

                  {product?.note && (
                    <Paper
                      elevation={0}
                      className="glass-light"
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Info color="primary" />
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {product?.note}
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

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
                      {t('catalog.categories')}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={{ xs: 1, sm: 1.5 }}
                      flexWrap="wrap"
                      gap={{ xs: 1, sm: 1.5 }}
                    >
                      <Chip
                        icon={<Category sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                        label={product?.category}
                        color="primary"
                        sx={{
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          py: { xs: 2, sm: 2.5 },
                          px: { xs: 0.5, sm: 1 },
                          height: { xs: 36, sm: 40 },
                          "& .MuiChip-icon": { mr: 0.5 },
                        }}
                      />
                      {product?.model && (
                        <Chip
                          icon={<Style sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                          label={product?.model}
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
                      {t('product.specs')}
                    </Typography>
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                      {metaInfo.map(
                        (item) =>
                          item.value && (
                            <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
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
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Stack direction="row" spacing={1} alignItems="center">
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

                                      {item.copyable && (
                                        <Tooltip title={t('product.copy_code')}>
                                          <IconButton
                                            size="small"
                                            onClick={() => handleCopyCode(item.value!)}
                                            sx={{
                                              color: `${item.color}.main`,
                                              "&:hover": {
                                                bgcolor: alpha(
                                                  theme.palette[item.color].main,
                                                  0.1
                                                ),
                                              },
                                            }}
                                          >
                                            <ContentCopy sx={{ fontSize: 16 }} />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Stack>
                                    <Typography
                                      sx={{
                                        fontSize: { xs: "0.9rem", sm: "1rem" },
                                        pr: { xs: 1, sm: 1 },
                                        wordBreak: "break-word",
                                        fontWeight: item.copyable ? 700 : 400,
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
                  {product?.description && (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: { xs: 2, sm: 2.5 },
                          fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        }}
                      >
                        {t('product.description')}
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
                          {product?.description}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* زر واتساب */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    className="animate-pulse-glow"
                    endIcon={
                      <WhatsApp sx={{ fontSize: { xs: 24, sm: 28 }, ml: 1 }} />
                    }
                    onClick={() => {
                      const message = buildProductWhatsAppMessage({
                        productName: product?.productName,
                        productCode: product?.productCode,
                        category: typeof product?.category === "string" ? product.category : undefined,
                        model: product?.model,
                        url: `${window.location.origin}/product/${product?._id}`,
                      });
                      window.open(
                        getWhatsAppUrl(message),
                        "_blank"
                      );
                    }}
                    sx={{
                      py: 2.5,
                      borderRadius: 4,
                      fontSize: "1.2rem",
                      background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                      boxShadow: `0 10px 20px ${alpha("#25D366", 0.3)}`,
                      "&:hover": {
                        background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                        transform: "translateY(-4px)",
                        boxShadow: `0 15px 30px ${alpha("#25D366", 0.5)}`,
                      },
                    }}
                  >
                    {t('product.whatsapp_inquiry')}
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
                {t('product.gallery')}
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
                onSelect={(_img) => {
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
              {t('product.similar_products')}
            </Typography>
            {relatedLoading ? (
              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Grid size={{ xs: 6, sm: 6, md: 3 }} key={idx}>
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
                  {t('product.no_related')}
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

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setCopySuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {t('product.code_copied')}
        </MuiAlert>
      </Snackbar>

      {product && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            p: 2,
            bgcolor: "background.paper",
            borderTop: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            startIcon={<WhatsApp />}
            onClick={() => {
              const message = buildProductWhatsAppMessage({
                productName: product.productName,
                productCode: product.productCode,
                category: typeof product.category === "string" ? product.category : undefined,
                model: product.model,
                url: `${window.location.origin}/product/${product._id}`,
              });
              window.open(getWhatsAppUrl(message), "_blank");
            }}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              boxShadow: `0 4px 12px ${alpha("#25D366", 0.3)}`,
              "&:hover": {
                background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
              },
            }}
          >
            {t('product.whatsapp_inquiry')}
          </Button>
        </Box>
      )}

      {product?.images && (
        <ImageLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={product.images}
          currentIndex={selectedImageIndex}
          onNavigate={setSelectedImageIndex}
        />
      )}
    </PageTransition>
  );
}

