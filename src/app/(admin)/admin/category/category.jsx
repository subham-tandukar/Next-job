"use client";

import { ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/dataTable";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddCategory from "./addCategory";
import EditCategory from "./editCategory";
import Image from "next/image";
import { useAppSelector } from "@/lib/store/hooks";
import { useDispatch } from "react-redux";
import { fetchData } from "@/lib/store/features/category/categoryApi";
import {
  ActionColumn,
  ImageColumn,
  SelectColumnCell,
  SelectColumnHeader,
  StatusColumn,
} from "@/components/dashboard/tableColumn";
import { deleteDataApi, updateStatusApi } from "@/hooks/useApi";

export default function CategoryList() {
  const formValues = {
    category: "",
    status: "",
    image: "",
  };
  const [formError, setFormError] = useState("");

  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [status, setStatus] = useState("");
  const [bulkId, setBulkId] = useState([]);

  const dispatch = useDispatch();
  const { data, error, loading } = useAppSelector((state) => state.category);
  const getData = () => {
    dispatch(fetchData(status));
  };

  useEffect(() => {
    getData();
  }, [dispatch, status]);

  const columns = [
    {
      accessorKey: "select",
      header: ({ table }) => (
        <SelectColumnHeader table={table} setBulkId={setBulkId} />
      ),
      cell: ({ row }) => <SelectColumnCell row={row} setBulkId={setBulkId} />,
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
      cell: ({ row }) => {
        const imageSrc = row.original.image || "/images/no-image.jpg";

        const imageTitle = row.original.category;
        return (
          <ImageColumn
            row={row}
            imageSrc={imageSrc}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            imageTitle={imageTitle}
          />
        );
      },
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
          <StatusColumn
            status={status}
            id={id}
            handleStatusChange={handleStatusChange}
          />
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
          <ActionColumn
            values={values}
            id={id}
            setEditDialogOpen={setEditDialogOpen}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
          />
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
    const { id, image } = values;
    setPerId(id);
    if (image) {
      setIsUploaded(true);
      setImage(image);
    } else {
      setIsUploaded(false);
      setImage(null);
    }

    // Filter values dynamically based on formValues keys
    const filteredValues = Object.keys(formValues).reduce((acc, key) => {
      if (key in values) {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    // Reset form with filtered values
    form.reset(filteredValues);
  };

  const handleStatusChange = (id, status) => {
    updateStatusApi(id, status, getData, "category");
  };

  const handleDelete = async (id) => {
    deleteDataApi(id, setDeleting, getData, "category");
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="the-heading">
          Category
          {/* <span className="ml-3 underline text-primary text-xs font-normal">{data && data?.length} item(s)</span> */}
        </h1>
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
        searchData={"category"}
      />
      {/* CATEGORY TABLE */}
    </>
  );
}
