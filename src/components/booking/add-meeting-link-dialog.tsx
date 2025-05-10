
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LinkIcon } from "lucide-react";

interface AddMeetingLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: string) => Promise<void>; // Make onSave async
  bookingId: string;
  currentLink?: string;
}

export default function AddMeetingLinkDialog({
  isOpen,
  onClose,
  onSave,
  bookingId,
  currentLink,
}: AddMeetingLinkDialogProps) {
  const [linkInput, setLinkInput] = useState(currentLink || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLinkInput(currentLink || "");
  }, [currentLink, isOpen]);

  const handleSave = async () => {
    if (!linkInput.trim()) {
        // Maybe add a toast here for empty link
        return;
    }
    setIsSaving(true);
    await onSave(linkInput);
    setIsSaving(false);
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-primary" />
            Add/Edit Meeting Link
          </DialogTitle>
          <DialogDescription>
            Provide the video call link for this session (e.g., Zoom, Google Meet).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="meeting-link" className="text-right col-span-1">
              Link
            </Label>
            <Input
              id="meeting-link"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="col-span-3"
              placeholder="https://meet.example.com/your-session"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isSaving || !linkInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
