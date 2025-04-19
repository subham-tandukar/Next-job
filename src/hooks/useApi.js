import ShowToaster from "@/components/dashboard/toast";
import { base_url } from "@/utils/apiUrl";
import axios from "axios";

export const updateStatusApi = async (id, status, getData, endpoint) => {
  try {
    const response = await axios.put(`${base_url}/${endpoint}`, {
      id,
      status,
    });

    const result = response.data;

    if (result.success) {
      getData();

      ShowToaster({
        type: "success",
        title: "Status updated !",
        description: `This item is ${
          status === "1" ? "now published." : "moved to draft."
        }`,
      });
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || error.message || "An error occurred!";

    ShowToaster({
      type: "error",
      title: "Error occured !",
      description: errorMsg,
    });
  }
};

export const deleteDataApi = async (id, setDeleting, getData, endpoint) => {
  setDeleting(true);
  try {
    const response = await axios.delete(`${base_url}/${endpoint}?id=${id}`);

    const result = response.data;
    if (result.success) {
      getData();

      ShowToaster({
        type: "success",
        title: "Success",
        description: "Item deleted successfully",
      });
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || error.message || "An error occurred!";

    ShowToaster({
      type: "error",
      title: "Error occured !",
      description: errorMsg,
    });
  } finally {
    setDeleting(false);
  }
};
