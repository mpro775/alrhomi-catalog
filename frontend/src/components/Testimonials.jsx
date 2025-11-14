import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Rating,
} from "@mui/material";

const testimonials = [
  {
    name: "شركة المسكن الحديث",
    role: "مدير التسويق",
    quote:
      "الكتالوج الجديد ساعدنا نغلق صفقات أكبر لأنه يظهر جودة المنتج بوضوح ويحول العميل للواتساب فوراً.",
    rating: 5,
  },
  {
    name: "معرض الريادة",
    role: "صاحب المعرض",
    quote:
      "الشغل معهم سريع ومنظم، الفلاتر الجديدة اختصرت وقت العملاء للوصول لمنتجاتهم.",
    rating: 4.5,
  },
  {
    name: "مؤسسة لمسة فخامة",
    role: "مديرة المشاريع",
    quote:
      "وجود CTA واتساب واضح رفع من عدد الاستفسارات خلال أسبوع واحد فقط.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ماذا قال شركاؤنا؟
      </Typography>
      <Grid container spacing={2}>
        {testimonials.map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.name}>
            <Card sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent>
                <Rating value={item.rating} precision={0.5} readOnly />
                <Typography sx={{ my: 2, fontStyle: "italic" }}>
                  “{item.quote}”
                </Typography>
                <Typography variant="subtitle1" >
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

