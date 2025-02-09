import React, { useEffect, useState } from "react";
import { Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockStudent = {
  name: "John Doe",
  email: "john.doe@example.com",
  courses: ["Mathematics", "Physics", "Computer Science"]
};

const Profile = () => {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call with setTimeout
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setTimeout(() => {
        setStudent(mockStudent);
      }, 1000);
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Profile</h2>
        </div>

        <div className="px-6 py-4">
          {student ? (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium text-gray-900">{student.name}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium text-gray-900">{student.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Enrolled Courses</p>
                <p className="text-lg font-medium text-gray-900">
                  {student.courses ? student.courses.join(", ") : "No courses enrolled"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-lg text-gray-600">Loading...</div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={handleHome}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;