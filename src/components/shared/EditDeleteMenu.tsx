"use client"

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DeleteDialog, EditDialog } from "./Dialogs";

interface EditDeleteMenuProps<T extends { id: number; title: string; description: string; }> {
  item: T;
  itemType: string;
  editDescription?: string;
  editNamePlaceholder?: string;
  deleteDescription?: string;
  onEdit: (prevState: any, formData: FormData) => Promise<any>;
  onDelete: (prevState: any, formData: FormData) => Promise<any>;
}

export function EditDeleteMenu<T extends { id: number; title: string; description: string; }>({
  item,
  itemType,
  editDescription,
  deleteDescription,
  onEdit,
  onDelete,
}: EditDeleteMenuProps<T>) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted/50"
          onClick={handleDropdownClick}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-sans" align="end" side="right">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDialog<T>
        item={item}
        itemType={itemType}
        description={editDescription}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEdit={onEdit}
      />

      <DeleteDialog<T>
        item={item}
        itemType={itemType}
        description={deleteDescription}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={onDelete}
      />
    </>
  );
}
