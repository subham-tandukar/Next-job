import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";
export default function ShowToaster({ type = "success", title, description }) {
  const icons = {
    success: <FaCheckCircle size="1.2rem" />,
    error: <IoMdCloseCircle size="1.2rem" />,
  };

  toast(title, {
    icon: icons[type],
    description: description,
    position: "top-right",
    className: `!text-${type === "success" ? "success" : "destructive"}`,
  });
}
