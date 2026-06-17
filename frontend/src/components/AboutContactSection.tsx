import { Box, Container, Typography, Grid, Stack, Button } from "@mui/material";
import {
  WhatsApp,
  VerifiedOutlined,
  Inventory2Outlined,
  BoltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { FC, ReactElement } from "react";
import { getWhatsAppUrl } from "../utils/whatsapp";

const highlights = [
  { icon: <VerifiedOutlined />, title: "جودة عالية", text: "خامات متينة وتشطيبات أنيقة تليق بمائدتك." },
  { icon: <Inventory2Outlined />, title: "تشكيلة واسعة", text: "من أطقم القهوة والشاي إلى الديكور والمباخر." },
  { icon: <BoltOutlined />, title: "خدمة سريعة", text: "نرد على طلبك واستفسارك عبر واتساب خلال دقائق." },
];

const AboutContactSection: FC = (): ReactElement => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          {/* About */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 800, letterSpacing: 2 }}>
                عن المرحومي
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                أناقة الضيافة العربية{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  في بيتك
                </Box>
              </Typography>

              <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.08rem" }}>
                في المرحومي نختار لك أجمل أواني وأدوات المطبخ، أطقم القهوة والشاي، صواني التقديم،
                المباخر، ومستلزمات الضيافة والمنزل — بجودة عالية وذوق عربي أصيل وأسعار في المتناول، لتكون
                ضيافتك دائماً على أكمل وجه.
              </Typography>

              <Grid container spacing={2}>
                {highlights.map((h) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={h.title}>
                    <Box
                      sx={{
                        height: "100%",
                        p: 2.5,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        boxShadow: "var(--shadow-soft)",
                      }}
                    >
                      <Box sx={{ color: "secondary.main", mb: 1 }}>{h.icon}</Box>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{h.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {h.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                bgcolor: "primary.main",
                color: "#fff",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, color: "#fff" }}>
                اطلب واستفسر مباشرة
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,0.82)", mb: 4, lineHeight: 1.9 }}>
                اختر ما يعجبك من الكتالوج وراسلنا على واتساب، وسنساعدك في إتمام طلبك بسهولة وسرعة.
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                <PlaceOutlined sx={{ color: "secondary.main" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                  المملكة العربية السعودية
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                startIcon={<WhatsApp />}
                onClick={() => window.open(getWhatsAppUrl(), "_blank")}
                sx={{ py: 1.6, color: "#fff" }}
              >
                تواصل عبر واتساب
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutContactSection;