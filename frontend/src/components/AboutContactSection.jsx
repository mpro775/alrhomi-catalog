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
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PhoneOutlined,
  EmailOutlined,
  LocationOnOutlined,
  WhatsApp,
  BusinessOutlined,
  HistoryOutlined,
  StarOutlined,
} from "@mui/icons-material";

const contactInfo = {
  address: "جدة – حي الهنداوية، شارع شجرة الزيتون – مركز بن شيهون",
  phone: "012 647 7825",
  email: "almarhomi@almrhomi1955.com",
};

export default function AboutContactSection() {
  const theme = useTheme();

  const contactItems = [
    {
      icon: LocationOnOutlined,
      label: "العنوان",
      value: contactInfo.address,
      color: "primary",
      action: null,
    },
    {
      icon: PhoneOutlined,
      label: "الهاتف",
      value: contactInfo.phone,
      color: "success",
      action: () => window.open(`tel:${contactInfo.phone}`, "_self"),
    },
    {
      icon: EmailOutlined,
      label: "البريد الإلكتروني",
      value: contactInfo.email,
      color: "warning",
      action: () => window.open(`mailto:${contactInfo.email}`, "_self"),
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        py: { xs: 8, md: 12 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `radial-gradient(circle at 20% 50%, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, transparent 50%)`,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "40%",
          height: "40%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary.main,
            0.04
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          {/* About Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  filter: "blur(40px)",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  flex: 1,
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: `0 12px 48px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 64px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                  },
                }}
              >
                <Stack spacing={3}>
                  <Box>
                    <Chip
                      icon={<HistoryOutlined />}
                      label="منذ عام 1955"
                      sx={{
                        mb: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        height: 32,
                        "& .MuiChip-icon": {
                          color: "primary.main",
                        },
                      }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        mb: 2,
                        color: "primary.main",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <BusinessOutlined
                        sx={{
                          fontSize: 36,
                          color: "primary.main",
                        }}
                      />
                      من نحن
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: "text.primary",
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      شركة علي سعيد المرحومي الغامدي وأبنائه المحدودة
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.9,
                        fontSize: "1.05rem",
                        mb: 0,
                      }}
                    >
                      رواد في تجهيز المطاعم والمطابخ التجارية منذ أكثر من 65
                      عاماً. نفخر بتقديم حلول متكاملة من معدات وأدوات عالية
                      الجودة مع خدمة عملاء استثنائية وضمان شامل لشركائنا في
                      قطاع الضيافة.
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      pt: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<StarOutlined />}
                      label="65+ عام من الخبرة"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: "success.main",
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      icon={<BusinessOutlined />}
                      label="حلول متكاملة"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: "info.main",
                        fontWeight: 500,
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: `0 12px 48px ${alpha(
                  theme.palette.primary.main,
                  0.1
                )}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 20px 64px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  p: 4,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    bgcolor: alpha("#fff", 0.1),
                    filter: "blur(40px)",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    bgcolor: alpha("#fff", 0.08),
                    filter: "blur(30px)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha("#fff", 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PhoneOutlined sx={{ fontSize: 28 }} />
                  </Box>
                  تواصل معنا
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1.5,
                    opacity: 0.9,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  نحن هنا لمساعدتك في أي استفسار
                </Typography>
              </Box>

              <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                <Stack spacing={2.5} sx={{ flex: 1 }}>
                  {contactItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Box
                        key={index}
                        onClick={item.action || undefined}
                        sx={{
                          display: "flex",
                          gap: 3,
                          p: 3,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette[item.color].main, 0.05),
                          border: `1px solid ${alpha(
                            theme.palette[item.color].main,
                            0.15
                          )}`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: item.action ? "pointer" : "default",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: alpha(theme.palette[item.color].main, 0),
                            transition: "all 0.3s ease",
                          },
                          "&:hover": item.action
                            ? {
                                bgcolor: alpha(
                                  theme.palette[item.color].main,
                                  0.1
                                ),
                                borderColor: theme.palette[item.color].main,
                                transform: "translateX(-4px)",
                                "&::before": {
                                  bgcolor: alpha(
                                    theme.palette[item.color].main,
                                    0.05
                                  ),
                                },
                                "& .contact-icon": {
                                  transform: "scale(1.1) rotate(5deg)",
                                },
                              }
                            : {},
                        }}
                      >
                        <IconButton
                          className="contact-icon"
                          sx={{
                            bgcolor: `${theme.palette[item.color].main}`,
                            color: "white",
                            width: 48,
                            height: 48,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: `${theme.palette[item.color].dark}`,
                            },
                          }}
                        >
                          <IconComponent />
                        </IconButton>
                        <Box flex={1} sx={{ minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              mb: 0.75,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                              fontSize: "0.75rem",
                            }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 500,
                              color: "text.primary",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Divider
                  sx={{
                    my: 4,
                    borderColor: alpha(theme.palette.divider, 0.5),
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<WhatsApp />}
                  onClick={() =>
                    window.open("https://wa.me/967775017485", "_blank")
                  }
                  sx={{
                    py: 1.75,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, #25D366 0%, #128C7E 100%)`,
                    boxShadow: `0 8px 24px ${alpha("#25D366", 0.3)}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: `linear-gradient(135deg, #128C7E 0%, #075E54 100%)`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px ${alpha("#25D366", 0.4)}`,
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
  );
}

