import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { WhatsApp, PhoneInTalk } from "@mui/icons-material";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "المنتجات", path: "/catalog" },
  { label: "حول الشركة", path: "/#about" },
];

export default function SiteHeader() {
  const navigate = useNavigate();

  return (
    <Box component="header" sx={{ bgcolor: "background.paper" }}>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 1.5,
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              display: { xs: "none", sm: "block" }
            }}
          >
            شركة علي سعيد المرحومي الغامدي وأبنائه المحدودة منذ 1955
          </Typography>
          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center"
            component="a"
            href="tel:0126477825"
            sx={{
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.3s ease",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            <PhoneInTalk fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              012 647 7825
            </Typography>
          </Stack>
        </Container>
      </Box>

      <AppBar
        position="sticky"
        color="inherit"
        elevation={1}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar
          component={Container}
          disableGutters
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            gap: 3,
            py: 1.5,
          }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            <Box
              component="img"
              src="/logo.webp"
              alt="شعار الرحومي"
              sx={{
                width: 50,
                height: 50,
                objectFit: "contain",
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                المرحومي 
              </Typography>
              <Typography variant="caption" color="text.secondary">
                معدات ومستلزمات المطابخ الاحترافية
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={NavLink}
                to={link.path}
                color="inherit"
                sx={{
                  borderRadius: 3,
                  px: 2,
                  "&.active": {
                    color: "primary.main",
                    fontWeight: 600,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={4} alignItems="center" sx={{ gap: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/catalog")}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 0.75,
                borderWidth: 1.5,
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderWidth: 1.5,
                  bgcolor: "primary.main",
                  color: "white",
                  transform: "translateY(-2px)",
                },
              }}
            >
              المنتجات
            </Button>
            <IconButton
              color="success"
              aria-label="تواصل عبر واتساب"
              onClick={() => window.open("https://wa.me/967775017485", "_blank")}
              sx={{
                bgcolor: "success.main",
                color: "white",
                width: 44,
                height: 44,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "success.dark",
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
              }}
            >
              <WhatsApp />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

