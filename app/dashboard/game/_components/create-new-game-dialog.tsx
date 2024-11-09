import React from "react";
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { NewGameForm } from "./create-new-game-form";

export default function NewGameDialogComponent () {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create A New Game</DialogTitle>
            <DialogDescription>
              Choose your agents and maximum steps of execution here. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* Create a form here */}
          <div className="grid grid-cols-2">
            <NewGameForm />
          </div>
        </DialogContent>
      </Dialog>
    )
}

