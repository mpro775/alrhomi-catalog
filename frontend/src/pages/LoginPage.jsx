// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Fade,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  ArrowBack,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // استخدام setAccessToken بدل setToken
  const { setAccessToken, setRole, setUsername } = useContext(AuthContext);
  const { mode, toggleMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", { username, password });

      // تخزين التوكن والدور واسم المستخدم باستخدام المفاتيح الموحدة
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      setAccessToken(data.token);
      setRole(data.role);
      setUsername(username);

      // التنقل بناءً على الدور
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/catalog");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
            : "linear-gradient(135deg, #1565c0 0%, #0277bd 100%)",
        p: 2,
        position: "relative",
      }}
    >
      {/* زر التبديل */}
      <IconButton
        onClick={toggleMode}
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#fff",
          backdropFilter: "blur(10px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
          zIndex: 1000,
        }}
        aria-label="تبديل الوضع"
      >
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Container maxWidth="sm">
        <Box
          component={Paper}
          elevation={10}
          sx={{
            borderRadius: { xs: 3, sm: 4 },
            overflow: "hidden",
            boxShadow:
              mode === "dark"
                ? "0 15px 35px rgba(0,0,0,0.5)"
                : "0 15px 35px rgba(0,0,0,0.2)",
            background:
              mode === "dark"
                ? "rgba(30, 30, 30, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            position: "relative",
          }}
        >
          {/* تصميم الخلفية الجمالية */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #1565c0 0%, #0277bd 100%)",
            }}
          />

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "50%",
                  p: { xs: 1.5, sm: 2 },
                  mb: 2,
                }}
              >
                <Lock sx={{ fontSize: { xs: 32, sm: 40 }, color: "#fff" }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                {t('login')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                أدخل بياناتك للوصول إلى حسابك
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t('username')}
                margin="normal"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />

              <TextField
                fullWidth
                label={t('password')}
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* يمكن إضافة "تذكرني" لاحقًا */}
                </Box>
                <Link href="#" variant="body2" color="primary">
                  نسيت كلمة المرور؟
                </Link>
              </Box>

              {error && (
                <Fade in={error !== ""}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.error.light,
                      color: theme.palette.error.dark,
                      p: 1.5,
                      borderRadius: 2,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2">{error}</Typography>
                  </Box>
                </Fade>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 15px rgba(21, 101, 192, 0.4)",
                  background:
                    "linear-gradient(90deg, #1565c0 0%, #0277bd 100%)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(21, 101, 192, 0.6)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('loginButton')
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  ليس لديك حساب؟
                </Typography>
                <Link href="#" variant="body2" color="primary">
                  إنشاء حساب جديد
                </Link>
              </Box>
            </form>
          </Box>

                
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ color: "#fff" }}
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
