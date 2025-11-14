import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link as MuiLink,
  Divider,
  IconButton,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { WhatsApp, Facebook, Instagram } from "@mui/icons-material";

const quickLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "الكتالوج", path: "/catalog" },
  { label: "تواصل واتساب", path: "/catalog#cta" },
];

const socialLinks = [
  { icon: Facebook, label: "فيسبوك", href: "#" },
  { icon: Instagram, label: "انستغرام", href: "#" },
  { icon: WhatsApp, label: "واتساب", href: "#" },
];

export default function SiteFooter() {
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "967775017485";

  return (
    <Box component="footer" sx={{ bgcolor: "grey.100", mt: 6, pt: 6 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h5" sx={{  mb: 1 }}>
              شركة علي سعيد المرحومي الغامدي وأبنائه المحدودة
            </Typography>
            <Typography color="text.secondary">
              نوفّر معدات وأدوات المطاعم والمطابخ والكافيهات والفنادق بالجملة منذ
              عام 1955 مع التزام بالجودة، الضمان، وخدمة ما بعد البيع.
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <IconButton
                  key={label}
                  color="primary"
                  size="small"
                  component="a"
                  href={href}
                  aria-label={`تابعنا على ${label}`}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              روابط سريعة
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.path}
                  component={NavLink}
                  to={link.path}
                  color="text.secondary"
                  underline="none"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              تواصل معنا
            </Typography>
            <Stack spacing={1}>
              <Typography color="text.secondary">
                العنوان: جدة، حي الهنداوية - شارع شجرة الزيتون – مركز بن شيهون
              </Typography>
              <Typography color="text.secondary">الهاتف: 012 647 7825</Typography>
              <Typography color="text.secondary">
                البريد: almarhomi@almrhomi1955.com
              </Typography>
              <MuiLink
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                واتساب مباشر
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", pb: 3 }}
        >
          © {new Date().getFullYear()} الرحومي. جميع الحقوق محفوظة.
        </Typography>
      </Container>
    </Box>
  );
}

