import "@/components/dashboard/styles/global.css";
import AdminLayout from "@/components/dashboard/layout";
import SessionProviderWrapper from "@/components/dashboard/sessionProvider";

export default function AdminMainLayout({ children }) {
  return (
    <SessionProviderWrapper>
      <AdminLayout>{children}</AdminLayout>
    </SessionProviderWrapper>
  );
}
