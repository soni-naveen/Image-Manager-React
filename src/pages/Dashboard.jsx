import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Home, LogOut, Plus, Upload, X, Search } from "lucide-react";
import FolderCard from "@/components/folder-card";
import ImageCard from "@/components/image-card";

export default function Dashboard() {
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_REACT_BASE_URL;

  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loadImages, setLoadImages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
    fetchFolderContents();
  }, [currentFolder]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  const fetchFolderContents = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = currentFolder
        ? `${URL}/api/folders/${currentFolder}/contents`
        : `${URL}/api/folders/root`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    } finally {
      setLoading(false);
      setLoadImages(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/api/folders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: folderName,
          parentId: currentFolder,
        }),
      });

      if (response.ok) {
        setFolderName("");
        setShowCreateFolder(false);
        fetchFolderContents();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create folder");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imageName.trim() || !imageFile) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("name", imageName);
    formData.append("image", imageFile);
    formData.append("folderId", currentFolder || "");

    try {
      const token = localStorage.getItem("token");

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`${URL}/api/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setImageName("");
        setImageFile(null);
        setShowUploadImage(false);
        fetchFolderContents();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to upload image");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageDelete = (imageId) => {
    setImages(images.filter((img) => img._id !== imageId));
    setSearchResults(searchResults.filter((img) => img._id !== imageId));
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${URL}/api/images/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error searching images:", error);
    }
  };

  const handleFolderDelete = (folderId) => {
    setFolders(folders.filter((folder) => folder._id !== folderId));
  };

  const navigateToFolder = (folderId, folderName) => {
    setLoadImages(true);
    setCurrentFolder(folderId);

    setBreadcrumb((prev) => {
      const exists = prev.some((b) => b.id === folderId);
      if (exists) return prev; // Avoid duplicates
      return [...prev, { id: folderId, name: folderName }];
    });
  };

  const navigateToRoot = () => {
    setCurrentFolder(null);
    setBreadcrumb([]);
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      navigateToRoot();
    } else {
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setCurrentFolder(newBreadcrumb[newBreadcrumb.length - 1].id);
      setBreadcrumb(newBreadcrumb);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              {user && (
                <span className="text-gray-600 text-sm sm:text-base">
                  Welcome, {user.name}
                </span>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mb-6 relative">
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((image) => (
                  <ImageCard
                    key={image._id}
                    image={image}
                    onDelete={handleImageDelete}
                  />
                ))}
              </div>
            </CardContent>
            <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X onClick={() => setSearchResults([])} className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </div>
          </Card>
        )}

        {/* Breadcrumb */}
        <div className="flex items-center mb-6 overflow-x-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToRoot}
            className="text-blue-600 hover:text-blue-800"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Button>
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <span className="text-gray-400">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToBreadcrumb(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                {item.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateFolder(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showUploadImage} onOpenChange={setShowUploadImage}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-1" />
                Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Image</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUploadImage} className="space-y-4">
                <div>
                  <Label htmlFor="imageName">Image Name</Label>
                  <Input
                    id="imageName"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="Enter image name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageFile">Select Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                  />
                </div>
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadImage(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Folders and Images Grid */}
        {loadImages ? (
          <div className="mt-20 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Folders */}
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  onDelete={handleFolderDelete}
                  onNavigate={navigateToFolder}
                />
              ))}

              {/* Images */}
              {images.map((image) => (
                <ImageCard
                  key={image._id}
                  image={image}
                  onDelete={handleImageDelete}
                />
              ))}
            </div>

            {folders.length === 0 && images.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No folders or images found. Create a folder or upload an image
                  to get started.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
