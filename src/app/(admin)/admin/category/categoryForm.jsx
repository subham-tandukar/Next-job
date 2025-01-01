"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploader from "@/components/dashboard/imageUploader";
import { Label } from "@/components/ui/label";
export default function CategoryForm({
  form,
  image,
  setImage,
  filename,
  setFilename,
  isUploaded,
  setIsUploaded,
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Image</FormLabel>
            <FormControl>
              <ImageUploader
                image={image}
                setImage={setImage}
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                filename={filename}
                setFilename={setFilename}
                field={field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {/* <div className="space-y-2">
        <Label>Upload image</Label>
        <ImageUploader
          image={image}
          setImage={setImage}
          isUploaded={isUploaded}
          setIsUploaded={setIsUploaded}
          filename={filename}
          setFilename={setFilename}
        />
      </div> */}
    </>
  );
}
