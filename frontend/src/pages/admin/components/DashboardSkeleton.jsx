import { Box, Grid, Skeleton } from "@mui/material";

export default function DashboardSkeleton() {
  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} />
      </Box>
      <Grid
        container
        spacing={{ xs: 2, sm: 2.5, md: 3 }}
        sx={{ mb: { xs: 3, sm: 4 } }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`stats-skeleton-${i}`}>
            <Skeleton
              variant="rectangular"
              height={160}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 4 }}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 4 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

