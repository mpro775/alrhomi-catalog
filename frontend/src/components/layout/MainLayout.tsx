import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import WhatsAppCTA from "../WhatsAppCTA";
import { FC, ReactElement } from "react";

const MainLayout: FC = (): ReactElement => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader />
      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 } }}>
        <Outlet />
      </Box>
      <WhatsAppCTA
        id="catalog-whatsapp-cta"
        context="paged-footer"
        title="تواصل مباشرة مع فريق المرحومي"
        subtitle="نساعدك في اختيار ما يناسب مطبخك وضيافتك، ونجيب على كل استفساراتك عبر واتساب خلال دقائق."
      />
      <SiteFooter />
    </Box>
  );
};

export default MainLayout;
