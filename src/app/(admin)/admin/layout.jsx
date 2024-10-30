import SessionProviderWrapper from "@/components/admin/sessionProvider";
import AdminLayout from "@/components/admin/layout";

export default function AdminMainLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <AdminLayout>{children}</AdminLayout>
    </SessionProviderWrapper>
  );
}
