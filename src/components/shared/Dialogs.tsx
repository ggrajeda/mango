"use client"

import { useState, useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "./ErrorMessage";

const initialState = { message: "" };

interface AddDialogProps {
  itemType: string;
  description?: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (prevState: any, formData: FormData) => Promise<any>;
}

export function AddDialog({
  itemType,
  description,
  namePlaceholder,
  descriptionPlaceholder,
  open,
  onOpenChange,
  onAdd,
}: AddDialogProps) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [state, action, pending] = useActionState(onAdd, initialState);

  const validateName = (name: string) => {
    return (name.length >= 50) ? `${itemType} name must be fewer than 50 characters.` : "";
  };

  const validateDescription = (description: string) => {
    return (description.length >= 1000) ? `${itemType} description must be fewer than 1000 characters.` : "";
  };

  const formAction = async (formData: FormData) => {
    action(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add New {itemType}</DialogTitle>
            <DialogDescription>
              {description || `Create a new ${itemType.toLowerCase()}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 px-2 flex flex-col space-y-6">
            <div className="flex flex-col space-y-2.5">
              <Label htmlFor="item-name" className="gap-0.5">
                <span className="">Name</span> <span className="text-muted-foreground">*</span>
              </Label>
              <Input
                name="name"
                id="item-name"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
                placeholder={namePlaceholder}
                autoFocus
              />
              {nameError && <ErrorMessage message={nameError} />}
            </div>
            <div className="flex flex-col space-y-2.5">
              <Label htmlFor="item-description" className="gap-0.5">
                Description <span className="text-muted-foreground">*</span>
              </Label>
              <Textarea
                name="description"
                id="item-description"
                value={itemDescription}
                onChange={(e) => {
                  setItemDescription(e.target.value);
                  setDescriptionError(validateDescription(e.target.value));
                }}
                placeholder={descriptionPlaceholder}
                className="resize-none h-50"
              />
              {descriptionError && <ErrorMessage message={descriptionError} />}
              {state?.error && (
                <ErrorMessage message={state.error} />
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex items-start justify-between">
              <span className="ml-2 text-xs text-muted-foreground"><span className="text-">*</span> Indicates a required field</span>
              <Button
                type="submit"
                aria-disabled={pending || !!nameError || !itemName.trim() || !!descriptionError || !itemDescription.trim()}
              >
                {pending ? `Creating...` : `Create ${itemType}`}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditDialogProps<T> {
  item: T;
  itemType: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (prevState: any, formData: FormData) => Promise<any>;
}

export function EditDialog<T extends { id: number; title: string; description: string; }>({
  item,
  itemType,
  description,
  open,
  onOpenChange,
  onEdit,
}: EditDialogProps<T>) {
  const [itemName, setItemName] = useState(item.title);
  const [nameError, setNameError] = useState("");
  const [state, action, pending] = useActionState(onEdit, initialState);

  const validateName = (name: string) => {
    return (name.length > 50) ? `${itemType} name must be 50 characters or less.` : "";
  };

  const formAction = async (formData: FormData) => {
    action(formData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <form action={formAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="description" value={item.description} />
          <DialogHeader>
            <DialogTitle>Edit {itemType}</DialogTitle>
            <DialogDescription>
              {description || `Make changes to the ${itemType.toLowerCase()} details here`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-8">
            <Label htmlFor="item-name" className="text-right">
              Name
            </Label>
            <Input
              name="name"
              id="item-name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                setNameError(validateName(e.target.value));
              }}
              className="col-span-3"
              autoFocus
            />
            {nameError && <ErrorMessage message={nameError} />}
            {state?.error && (
              <ErrorMessage message={state.error} />
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              aria-disabled={pending || !!nameError || !itemName.trim()}
            >
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps<T> {
  item: T;
  itemType: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (prevState: any, formData: FormData) => Promise<any>;
}

export function DeleteDialog<T extends { id: number; title: string; description: string; }>({
  item,
  itemType,
  description,
  open,
  onOpenChange,
  onDelete,
}: DeleteDialogProps<T>) {
  const [state, action, pending] = useActionState(onDelete, initialState);

  const formAction = async (formData: FormData) => {
    action(formData);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <form action={formAction}>
          <input type="hidden" name="id" value={item.id} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="pt-2 pb-8">
              {description ||
                `This action cannot be undone. This will permanently delete the
              ${itemType.toLowerCase()} "${item.title}" and all associated data.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          {state?.error && (
            <ErrorMessage message={state.error} />
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              aria-disabled={pending}
            >
              {pending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
