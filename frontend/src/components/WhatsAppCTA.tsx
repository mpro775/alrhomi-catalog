import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import WhatsApp from "@mui/icons-material/WhatsApp";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { useMemo, useState, FC, ReactElement } from "react";
import { getWhatsAppUrl, buildProductWhatsAppMessage } from "../utils/whatsapp";

interface Product {
  _id: string;
  productName?: string;
  description?: string;
  [key: string]: any;
}

interface WhatsAppCTAProps {
  id?: string;
  title?: string;
  subtitle?: string;
  product?: Product;
  context?: string;
  sx?: SxProps<Theme>;
}

const WhatsAppCTA: FC<WhatsAppCTAProps> = ({
  id,
  title = "تواصل عبر واتساب",
  subtitle = "اختر المنتج وسيصلك رد سريع من فريق المرحومي.",
  product,
  context,
  sx,
}): ReactElement => {
  const theme = useTheme();
  const [copied, setCopied] = useState<boolean>(false);

  const message = useMemo(() => {
    if (!product) {
      return `مرحباً فريق المرحومي، أود الحصول على استشارة سريعة حول منتجاتكم. (${context || "landing"})`;
    }
    return buildProductWhatsAppMessage({
      productName: product.productName,
      productCode: product.productCode || product._id,
      category: product.category,
      model: product.model,
      url: product.url || `${window.location.origin}/product/${product._id}`,
    });
  }, [product, context]);

  const whatsappUrl = getWhatsAppUrl(message);

  const handleCopy = async (): Promise<void> => {
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
};

export default WhatsAppCTA;
