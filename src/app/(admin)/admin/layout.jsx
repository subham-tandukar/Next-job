import SessionProviderWrapper from "@/components/admin/sessionProvider";
import AdminLayout from "@/components/admin/layout";
import "@/components/admin/styles/global.css";

export default function AdminMainLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <AdminLayout>{children}</AdminLayout>
    </SessionProviderWrapper>
  );
}
