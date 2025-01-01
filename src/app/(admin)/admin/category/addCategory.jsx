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

export default function AddCategory({
  addDialogOpen,
  setAddDialogOpen,
  formError,
  form,
  setFormError,
  submitLoading,
  setSubmitLoading,
  draftLoading,
  setDraftLoading,
  getData,
  image,
  setImage,
  filename,
  setFilename,
  isUploaded,
  setIsUploaded,
}) {
  const onSubmit = (status) =>
    form.handleSubmit((data) => handleSave(data, status));

  const handleSave = async (data, status) => {
    setSubmitLoading(status === "1");
    setDraftLoading(status === "2");
    try {
      setFormError("");
      const dataToSubmit = { ...data, status };
      const response = await axios.post(`${base_url}/category`, dataToSubmit);
      const result = response.data;

      if (result.success) {
        form.reset();
        setAddDialogOpen(false);
        getData();
        ShowToaster({
          type: "success",
          title: "Success",
          description: "Category created successfully",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred!";
      setFormError(errorMsg);
    } finally {
      setSubmitLoading(false);
      setDraftLoading(false);
    }
  };

  return (
    <FormModal
      dialogOpen={addDialogOpen}
      setDialogOpen={setAddDialogOpen}
      formError={formError}
      title="Add Category"
      width="425"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit("1"))} className="space-y-8">
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
            <Button
              type="button"
              variant="outline"
              disabled={draftLoading}
              onClick={() => form.handleSubmit(onSubmit("2"))()}
            >
              {draftLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </FormModal>
  );
}
