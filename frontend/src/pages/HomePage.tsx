import { Box, Container, Typography, Stack, Button, Chip, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, FC, ReactElement } from "react";
import {
  ArrowBackRounded,
  WhatsApp,
  LocalCafeRounded,
  AutoAwesomeRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import { fetchCategories } from "../api/admin";
import { searchProducts } from "../api/products";
import CategoryShowcase from "../components/CategoryShowcase";
import ProductCard from "../components/ProductCard";
import AboutContactSection from "../components/AboutContactSection";
import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";
import { getWhatsAppUrl } from "../utils/whatsapp";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: string | { name: string };
  itemsCount?: number;
  [key: string]: unknown;
}

interface ProductItem {
  _id: string;
  productName?: string;
  productCode?: string;
  category?: string | { name?: string };
  model?: string;
  description?: string;
  originalUrl?: string | null;
  watermarkedUrl?: string | null;
  tags?: string[];
}

const SectionHeading: FC<{
  overline: string;
  title: string;
  subtitle?: string;
}> = ({ overline, title, subtitle }) => (
  <Stack spacing={1.5} sx={{ textAlign: "center", mb: 5 }}>
    <Typography
      variant="overline"
      sx={{
        color: "secondary.main",
        fontWeight: 800,
        letterSpacing: 2,
      }}
    >
      {overline}
    </Typography>

    <Typography variant="h3" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>

    {subtitle && (
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          maxWidth: 620,
          mx: "auto",
        }}
      >
        {subtitle}
      </Typography>
    )}

    <Box className="motif-rule" sx={{ mt: 1 }} />
  </Stack>
);

const HomePage: FC = (): ReactElement => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories({ page: 1, limit: 6 }),
          searchProducts({ page: 1, limit: 8 }),
        ]);

        setCategories(catRes.items || []);
        setProducts(prodRes.data?.items || []);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    })();
  }, []);

  return (
    <PageTransition>
      <SEO
        title="المرحومي · أناقة الضيافة العربية لمطبخك وبيتك"
        description="تشكيلة المرحومي من أواني المطبخ، أطقم القهوة والشاي، صواني التقديم، المباخر ومستلزمات الضيافة والمنزل."
        type="website"
      />

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(1200px 500px at 85% -10%, rgba(194,161,77,0.18), transparent 60%), linear-gradient(180deg, #fbf7f0 0%, var(--cream) 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
              gap: { xs: 5, md: 6 },
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Stack
                spacing={3}
                sx={{
                  textAlign: { xs: "center", md: "right" },
                  alignItems: { xs: "center", md: "flex-start" },
                }}
              >
                <Chip
                  icon={
                    <AutoAwesomeRounded
                      sx={{ color: "secondary.main !important" }}
                    />
                  }
                  label="تشكيلة المرحومي للمنزل والضيافة"
                  sx={{
                    bgcolor: "rgba(194,161,77,0.12)",
                    color: "primary.main",
                    fontWeight: 700,
                    py: 2,
                    px: 1,
                    border: "1px solid",
                    borderColor: "rgba(194,161,77,0.4)",
                  }}
                />

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.4rem", md: "3.6rem" },
                    lineHeight: 1.2,
                  }}
                >
                  أناقة الضيافة العربية
                  <Box
                    component="span"
                    sx={{ color: "primary.main", display: "block" }}
                  >
                    لمطبخك وبيتك
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                    maxWidth: 560,
                    lineHeight: 1.9,
                  }}
                >
                  أواني وأدوات مطبخ، أطقم قهوة وشاي، صواني تقديم، مباخر ومستلزمات منزل مختارة بعناية —
                  بجودة عالية وأسعار في المتناول. اطلب بسهولة عبر واتساب.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowBackRounded />}
                    onClick={() => navigate("/catalog")}
                    sx={{ px: 4, py: 1.4, fontSize: "1.05rem" }}
                  >
                    تصفّح المنتجات
                  </Button>

                  <Button
                    variant="outlined"
                    color="success"
                    size="large"
                    startIcon={<WhatsApp />}
                    onClick={() => window.open(getWhatsAppUrl(), "_blank")}
                    sx={{
                      px: 4,
                      py: 1.4,
                      fontSize: "1.05rem",
                      borderColor: "success.main",
                      color: "success.main",
                      "&:hover": {
                        borderColor: "success.main",
                        bgcolor: "rgba(37,211,102,0.08)",
                      },
                    }}
                  >
                    تواصل معنا
                  </Button>
                </Stack>
              </Stack>
            </motion.div>

            {/* Decorative arch panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  width: 320,
                  height: 380,
                  borderRadius: "180px 180px 24px 24px",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  background:
                    "linear-gradient(160deg, #34543f 0%, #2c4a3b 60%, #22392e 100%)",
                  border: "2px solid rgba(194,161,77,0.5)",
                  boxShadow: "var(--shadow-md)",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Cg fill='none' stroke='%23C2A14D' stroke-width='1' opacity='0.35'%3E%3Crect x='19' y='19' width='32' height='32'/%3E%3Crect x='19' y='19' width='32' height='32' transform='rotate(45 35 35)'/%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundSize: "70px 70px",
                  },
                }}
              >
                <LocalCafeRounded
                  sx={{
                    fontSize: 120,
                    color: "rgba(194,161,77,0.9)",
                    position: "relative",
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <SectionHeading
          overline="تسوّق حسب الفئة"
          title="فئاتنا المختارة"
          subtitle="من أطقم القهوة والشاي إلى صواني التقديم والمباخر ومستلزمات المنزل."
        />

        <CategoryShowcase
          categories={categories}
          loading={loadingCategories}
          limit={5}
          showMore
          onMoreClick={() => navigate("/categories")}
        />
      </Container>

      {/* Featured products */}
      <Box
        sx={{
          bgcolor: "#fbf7f0",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <SectionHeading
            overline="وصل حديثاً"
            title="أحدث المنتجات"
            subtitle="اكتشف أحدث ما أضفناه إلى الكتالوج."
          />

          {loadingProducts ? (
            <CategoryShowcase loading limit={8} />
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid size={{ xs: 6, sm: 6, lg: 3 }} key={product._id}>
                  <ProductCard
                    _id={product._id}
                    productName={product.productName}
                    productCode={product.productCode}
                    category={
                      typeof product.category === "string"
                        ? product.category
                        : product.category?.name
                    }
                    model={product.model}
                    description={product.description}
                    originalUrl={product.originalUrl || null}
                    watermarkedUrl={product.watermarkedUrl || null}
                    tags={product.tags}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowBackRounded />}
              onClick={() => navigate("/catalog")}
              sx={{ px: 5, py: 1.4 }}
            >
              عرض كل المنتجات
            </Button>
          </Box>
        </Container>
      </Box>

      <AboutContactSection />
    </PageTransition>
  );
};

export default HomePage;