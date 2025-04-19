import SessionProviderWrapper from "@/components/dashboard/sessionProvider";

export default function LoginLayout({ children }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
