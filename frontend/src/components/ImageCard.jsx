import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  alpha,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModal from "./ImageModal";

export default function ImageCard({ image, withDownload, onViewDetails }) {
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const title = image.productName || image.description || "منتج";
  
  return (
    <>
      <Card
        elevation={0}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        <CardActionArea
          onClick={() => onViewDetails ? onViewDetails(image) : navigate(`/product/${image._id}`)}
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
        >
          <Box sx={{ 
            position: 'relative', 
            width: '100%', 
            paddingTop: '110%',
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.primary.main, 0.03)
          }}>
            {!imgLoaded && (
              <Skeleton 
                variant="rectangular" 
                animation="wave"
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%' 
                }} 
              />
            )}
            <Box
              component="img"
              src={image.watermarkedUrl || image.originalUrl}
              alt={title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                opacity: imgLoaded ? 1 : 0,
                p: 1.5,
              }}
            />
            
            {/* Tags Overlay */}
            {image.tags && image.tags.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  left: 12,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.7,
                  zIndex: 2,
                }}
              >
                {image.tags.slice(0, 3).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.95),
                      color: "text.primary",
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                      height: 26,
                      fontSize: "0.75rem",
                      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                      "& .MuiChip-label": {
                        px: 1.2,
                      },
                    }}
                  />
                ))}
                {image.tags.length > 3 && (
                  <Chip
                    label={`+${image.tags.length - 3}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.9),
                      color: "white",
                      backdropFilter: "blur(8px)",
                      border: "none",
                      height: 26,
                      fontSize: "0.75rem",
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                      "& .MuiChip-label": {
                        px: 1.2,
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
          
          <CardContent sx={{ width: "100%", p: 2.5, flexGrow: 0 }}>
            <Stack spacing={1.2}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "1.05rem",
                  minHeight: "2.8em",
                }}
              >
                {title}
              </Typography>
              
              <Chip
                label={image.category}
                size="medium"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  border: "none",
                  height: 28,
                  fontSize: "0.85rem",
                  width: "fit-content",
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <ImageModal
        open={open}
        onClose={() => setOpen(false)}
        image={image}
      />
    </>
  );
}
