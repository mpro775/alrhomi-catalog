// src/components/ImageGrid.jsx
import { Grid } from "@mui/material";
import ImageCard from "./ImageCard";

export default function ImageGrid({ images = [], withDownload, onSelect }) {
  return (
    <Grid container spacing={3}>
      {images.map((img) => (
        <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={img._id}>
          <ImageCard
            image={img}
            withDownload={withDownload}
            onViewDetails={() => onSelect?.(img)}
          />
        </Grid>
      ))}
    </Grid>
  );
}