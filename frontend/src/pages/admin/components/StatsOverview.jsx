import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
} from "@mui/material";
import {
  Image as ImageIcon,
  HourglassTop as HourglassIcon,
  WaterDrop as WatermarkIcon,
  Person as PersonIcon,
  Inventory as ProductIcon,
  PhotoLibrary as ProductsWithImagesIcon,
  PhotoCameraOutlined as ProductsWithoutImagesIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";

const STAT_VARIANTS = [
  // Products (الأساس) - أولوية في العرض
  {
    key: "totalProducts",
    label: "إجمالي المنتجات",
    icon: <ProductIcon />,
    border: "#9c27b0",
    gradient: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
  },
  {
    key: "productsWithImages",
    label: "منتجات مع صور",
    icon: <ProductsWithImagesIcon />,
    border: "#4caf50",
    gradient: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
  },
  {
    key: "productsWithoutImages",
    label: "منتجات بدون صور",
    icon: <ProductsWithoutImagesIcon />,
    border: "#f44336",
    gradient: "linear-gradient(135deg, #f44336 0%, #e57373 100%)",
  },
  // Images (تابعة)
  {
    key: "totalImages",
    label: "إجمالي الصور",
    icon: <ImageIcon />,
    border: "#00acc1",
    gradient: "linear-gradient(135deg, #00acc1 0%, #26c6da 100%)",
  },
  {
    key: "watermarkedCount",
    label: "صور مُعلَّمة",
    icon: <WatermarkIcon />,
    border: "#2196f3",
    gradient: "linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)",
  },
  {
    key: "pendingJobs",
    label: "مهام بانتظار المعالجة",
    icon: <HourglassIcon />,
    border: "#ff9800",
    gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
  },
  {
    key: "activeUsers",
    label: "المستخدمون النشطون",
    icon: <PersonIcon />,
    border: "#607d8b",
    gradient: "linear-gradient(135deg, #607d8b 0%, #78909c 100%)",
  },
];

export default function StatsOverview({ stats }) {
  const theme = useTheme();
  const {
    palette: {
      mode,
      background: { paper, default: backgroundDefault },
    },
  } = theme;

  const cards = useMemo(
    () =>
      STAT_VARIANTS.map((variant) => ({
        ...variant,
        value: stats?.[variant.key] ?? 0,
        background:
          mode === "dark"
            ? `linear-gradient(135deg, ${alpha(
                paper,
                0.9
              )} 0%, ${alpha(backgroundDefault, 0.9)} 100%)`
            : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        shadow:
          mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.08)",
      })),
    [stats, mode, paper, backgroundDefault]
  );

  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
      {cards.map((card) => (
        <Grid  size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={card.key}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: card.shadow,
              background: card.background,
              borderLeft: `4px solid ${card.border}`,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 48px rgba(0,0,0,0.5)"
                    : "0 12px 48px rgba(0,0,0,0.15)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: card.gradient,
                opacity: 0.8,
              },
            }}
          >
            <CardContent
              sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                "&:last-child": { pb: { xs: 1.5, sm: 2, md: 2.5 } },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                      mb: 0,
                      background:
                        theme.palette.mode === "dark"
                          ? `linear-gradient(135deg, ${card.border} 0%, ${alpha(
                              card.border,
                              0.7
                            )} 100%)`
                          : card.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {card.value.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48, md: 56 },
                    height: { xs: 40, sm: 48, md: 56 },
                    borderRadius: 3,
                    background: card.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${alpha(card.border, 0.3)}`,
                    color: "white",
                    flexShrink: 0,
                    "& .MuiSvgIcon-root": {
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    },
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

