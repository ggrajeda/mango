"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AddDialog } from "./Dialogs";

interface AddButtonProps {
  itemType: string;
  description: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  onAdd: (prevState: any, formData: FormData) => Promise<any>;
}

export function AddButton({
  itemType,
  description,
  namePlaceholder,
  descriptionPlaceholder,
  onAdd
}: AddButtonProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddSubject = () => {
    setAddDialogOpen(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddSubject();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add {itemType}</p>
        </TooltipContent>
      </Tooltip>

      <AddDialog
        itemType={itemType}
        description={description}
        namePlaceholder={namePlaceholder}
        descriptionPlaceholder={descriptionPlaceholder}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={onAdd}
      />
    </>
  );
}
