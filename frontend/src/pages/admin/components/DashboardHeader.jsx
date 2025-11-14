import { Box, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function DashboardHeader({
  title,
  subtitle,
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: { xs: 3, sm: 4 },
        pb: 3,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              : `linear-gradient(135deg, #1565c0 0%, #0277bd 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title || t('adminDashboard')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        {subtitle || t('dashboardSubtitle')}
      </Typography>
    </Box>
  );
}

