import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder, ImageIcon, Search, Shield } from "lucide-react";
import Footer from "@/components/footer";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Image Manager</h1>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" className="hidden xs:inline">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Organize Your Images Like Never Before
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create nested folders, upload images with custom names, and search
            through your collection with ease. Your personal image management
            solution.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Folder className="w-12 h-12 text-blue-500 mb-5" />
              <CardTitle>Nested Folders</CardTitle>
              <CardDescription>
                Create unlimited nested folders just like Google Drive to
                organize your images perfectly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ImageIcon className="w-12 h-12 text-green-500 mb-5" />
              <CardTitle>Easy Upload</CardTitle>
              <CardDescription>
                Upload images with custom names and organize them in your folder
                structure effortlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Search className="w-12 h-12 text-purple-500 mb-5" />
              <CardTitle>Smart Search</CardTitle>
              <CardDescription>
                Find your images instantly by searching through your personal
                collection by name.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Security */}
        <div className="mt-16 text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Your Data is Secure
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each user has their own private space. You can only see and manage
            the folders and images you create. Your privacy and security are our
            top priorities.
          </p>
        </div>
      </div>
      {/* Footer  */}
      <Footer />
    </div>
  );
}
