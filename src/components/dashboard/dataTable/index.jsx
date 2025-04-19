"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import Loader from "@/components/dashboard/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmModal from "../modal/confirmModal";
import axios from "axios";
import { base_url } from "@/utils/apiUrl";
import ShowToaster from "../toast";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable({
  data,
  columns,
  loading,
  status,
  setStatus,
  isDeleting,
  setDeleting,
  bulkId,
  setBulkId,
  getData,
  searchData,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const ids = bulkId.join(",");
      const response = await axios.delete(
        `${base_url}/category?isBulkDelete=true&id=${ids}`
      );

      const result = response.data;
      if (result.success) {
        getData();
        setBulkId([]);
        table.resetRowSelection();
        setDeleteDialogOpen(false);

        ShowToaster({
          type: "success",
          title: "Success",
          description: `${bulkId.length} category deleted successfully`,
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
    <div className="w-full">
      <div className="flex items-end justify-between py-4">
        <div className="flex items-end gap-2">
          <div>
            <Label className="block mb-1 text-xs">Rows per page</Label>
            <Select
              value={table.getState().pagination.pageSize}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue>
                  {table.getState().pagination.pageSize}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block mb-1 text-xs">Select column</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto h-10">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <Label className="block mb-1 text-xs">Select status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue value={status} placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select status</SelectLabel>
                  <SelectItem value="0">All</SelectItem>
                  <SelectItem value="1">Published</SelectItem>
                  <SelectItem value="2">Draft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Input
          placeholder={`Search by ${searchData}...`}
          value={table.getColumn(searchData)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(searchData)?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-10"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const width = header.column.columnDef.width || "auto";
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width }}
                      className="text-xs uppercase font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {columns.map((item, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    {columns.map((item, index) => {
                      return (
                        <TableCell key={index}>
                          {item.accessorKey ===
                          "select" ? null : item.accessorKey === "image" ? (
                            <Skeleton className="h-12 w-12 mx-auto rounded-md bg-muted/60" />
                          ) : (
                            <Skeleton className="h-10 w-full bg-muted/60" />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/30"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center py-5"
                    >
                      <Image
                        src={"/images/no-data.png"}
                        className="mx-auto mb-2 opacity-70"
                        width={100}
                        height={100}
                        alt="No data"
                      />
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-4 space-x-2 py-4 sticky bottom-0 z-10 bg-white">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <div className="text-sm text-destructive cursor-pointer hover:opacity-70">
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  item(s)
                </div>
              </DialogTrigger>

              <ConfirmModal
                actionBtn={handleBulkDelete}
                title={`delete ${
                  table.getFilteredSelectedRowModel().rows.length
                } item(s)`}
                btnText="Delete"
                isLoading={isDeleting}
              />
            </Dialog>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="pagination-btn"
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="pagination-btn"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
