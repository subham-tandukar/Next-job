"use client";
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import axios from "axios";
import { base_url } from "@/utils/apiUrl";
import ShowToaster from "@/components/dashboard/toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormModal from "@/components/dashboard/modal/formModal";
import CategoryForm from "./categoryForm";

export default function EditCategory({
  editDialogOpen,
  setEditDialogOpen,
  formError,
  form,
  setFormError,
  submitLoading,
  setSubmitLoading,
  getData,
  perId,
  image,
  setImage,
  filename,
  setFilename,
  isUploaded,
  setIsUploaded,
}) {
  const onEdit = async () => {
    setSubmitLoading(true);
    try {
      setFormError("");
      const values = form.getValues();
      const dataToSubmit = { ...values, id: perId };
      const response = await axios.patch(`${base_url}/category`, dataToSubmit);
      const result = response.data;

      if (result.success) {
        form.reset();
        setEditDialogOpen(false);
        getData();
        ShowToaster({
          type: "success",
          title: "Success",
          description: "Category updated successfully",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred!";
      setFormError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <FormModal
      dialogOpen={editDialogOpen}
      setDialogOpen={setEditDialogOpen}
      formError={formError}
      title="Edit Category"
      width="425"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onEdit)} className="space-y-8">
          <CategoryForm
            form={form}
            image={image}
            setImage={setImage}
            isUploaded={isUploaded}
            setIsUploaded={setIsUploaded}
            filename={filename}
            setFilename={setFilename}
          />

          <DialogFooter className="pt-3 pb-6 sticky bottom-0 z-40 flex items-center justify-end gap-1 bg-white">
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormModal>
  );
}
