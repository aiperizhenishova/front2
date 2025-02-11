import React, { useEffect, useState } from "react";
import { Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No token found!");
        navigate("/register");
        return;
      }

      try {
        const response = await fetch("http://localhost:7070/api", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 403) {
          setError("Access forbidden. Token might be invalid!");
          localStorage.removeItem("token");
          navigate("/register");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch profile");

        const profileData = await response.json();
        setStudent(profileData);
        setFormData({ email: profileData.email, password: "" });

      } catch (error) {
        console.error("Error loading profile:", error);
        setError(error.message);
        if (error.message.includes("403")) {
          localStorage.removeItem("token");
          navigate("/register");
        }
      }
    };

    loadProfile();
  }, [navigate]);

  // Остальная часть компонента без изменений
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:7070/api", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          throw new Error("Failed to delete account");
        }
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be empty when updating profile.");
      return;
    }  

    try {
      const response = await fetch("http://localhost:7070/api", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        const updatedData = await response.json();
        setStudent(updatedData);
        setEditMode(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Profile</h2>
        </div>

        <div className="px-6 py-4">
          {error && <div className="text-red-500">{error}</div>}

          {student ? (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500">Email</p>
                {editMode ? (
                  <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{student.email}</p>
                )}
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-500">Password</p>
                {editMode ? (
                 <input
                 type="password"
                 name="password"
                 value={formData.password || ""}
                 onChange={handleChange}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
               />
                ) : (
                  <p className="text-lg font-medium text-gray-900">********</p>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                {editMode ? (
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Edit Profile
                  </button>
                )}

                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete Account
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-lg text-gray-600">Loading...</div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/home")}
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