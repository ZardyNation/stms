"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Nominee, Category } from "@/types";
import { saveNominee } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const nomineeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  organization: z.string().min(1, "Organization is required"),
  photo: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  aiHint: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
});

type NomineeFormData = z.infer<typeof nomineeSchema>;

interface NomineeFormProps {
  nominee?: Nominee | null;
  categories: Omit<Category, 'nominees'>[];
  isOpen: boolean;
  onClose: () => void;
}

export default function NomineeForm({ nominee, categories, isOpen, onClose }: NomineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NomineeFormData>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: {
      id: nominee?.id || undefined,
      name: nominee?.name || "",
      organization: nominee?.organization || "",
      photo: nominee?.photo || "",
      aiHint: nominee?.aiHint || "",
      category_id: nominee?.category_id || "",
    },
  });

  const handleFormSubmit = async (data: NomineeFormData) => {
    setIsSubmitting(true);
    const result = await saveNominee(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: `Nominee has been ${nominee ? 'updated' : 'added'}.`,
      });
      onClose();
      reset();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nominee ? "Edit Nominee" : "Add New Nominee"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" {...register("organization")} />
            {errors.organization && <p className="text-sm text-destructive">{errors.organization.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
             {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input id="photo" {...register("photo")} placeholder="https://placehold.co/128x128.png"/>
             {errors.photo && <p className="text-sm text-destructive">{errors.photo.message}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {nominee ? "Save Changes" : "Add Nominee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
