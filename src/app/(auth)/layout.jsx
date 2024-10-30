import SessionProviderWrapper from "@/components/admin/sessionProvider";

export default function LoginLayout({ children }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
