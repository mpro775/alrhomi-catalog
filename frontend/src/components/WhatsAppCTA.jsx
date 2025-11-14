import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { WhatsApp, ContentCopy } from "@mui/icons-material";
import { useMemo, useState } from "react";

export default function WhatsAppCTA({
  id,
  title = "تواصل عبر واتساب",
  subtitle = "اختر المنتج وسيصلك رد سريع من فريق الرحومي.",
  product,
  context,
  sx,
}) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const whatsappNumber =
    process.env.REACT_APP_WHATSAPP_NUMBER || "967775017485";

  const message = useMemo(() => {
    if (!product) {
      return `مرحباً فريق الرحومي، أود الحصول على استشارة سريعة حول منتجاتكم. (${context || "landing"})`;
    }
    return `مرحباً، أرغب في معرفة مزيد من التفاصيل عن المنتج ${product.productName || product.description || product._id
      } (الرمز: ${product._id}).`;
  }, [product, context]);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Box
      id={id}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: "common.white",
        borderRadius: 6,
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 5 },
        boxShadow: 6,
        mt: { xs: 4, md: 6 },
        mx: "auto",
        width: "clamp(280px, 90%, 1100px)",
        ...sx,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack spacing={1}>
          <Typography variant="h5" >
            {title}
          </Typography>
          <Typography variant="body1">{subtitle}</Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<WhatsApp />}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 4,
              px: 4,
              bgcolor: "success.main",
            }}
          >
            تحدث معنا الآن
          </Button>
          <Tooltip title={copied ? "تم النسخ" : "نسخ الرسالة"}>
            <IconButton
              onClick={handleCopy}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "common.white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}

