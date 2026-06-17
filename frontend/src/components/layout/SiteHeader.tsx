import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import {
  WhatsApp,
  MenuRounded,
  CloseRounded,
  HomeRounded,
  CategoryRounded,
  StorefrontRounded,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { FC, ReactElement, useState } from "react";
import { getWhatsAppUrl } from "../../utils/whatsapp";
import { useThemeMode } from "../../contexts/ThemeContext";

interface NavLinkItem {
  label: string;
  path: string;
  icon: ReactElement;
}

const navLinks: NavLinkItem[] = [
  { label: "الرئيسية", path: "/", icon: <HomeRounded /> },
  { label: "المنتجات", path: "/catalog", icon: <StorefrontRounded /> },
  { label: "الفئات", path: "/categories", icon: <CategoryRounded /> },
];

const Brand: FC<{ onClick?: () => void }> = ({ onClick }) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    onClick={onClick}
    sx={{ cursor: "pointer" }}
  >
    <Box
      component="img"
      src="/logo.webp"
      alt="شعار المرحومي"
      sx={{ width: 42, height: 42, objectFit: "contain" }}
    />

    <Box sx={{ lineHeight: 1 }}>
      <Typography
        sx={{
          fontFamily: "'El Messiri', sans-serif",
          fontWeight: 700,
          fontSize: "1.35rem",
          color: "primary.main",
        }}
      >
        المرحومي
      </Typography>

      <Typography
        sx={{
          fontSize: "0.62rem",
          letterSpacing: 2,
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        ALMARHOMY
      </Typography>
    </Box>
  </Stack>
);

const SiteHeader: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const [open, setOpen] = useState(false);

  const isDark = mode === "dark";

  const linkSx = {
    color: "text.secondary",
    borderRadius: "10px",
    px: 2,
    fontWeight: 600,
    fontSize: "1rem",
    transition: "all 0.25s ease",
    "&:hover": {
      color: "primary.main",
      background: "rgba(44,74,59,0.06)",
    },
    "&.active": {
      color: "primary.main",
      background: "rgba(44,74,59,0.09)",
      fontWeight: 700,
    },
  } as const;

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: isDark
            ? "rgba(18, 18, 18, 0.88)"
            : "rgba(250, 245, 238, 0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar
          component={Container}
          maxWidth="lg"
          sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
        >
          <Brand onClick={() => navigate("/")} />

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={NavLink}
                to={link.path}
                end={link.path === "/"}
                sx={linkSx}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsApp />}
              onClick={() => window.open(getWhatsAppUrl(), "_blank")}
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                color: "#fff",
              }}
            >
              تواصل معنا
            </Button>

            <IconButton
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي"
              sx={{
                color: "primary.main",
                bgcolor: "rgba(44,74,59,0.06)",
                "&:hover": {
                  bgcolor: "rgba(44,74,59,0.12)",
                },
              }}
            >
              {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton
              onClick={() => setOpen(true)}
              sx={{ display: { md: "none" }, color: "primary.main" }}
              aria-label="القائمة"
            >
              <MenuRounded />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "background.default",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Brand
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
          />

          <IconButton onClick={() => setOpen(false)} aria-label="إغلاق">
            <CloseRounded />
          </IconButton>
        </Stack>

        <Divider />

        <List sx={{ px: 1, pt: 1 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.path}
              component={NavLink}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.active": {
                  bgcolor: "rgba(44,74,59,0.09)",
                  color: "primary.main",
                  fontWeight: 700,
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {link.icon}
              </ListItemIcon>

              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ p: 2, mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<WhatsApp />}
            onClick={() => window.open(getWhatsAppUrl(), "_blank")}
            sx={{ color: "#fff" }}
          >
            تواصل عبر واتساب
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SiteHeader;