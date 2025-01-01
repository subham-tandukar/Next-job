"use client";

import {
  ArrowUpDown,
  CircleCheck,
  ClipboardPenLine,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaTrashAlt } from "react-icons/fa";
import { DataTable } from "@/components/dashboard/dataTable";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { base_url } from "@/utils/apiUrl";
import ShowToaster from "@/components/dashboard/toast";
import AddCategory from "./addCategory";
import EditCategory from "./editCategory";
import Image from "next/image";
import Fancybox from "@/components/dashboard/fancybox";
import { useAppSelector } from "@/lib/store/hooks";
import { useDispatch } from "react-redux";
import { fetchData } from "@/lib/store/features/category/categoryApi";

export default function CategoryList() {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);

  const formValues = {
    category: "",
    status: "",
    image: "",
  };
  const [formError, setFormError] = useState("");

  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("");
  const [bulkId, setBulkId] = useState([]);

  const dispatch = useDispatch();
  const { data, error, loading } = useAppSelector((state) => state.category);
  const getData = async () => {
    // try {
    //   const response = await axios.get(`${base_url}/category?status=${status}`);
    //   const result = response.data;
    //   if (result.success) {
    //     setData(result.data);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error.message);
    //   setData([]);
    // } finally {
    //   setLoading(false);
    // }
  };

  // useEffect(() => {
  //   getData();
  // }, [status]);

  useEffect(() => {
    dispatch(fetchData(status));
  }, [dispatch, status]);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
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
      ),
      cell: ({ row }) => (
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
      ),
      enableSorting: false,
      enableHiding: false,
      width: "40px",
    },
    // {
    //   accessorKey: "sn",
    //   header: <div className="text-center">S.N.</div>,
    //   enableHiding: false,
    //   width: "50px",
    //   cell: ({ row }) => <div className="text-center">{row.index + 1}.</div>,
    // },
    {
      accessorKey: "image",
      header: () => <div className="text-center">Image</div>,
      width: "80px",
      cell: ({ row }) => (
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
            data-caption={row.original.category}
            className={`size-12 block m-auto ${
              row.original.image ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <img
              src={row.original.image || "/images/no-image.jpg"}
              width={48}
              height={48}
              alt={row.getValue("category")}
              className={`size-full object-contain rounded-md shadow p-2 ${
                row.original.image ? "hover:opacity-60 cursor-pointer " : ""
              } `}
            />
          </a>
        </Fancybox>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div
            className="uppercase font-semibold text-xs inline-flex items-center gap-2 cursor-pointer hover:text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown size="1rem" />
          </div>
        );
      },
      cell: ({ row }) => row.getValue("category"),
    },
    {
      accessorKey: "status",
      header: "Status",
      width: "140px",
      cell: ({ row }) => {
        let status = row.original.status;
        const id = row.original.id;
        return (
          <Select
            value={status}
            onValueChange={(value) => {
              handleStatusChange(id, value);
            }}
          >
            <SelectTrigger className="w-[140px] justify-start">
              {status === "1" ? (
                <CircleCheck
                  strokeWidth={2}
                  className="status-icon text-success"
                />
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
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      enableHiding: false,
      width: "100px",
      cell: ({ row }) => {
        const values = row.original;
        const id = row.original.id;
        return (
          <>
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

                {/* <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div
                      className="action-btn"
                      onClick={() => setViewDialogOpen(true)}
                    >
                      <Eye className={"size-4"} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-muted-foreground shadow-md">
                    <p>View</p>
                  </TooltipContent>
                </Tooltip> */}
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
                      Delete the category
                    </h2>
                    <p className="the-text mt-2">
                      Are you sure you want to delete this category?
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
          </>
        );
      },
    },
  ];

  const formSchema = z.object({
    category: z.string().nonempty("Required"),
    image: z.string().nonempty("Required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  const [perId, setPerId] = useState(null);

  const handleEdit = (values) => {
    setFormError("");
    const { id, category, status, image } = values;
    setPerId(id);
    if (image) {
      setIsUploaded(true);
      setImage(image);
    } else {
      setIsUploaded(false);
      setImage(null);
    }
    form.reset({
      category,
      status,
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.patch(`${base_url}/category`, {
        id,
        status,
      });

      const result = response.data;

      if (result.success) {
        getData();

        ShowToaster({
          type: "success",
          title: "Status updated !",
          description: `This category is ${
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

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const response = await axios.delete(`${base_url}/category?id=${id}`);

      const result = response.data;
      if (result.success) {
        getData();

        ShowToaster({
          type: "success",
          title: "Success",
          description: "Category deleted successfully",
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

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="the-heading">Category</h1>
        <Button
          onClick={() => {
            setAddDialogOpen(true);
            setIsUploaded(false);
            form.reset(formValues);
            setFormError("");
          }}
        >
          <Plus strokeWidth={3} /> Add Category
        </Button>
      </div>

      {/* EDIT CATEGORY */}
      <EditCategory
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        formError={formError}
        setFormError={setFormError}
        form={form}
        submitLoading={submitLoading}
        setSubmitLoading={setSubmitLoading}
        getData={getData}
        perId={perId}
        image={image}
        setImage={setImage}
        isUploaded={isUploaded}
        setIsUploaded={setIsUploaded}
        filename={filename}
        setFilename={setFilename}
      />
      {/* EDIT CATEGORY */}

      {/* ADD CATEGORY */}
      <AddCategory
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        formError={formError}
        setFormError={setFormError}
        form={form}
        submitLoading={submitLoading}
        setSubmitLoading={setSubmitLoading}
        draftLoading={draftLoading}
        setDraftLoading={setDraftLoading}
        getData={getData}
        image={image}
        setImage={setImage}
        isUploaded={isUploaded}
        setIsUploaded={setIsUploaded}
        filename={filename}
        setFilename={setFilename}
      />
      {/* ADD CATEGORY */}

      {/* CATEGORY TABLE */}
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        status={status}
        setStatus={setStatus}
        isDeleting={isDeleting}
        setDeleting={setDeleting}
        bulkId={bulkId}
        setBulkId={setBulkId}
        getData={getData}
      />
      {/* CATEGORY TABLE */}
    </>
  );
}
