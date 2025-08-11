'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import type { Category, Nominee } from '@/types';
import NomineeForm from './NomineeForm';
import { deleteNominee } from './actions';
import { useToast } from '@/hooks/use-toast';

interface NomineeManagerProps {
  categories: Category[];
}

export default function NomineeManager({ categories }: NomineeManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [nomineeToDelete, setNomineeToDelete] = useState<Nominee | null>(null);
  const { toast } = useToast();

  const allNominees = categories.flatMap(c => c.nominees.map(n => ({...n, category_id: c.id, categoryTitle: c.title})));
  const categoriesForForm = categories.map(({id, title}) => ({id, title}));

  const handleAdd = () => {
    setSelectedNominee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (nominee: Nominee) => {
    setSelectedNominee(nominee);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
      if (!nomineeToDelete) return;

      setIsDeleting(true);
      const result = await deleteNominee(nomineeToDelete.id);
      setIsDeleting(false);

      if (result.success) {
          toast({ title: 'Success', description: 'Nominee deleted successfully.' });
      } else {
          toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
      setNomineeToDelete(null);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Nominees</CardTitle>
                <CardDescription>Add, edit, or delete award nominees.</CardDescription>
            </div>
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2" />
                Add Nominee
            </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allNominees.map(nominee => (
                  <TableRow key={nominee.id}>
                    <TableCell>
                      <Image
                        src={nominee.photo || 'https://placehold.co/64x64.png'}
                        alt={`Photo of ${nominee.name}`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{nominee.name}</TableCell>
                    <TableCell>{nominee.organization}</TableCell>
                    <TableCell>{nominee.categoryTitle}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(nominee)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setNomineeToDelete(nominee)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NomineeForm
        nominee={selectedNominee}
        categories={categoriesForForm}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

       <AlertDialog open={!!nomineeToDelete} onOpenChange={() => setNomineeToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete {nomineeToDelete?.name} and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                       {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
