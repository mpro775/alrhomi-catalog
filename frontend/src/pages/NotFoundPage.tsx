import { Box, Container, Typography, Button, alpha } from "@mui/material";
import SearchOff from "@mui/icons-material/SearchOff";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";
import { FC, ReactElement } from "react";
import SEO from "../components/SEO";

const NotFoundPage: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <>
      <SEO title="الصفحة غير موجودة - كتالوج المرحومي" description="عذراً، الصفحة التي تبحث عنها غير موجودة." />
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <SearchOff sx={{ fontSize: 60, color: "primary.main" }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "4rem", sm: "6rem" },
                fontWeight: 900,
                color: "text.primary",
                opacity: 0.1,
                lineHeight: 1,
                mt: -8,
                zIndex: 0,
              }}
            >
              404
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ zIndex: 1, mt: -2 }}>
              الصفحة غير موجودة
            </Typography>
            <Typography color="text.secondary" variant="body1">
              عذراً، يبدو أن الرابط الذي اتبعته غير صحيح أو تم نقل الصفحة.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeOutlined />}
              onClick={() => navigate("/")}
              sx={{ mt: 2, borderRadius: 2, px: 4 }}
            >
              العودة للرئيسية
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFoundPage;
