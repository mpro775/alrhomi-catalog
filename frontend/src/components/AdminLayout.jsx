// src/components/AdminLayout.jsx
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../contexts/AuthContext";
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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PhotoLibrary as PhotoLibraryIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Inventory2 as InventoryIcon,
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { ThemeContext } from "../contexts/ThemeContext";

const drawerWidth = 260;

const getNavItems = (t) => [
  { text: t('dashboard'), icon: <DashboardIcon />, path: "/admin" },
  { text: t('categoriesManagement'), icon: <SettingsIcon />, path: "/admin/categories" },
  { text: t('productsManagement'), icon: <InventoryIcon />, path: "/admin/products" },
  { text: t('imagesManagement'), icon: <PhotoLibraryIcon />, path: "/admin/images" },
  { text: t('usersManagement'), icon: <PeopleIcon />, path: "/admin/users" },
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

export default function AdminLayout() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleMode } = useContext(ThemeContext);
  const { username, role } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const drawer = (
    <div>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
          <Avatar
            sx={{ bgcolor: blue[900], width: 40, height: 40 }}
            src="/logo.png"
          >
            A
          </Avatar>
          {!collapsed && (
            <Typography variant="h6" noWrap>
              لوحة التحكم
            </Typography>
          )}
        </Box>
        <IconButton onClick={toggleCollapse}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {getNavItems(t).map((item) => (
          <ListItemButton
            key={item.text}
            selected={pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(25, 118, 210, 0.16)"
                    : blue[50],
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : blue[900],
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.24)"
                      : blue[100],
                },
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              justifyContent: "space-evenly",
            }}
          >
              <ListItemIcon
              sx={{
                minWidth: collapsed ? "auto" : 48,
                color: "inherit",
                ml: collapsed ? 0 : 2
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                display: collapsed ? "none" : "block",
                textAlign: "right",
                flex: 1,
              }}
            />
          
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItemButton
          onClick={() => navigate("/admin/logout")}
          sx={{
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 48 }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="تسجيل الخروج" />}
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === "dark" 
            ? "0 2px 10px rgba(0,0,0,0.3)" 
            : "0 2px 10px rgba(0,0,0,0.05)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "64px", py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            لوحة التحكم الإدارية
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={toggleMode}
              color="inherit"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              aria-label="تبديل الوضع"
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ bgcolor: blue[900], width: 40, height: 40 }}
                >
                  {username ? username.charAt(0).toUpperCase() : 'م'}
                </Avatar>
              </StyledBadge>
              {!isMobile && (
                <Box>
                    <Typography variant="subtitle2">
                    {username || t('user')}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
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
          width: { sm: collapsed ? 73 : drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* للهواتف */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          anchor="right"
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "2px 0 10px rgba(0,0,0,0.3)"
                  : "2px 0 10px rgba(0,0,0,0.05)",
            },
          }}
          SlideProps={{
            direction: "right",
            timeout: 300,
          }}
        >
          {drawer}
        </Drawer>

        {/* للشاشات الأكبر */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: collapsed ? 73 : drawerWidth,
              border: "none",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
              transition: theme.transitions.create(["width", "transform"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${collapsed ? 73 : drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 10px rgba(0,0,0,0.3)"
                : "0 2px 10px rgba(0,0,0,0.03)",
            p: { xs: 2, sm: 3 },
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
