import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Check,
  X,
  Edit,
} from "lucide-react";

export default function ImageCard({ image, onDelete, onRename, onError }) {
  const URL = import.meta.env.VITE_REACT_BASE_URL;
  const [showPreview, setShowPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(image.name);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/images/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageId: image._id }),
      });

      if (response.ok) {
        onDelete(image._id);
      } else {
        onError("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      onError("Error deleting image");
    } finally {
      setDeleting(false);
    }
  };

  const handleRename = async () => {
    if (!editName.trim() || editName === image.name) {
      setEditing(false);
      setEditName(image.name);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/images/rename`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageId: image._id,
          newName: editName.trim(),
        }),
      });

      if (response.ok) {
        onRename(image._id, editName.trim());
        setEditing(false);
      } else {
        const data = await response.json();
        onError(data.message || "Failed to rename image");
        setEditName(image.name);
      }
    } catch (error) {
      console.error("Error renaming image:", error);
      onError("Error renaming image");
      setEditName(image.name);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditName(image.name);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  function cloudinaryDownloadUrl(url, filename) {
    // Insert fl_attachment (optionally with a filename) into the URL
    // Cloudinary URLs look like: https://res.cloudinary.com/<cloud>/image/upload/v123/.../public_id.jpg
    const [prefix, rest] = url.split("/upload/");
    const safeName = encodeURIComponent(filename || "download");
    return `${prefix}/upload/fl_attachment:${safeName}/${rest}`;
  }

  const handleDownload = () => {
    const dlUrl = cloudinaryDownloadUrl(
      image.url,
      image.name || image.filename
    );
    const link = document.createElement("a");
    link.href = dlUrl;
    link.download = ""; // optional; server headers will drive filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Generate thumbnail URL with Cloudinary transformations
  const thumbnailUrl = image.url?.replace(
    "/upload/",
    "/upload/w_200,h_200,c_fill,q_auto,f_auto/"
  );

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow relative">
        <CardContent className="p-1">
          <div
            onClick={() => setShowPreview(true)}
            className="relative aspect-square mb-1 bg-gray-100 rounded-md overflow-hidden"
          >
            {image.url ? (
              <img
                src={thumbnailUrl || image.url}
                alt={image.name}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 text-xs">No preview</div>
              </div>
            )}

            {/* Hover overlay with actions */}
            {!editing && (
              <div className="absolute inset-0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {editing ? (
              <div className="space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-sm text-center"
                  autoFocus
                  disabled={saving}
                />
                <div className="flex justify-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRename}
                    disabled={saving}
                    className="h-6 w-6 p-0"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p
                  className="text-sm text-center font-medium truncate whitespace-pre pl-1.5"
                  title={image.name}
                >
                  {image.name}
                </p>
                {/* Actions dropdown */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="none" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top">
                      <DropdownMenuItem onClick={() => setShowPreview(true)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deleting ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between mr-7 xs:mr-5">
              <span className="truncate max-w-40 sm:max-w-80">
                {image.name}
              </span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  <span className="hidden xs:block">Download</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden xs:block">
                    {deleting ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative max-h-[60vh] overflow-hidden rounded bg-gray-100">
              {image.url ? (
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "60vh" }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="text-gray-400">No preview available</div>
                </div>
              )}
            </div>

            {/* Image Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">File name:</span>
                <p className="text-gray-600 truncate">
                  {image.filename || "Unknown"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">File size:</span>
                <p className="text-gray-600">
                  {image.size ? formatFileSize(image.size) : "Unknown"}
                </p>
              </div>
              {image.width && image.height && (
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <p className="text-gray-600">
                    {image.width} × {image.height} pixels
                  </p>
                </div>
              )}
              {image.format && (
                <div>
                  <span className="font-medium text-gray-700">Format:</span>
                  <p className="text-gray-600 uppercase">{image.format}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Uploaded:</span>
                <p className="text-gray-600">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <p className="text-gray-600">{image.type || "Unknown"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the Image "{image.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(false);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
