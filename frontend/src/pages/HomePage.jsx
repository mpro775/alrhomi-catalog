import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  alpha,
  Divider,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PhoneOutlined,
  EmailOutlined,
  LocationOnOutlined,
  ArrowForwardOutlined,
  WhatsApp,
  VerifiedOutlined,
  SupportAgentOutlined,
  EmojiEventsOutlined,
} from "@mui/icons-material";
import { fetchCategories } from "../api/admin";
import CategoryShowcase from "../components/CategoryShowcase";
import SEO from "../components/SEO";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  injectMultipleSchemas,
} from "../utils/structuredData";

const contactInfo = {
  address: "جدة – حي الهنداوية، شارع شجرة الزيتون – مركز بن شيهون",
  phone: "012 647 7825",
  email: "almarhomi@almrhomi1955.com",
};

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // إضافة البيانات المنظمة للصفحة الرئيسية
    injectMultipleSchemas([getOrganizationSchema(), getWebSiteSchema()]);

    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 6 });
        setCategories(res.data.items);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  return (
    <>
      <SEO
        title="كتالوج الرحومي - صور منتجات عالية الجودة"
        description="استكشف مجموعة واسعة من صور المنتجات عالية الجودة في كتالوج الرحومي. صور احترافية لجميع أنواع المنتجات مع إمكانية التحميل المباشر."
        keywords="كتالوج منتجات, صور منتجات, كتالوج الرحومي, صور احترافية, منتجات يمنية, كتالوج إلكتروني"
        type="website"
      />
      <Box sx={{ bgcolor: "background.default" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          background: `linear-gradient(165deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={4} textAlign={{ xs: "center", md: "right" }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 3,
                    py: 1,
                    borderRadius: 10,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    alignSelf: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      letterSpacing: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    منذ عام 1955
                  </Typography>
                </Box>

                <Typography
                  variant={isMdUp ? "h2" : "h3"}
                  sx={{
                    lineHeight: 1.3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  شركة علي سعيد المرحومي الغامدي وأبنائه المحدودة
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                  }}
                >
                  رائدة في بيع واستيراد معدات وأدوات المطاعم والمطابخ والكافيهات والفنادق بالجملة منذ عام 1955، مع التزام راسخ بالجودة وخدمة ما بعد البيع وضمان الصيانة.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={4}
                  sx={{ 
                    pt: 3,
                    gap: 3,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardOutlined />}
                    onClick={() => navigate("/catalog")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      boxShadow: `0 8px 24px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 32px ${alpha(
                          theme.palette.primary.main,
                          0.35
                        )}`,
                      },
                    }}
                  >
                    تصفح المنتجات
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<WhatsApp />}
                    onClick={() => window.open("https://wa.me/967775017485", "_blank")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1.1rem",
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    تواصل معنا
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3.5} sx={{ gap: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(-4px)",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ gap: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EmojiEventsOutlined 
                        sx={{ 
                          fontSize: 32, 
                          color: "primary.main" 
                        }} 
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        منذ 1955
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        خبرة في قطاع الضيافة
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(-4px)",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ gap: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerifiedOutlined 
                        sx={{ 
                          fontSize: 32, 
                          color: "secondary.main" 
                        }} 
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        منتجات معتمدة
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        تلبي احتياجات المطاعم والفنادق
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(-4px)",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" sx={{ gap: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SupportAgentOutlined 
                        sx={{ 
                          fontSize: 32, 
                          color: "success.main" 
                        }} 
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                        خدمة ما بعد البيع
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        صيانة وضمان تريح بالك
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
            }}
          >
            فئات المنتجات
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            اكتشف مجموعتنا الواسعة من المعدات والأدوات المتخصصة
          </Typography>
        </Box>

        <CategoryShowcase 
          categories={categories} 
          loading={loadingCategories} 
          limit={6}
          showMore={true}
          onMoreClick={() => navigate("/categories")}
        />
      </Container>

      <Box
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: `0 8px 40px ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )}`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    color: "primary.main",
                  }}
                >
                  من نحن
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    mb: 2.5,
                    lineHeight: 1.9,
                    fontSize: "1.05rem",
                  }}
                >
                  شركة علي سعيد المرحومي الغامدي وأبنائه المحدودة
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.9,
                    fontSize: "1.05rem",
                  }}
                >
                  رواد في تجهيز المطاعم والمطابخ التجارية منذ أكثر من 65 عاماً.
                  نفخر بتقديم حلول متكاملة من معدات وأدوات عالية الجودة مع خدمة
                  عملاء استثنائية وضمان شامل لشركائنا في قطاع الضيافة.
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    p: 3,
                  }}
                >
                  <Typography variant="h5" >
                    تواصل معنا
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3.5,
                        p: 3.5,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        <LocationOnOutlined />
                      </IconButton>
                      <Box flex={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          العنوان
                        </Typography>
                        <Typography >
                          {contactInfo.address}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 3.5,
                        p: 3.5,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                      onClick={() => window.open(`tel:${contactInfo.phone}`, "_self")}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        <PhoneOutlined />
                      </IconButton>
                      <Box flex={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          الهاتف
                        </Typography>
                        <Typography >
                          {contactInfo.phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 3.5,
                        p: 3.5,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                      onClick={() => window.open(`mailto:${contactInfo.email}`, "_self")}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      >
                        <EmailOutlined />
                      </IconButton>
                      <Box flex={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          البريد الإلكتروني
                        </Typography>
                        <Typography >
                          {contactInfo.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<WhatsApp />}
                    onClick={() => window.open("https://wa.me/967775017485", "_blank")}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: "1rem",
                      background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                      },
                    }}
                  >
                    تواصل عبر واتساب
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

    
      </Box>
    </>
  );
}

