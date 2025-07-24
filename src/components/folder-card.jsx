"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder, MoreVertical, Trash2, FolderOpen } from "lucide-react";

export default function FolderCard({ folder, onDelete, onNavigate }) {
  const URL = import.meta.env.VITE_REACT_BASE_URL;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/folders/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderId: folder._id }),
      });

      if (response.ok) {
        onDelete(folder._id);
        setShowDeleteDialog(false);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Error deleting folder");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="group bg-sky-100 border border-sky-200 cursor-pointer hover:shadow-md transition-shadow h-fit relative">
        <CardContent
          className="px-4 py-7 text-center"
          onClick={() => onNavigate(folder._id, folder.name)}
        >
          <Folder className="w-14 sm:w-16 h-14 sm:h-16 mx-auto mb-2 text-blue-500" />
          <p className="text-sm font-medium truncate" title={folder.name}>
            {folder.name}
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">
            {new Date(folder.createdAt).toLocaleDateString()}
          </p>
        </CardContent>

        {/* Actions dropdown */}
        <div className="absolute top-2 right-2 opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onNavigate(folder._id, folder.name)}
              >
                <FolderOpen className="w-4 h-4 mr-1" />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete the folder "{folder.name}"?
                </p>
                <p className="text-red-600 font-medium">
                  ⚠️ This will permanently delete:
                </p>
                <ul className="text-red-600 text-sm list-disc list-inside space-y-1">
                  <li>The folder and all its contents</li>
                  <li>All subfolders within this folder</li>
                  <li>All images stored in this folder and its subfolders</li>
                  <li>Images will also be removed from Cloudinary</li>
                </ul>
                <p className="text-red-600 font-medium">
                  This action cannot be undone.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
