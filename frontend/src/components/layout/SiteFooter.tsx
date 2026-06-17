import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import { WhatsApp, PlaceOutlined } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { FC, ReactElement } from "react";
import { getWhatsAppUrl } from "../../utils/whatsapp";

const quickLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "المنتجات", to: "/catalog" },
  { label: "الفئات", to: "/categories" },
];

const SiteFooter: FC = (): ReactElement => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        pt: 8,
        pb: 4,
        bgcolor: "primary.main",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "#fff",
                fontFamily: "'El Messiri', sans-serif",
              }}
            >
              المرحومي
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.9,
                maxWidth: 420,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              أناقة الضيافة العربية في كل تفصيل — أواني وأدوات المطبخ، أطقم القهوة والشاي، صواني
              التقديم، المباخر، ومستلزمات البيت بجودة عالية وأسعار في المتناول.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 2.5, color: "#fff" }}
            >
              روابط سريعة
            </Typography>

            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    textDecoration: "none",
                    width: "fit-content",
                    transition: "color 0.25s ease",
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 2.5, color: "#fff" }}
            >
              تواصل معنا
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlined sx={{ fontSize: 20, color: "secondary.main" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
                  المملكة العربية السعودية
                </Typography>
              </Stack>

              <MuiLink
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "secondary.main",
                  textDecoration: "none",
                  fontWeight: 700,
                  width: "fit-content",
                }}
              >
                <WhatsApp sx={{ fontSize: 20 }} />
                الطلب والاستفسار عبر واتساب
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: "rgba(255,255,255,0.15)" }} />

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}
        >
          © {new Date().getFullYear()} المرحومي · جميع الحقوق محفوظة
        </Typography>
      </Container>
    </Box>
  );
};

export default SiteFooter;