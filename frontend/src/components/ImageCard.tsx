import {
  Typography,
  Chip,
  Box,
  Skeleton,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { JSX, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";
import { ImageCardProps } from "../types/component.types";
import { onImageError } from "../utils/fallbackImage";

export default function ImageCard({
  image,
  onViewDetails,
  className,
  withDownload,
}: ImageCardProps): JSX.Element {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  const title = image.productName || image.description || "منتج";
  const src = image.watermarkedUrl || image.originalUrl;

  const handleClick = (): void => {
    if (onViewDetails) {
      onViewDetails(image);
    } else {
      navigate(`/product/${image._id}`);
    }
  };

  const handleDownload = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    const url = image.originalUrl || image.watermarkedUrl;

    if (url) {
      saveAs(url, `${title.replace(/\s+/g, "-")}.png`);
    }
  };

  return (
    <Box
      className={`${className ?? ""} product-card`}
      onClick={handleClick}
      sx={{
        height: "100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "var(--shadow-soft)",
        "&:hover img": { transform: "scale(1.06)" },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "100%",
          bgcolor: "#fbf8f2",
          overflow: "hidden",
        }}
      >
        {!imgLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "#f1e9dc",
            }}
          />
        )}

        {src ? (
          <Box
            component="img"
            src={src}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              setImgLoaded(true);
              onImageError(e);
            }}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 2.5,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              opacity: imgLoaded ? 1 : 0,
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              fontSize: "0.85rem",
            }}
          >
            لا توجد صورة
          </Box>
        )}

        {image.category && (
          <Chip
            label={image.category}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              insetInlineEnd: 12,
              bgcolor: "rgba(255,255,255,0.92)",
              color: "primary.main",
              border: "1px solid",
              borderColor: "divider",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {withDownload && src && (
          <Tooltip title="تحميل الصورة">
            <IconButton
              size="small"
              onClick={handleDownload}
              sx={{
                position: "absolute",
                top: 12,
                insetInlineStart: 12,
                bgcolor: "rgba(255,255,255,0.92)",
                color: "primary.main",
                border: "1px solid",
                borderColor: "divider",
                backdropFilter: "blur(4px)",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.02rem",
            lineHeight: 1.5,
            color: "text.primary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "3.06em",
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "primary.main" }}>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
            عرض التفاصيل
          </Typography>
          <ArrowBackRounded sx={{ fontSize: 16 }} />
        </Stack>
      </Box>
    </Box>
  );
}