import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800"];

export default function ImagesDistributionCard({ data }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.08)",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 48px rgba(0,0,0,0.5)"
              : "0 12px 48px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              mb: 0.5,
            }}
          >
            توزيع الصور
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            نظرة عامة على حالة الصور في النظام
          </Typography>
        </Box>
        <Box sx={{ height: { xs: 280, sm: 320, md: 360 }, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : "#fff",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 12,
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 70 : isTablet ? 90 : 110}
                innerRadius={isMobile ? 30 : isTablet ? 40 : 50}
                dataKey="value"
                label={({ name, percent, value }) =>
                  `${name}\n${value} (${(percent * 100).toFixed(1)}%)`
                }
              >
                {data.map((_, idx) => (
                  <Cell
                    key={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: 2, sm: 3 },
            mt: 3,
          }}
        >
          {data.map((item, idx) => (
            <Box
              key={`${item.name}-${idx}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1.5,
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(COLORS[idx], 0.1)
                    : alpha(COLORS[idx], 0.08),
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  bgcolor: COLORS[idx],
                  borderRadius: "50%",
                  boxShadow: `0 2px 8px ${alpha(COLORS[idx], 0.4)}`,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
              >
                ({item.value})
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

