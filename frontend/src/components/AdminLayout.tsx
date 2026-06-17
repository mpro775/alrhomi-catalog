// src/components/AdminLayout.tsx
import { useState, FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  styled,
  useTheme,
  useMediaQuery,
  Badge,
  alpha,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InventoryIcon from "@mui/icons-material/Inventory2";
import { useThemeMode } from "../contexts/ThemeContext";

const drawerWidth = 260;

interface NavItem {
  text: string;
  icon: ReactElement;
  path: string;
}

const navItems: NavItem[] = [
  { text: "لوحة التحكم", icon: <DashboardIcon />, path: "/admin" },
  { text: "إدارة التصنيفات", icon: <SettingsIcon />, path: "/admin/categories" },
  { text: "إدارة المنتجات", icon: <InventoryIcon />, path: "/admin/products" },
  { text: "إدارة الصور", icon: <PhotoLibraryIcon />, path: "/admin/images" },
  { text: "إدارة المستخدمين", icon: <PeopleIcon />, path: "/admin/users" },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const AdminLayout: FC = (): ReactElement => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleTheme } = useThemeMode();
  const { username, role } = useAuth();

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = (): void => {
    setCollapsed(!collapsed);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
      <DrawerHeader sx={{ px: 1, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              width: 42, 
              height: 42,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            A
          </Avatar>
          {!collapsed && (
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
              المرحومي
            </Typography>
          )}
        </Box>
        <IconButton onClick={toggleCollapse} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </DrawerHeader>

      <List sx={{ px: 0 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                mb: 1,
                py: 1.5,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: "#fff",
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                  "& .MuiListItemIcon-root": {
                    color: "#fff",
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    opacity: 0.9,
                  },
                },
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transform: "translateX(-4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? "auto" : 40,
                  color: isActive ? "inherit" : "text.secondary",
                  ml: collapsed ? 0 : 1.5,
                  transition: "all 0.3s ease",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 2, opacity: 0.5 }} />
        <ListItemButton
          onClick={() => navigate("/admin/logout")}
          sx={{
            borderRadius: 3,
            color: "error.main",
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, 0.05),
              transform: "translateX(-4px)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 40, color: "inherit", ml: collapsed ? 0 : 1.5 }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText 
              primary="تسجيل الخروج" 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: "100%",
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(12px)",
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: "72px", px: { xs: 2, sm: 4 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h5" 
            noWrap 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800, 
              letterSpacing: "-0.02em",
              display: { xs: "none", sm: "block" }
            }}
          >
            لوحة التحكم
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                color: theme.palette.primary.main,
              }}
              aria-label="تبديل الوضع"
            >
              {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 0.5,
                pr: 1.5,
                borderRadius: 10,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    width: 36, 
                    height: 36,
                    fontSize: "0.9rem",
                    fontWeight: 700
                  }}
                >
                  {username ? username.charAt(0).toUpperCase() : 'م'}
                </Avatar>
              </StyledBadge>
              {!isMobile && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {username || t('user')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}
                  >
                    {role === 'admin' ? t('adminRole') : t('repRole')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: collapsed ? 100 : drawerWidth },
          flexShrink: { sm: 0 },
          transition: "width 0.3s ease",
        }}
      >
        {/* للشاشات الأكبر */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: collapsed ? 100 : drawerWidth,
              border: "none",
              bgcolor: "transparent",
              transition: "width 0.3s ease",
              overflowX: "hidden",
              pt: 10,
              px: 1,
            },
          }}
          open
        >
           <Box className="glass" sx={{ height: "100%", borderRadius: 6, overflow: "hidden" }}>
             {drawer}
           </Box>
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${collapsed ? 100 : drawerWidth}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar sx={{ mb: 2 }} />
        <Box
          className={theme.palette.mode === 'dark' ? 'glass' : 'glass-light'}
          sx={{
            borderRadius: 6,
            p: { xs: 2, sm: 4 },
            minHeight: "calc(100vh - 140px)",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
