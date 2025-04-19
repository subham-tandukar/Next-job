import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Fancybox from "@/components/dashboard/fancybox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleCheck,
  ClipboardPenLine,
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function SelectColumnHeader({ table, setBulkId }) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => {
        table.toggleAllPageRowsSelected(!!value);
        const allRowIds = table
          .getRowModel()
          .rows.map((row) => row.original.id);
        setBulkId(value ? allRowIds : []);
      }}
      aria-label="Select all"
      className="block -mt-[3] ml-2"
    />
  );
}

export function SelectColumnCell({ row, setBulkId }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => {
        const id = row.original.id;
        setBulkId((prev) =>
          value
            ? [...new Set([...prev, id])]
            : prev.filter((item) => item !== id)
        );
        row.toggleSelected(!!value);
      }}
      aria-label="Select row"
      className="block -mt-[3] ml-2"
    />
  );
}

export function ImageColumn({
  row,
  imageSrc,
  isLoading,
  setIsLoading,
  imageTitle,
}) {
  return (
    <Fancybox
      options={{
        Carousel: {
          infinite: false,
        },
      }}
    >
      <a
        href={row.original.image}
        data-fancybox
        data-caption={imageTitle}
        className={`size-12 block m-auto ${
          row.original.image ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {isLoading && <Skeleton className="w-12 h-12 rounded-md" />}
        <img
          src={imageSrc}
          width={48}
          height={48}
          alt={imageTitle}
          className={`size-full object-contain rounded-md shadow p-2 ${
            row.original.image ? "hover:opacity-60 cursor-pointer " : ""
          } ${isLoading ? "hidden" : "block"}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)} // Handle errors gracefully
        />
      </a>
    </Fancybox>
  );
}

export function StatusColumn({ status, id, handleStatusChange }) {
  return (
    <Select
      value={status}
      onValueChange={(value) => {
        handleStatusChange(id, value);
      }}
    >
      <SelectTrigger className="w-[140px] justify-start">
        {status === "1" ? (
          <CircleCheck strokeWidth={2} className="status-icon text-success" />
        ) : (
          <ClipboardPenLine strokeWidth={2} className="status-icon " />
        )}
        <SelectValue value={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="1">Published</SelectItem>
          <SelectItem value="2">Draft</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function ActionColumn({
  values,
  id,
  setEditDialogOpen,
  handleEdit,
  handleDelete,
  isDeleting,
  view = false,
}) {
  return (
    <div className="flex w-full justify-center items-center gap-3 pe-3">
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className="action-btn"
              onClick={() => {
                setEditDialogOpen(true);
                handleEdit(values);
              }}
            >
              <Pencil className={"size-4"} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-muted-foreground shadow-md">
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        {view && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="action-btn">
                <Eye className={"size-4"} />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-muted-foreground shadow-md">
              <p>View</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>

      <div className="action-btn ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Trash2 className={"size-4"} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mr-1 p-4 w-56"
            align="center"
            side="left"
          >
            <h2 className="the-title flex items-start sm:items-center">
              <FaTrashAlt className="mr-1" />
              Delete item
            </h2>
            <p className="the-text mt-2">
              Are you sure you want to delete this item?
            </p>

            <div className="mt-4 flex gap-1.5 items-center justify-end">
              <Button
                type="button"
                className="px-2.5 py-1 text-xs h-7"
                onClick={() => handleDelete(id)}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Ok"
                )}
              </Button>

              <DropdownMenuItem className="p-0">
                <Button
                  type="button"
                  variant="outline"
                  className="px-2.5 py-1 text-xs h-7"
                >
                  No
                </Button>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
