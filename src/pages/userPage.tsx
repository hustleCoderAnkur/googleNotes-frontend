import { useEffect, useState } from "react";
import { Edit, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface UserData {
    username: string;
    email: string;
    mobileNumber: string;
}

const getCurrentUser = () => {
    return api.get("/user/getCurrentUser");
};


function UserPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState<string | null>(null);

    const [editform, setEditform] = useState<UserData>({
        username: "",
        email: "",
        mobileNumber: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setEditform({
                username: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data.data);
            } catch (err) {
                alert(`Unauthorized. Please login again. ${err}`);
                navigate("/notes");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditform({
            ...editform,
            [e.target.name]: e.target.value,
        });
    };


    const handleSave = async () => {
        try {
            const res = await api.put("/user/updateAccountDetails", editform);
            setUser(res.data.data || editform);
            setEdit(null);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            alert(`Failed to update profile: ${error}`);
        }
    };

    const handleCancel = () => {
        setEdit(null);
        setEditform(user!);
    };

    const handleLogout = async () => {
        try {
            await api.post("/user/logoutUser");
            setUser(null)
            alert("logout successfully!");
            navigate("/notes")
        } catch (error) {
            console.error("logout error:", error);
            alert(`Failed to logout: ${error}`);
        }
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure? This action cannot be undone"
        );

        if (!confirmDelete) return
        
        try {
            await api.delete("/user/deleteAccount");
            alert("Account Deleted successfully!");
            setUser(null);
            navigate("/notes");
        } catch (error) {
            console.error("delete account error:", error);
            alert("failed to delete account");
        }
    }

    if (loading) {
        return <p className="text-center mt-10">Loading user...</p>;
    }

    return (
        <>
            <div className="max-w-md mx-auto mt-10 p-8 bg-linear-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <User size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
                    <p className="text-sm text-gray-500 mt-1">Account Information</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="username"
                                disabled={edit !== "username"}
                                onChange={handleChange}
                                value={editform?.username || ""}
                                className={`flex-1 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${edit === "username" ? "bg-white text-black" : "bg-gray-50 text-gray-600"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setEdit("username")}
                                className="p-3 bg-gray-50 border border-gray-100 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                <Edit size={16} />
                            </button>
                        </div>
                        {edit === "username" && (
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-gray-50 border border-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-50 border border-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="mobileNumber"
                                disabled={edit !== "mobileNumber"}
                                onChange={handleChange}
                                value={editform?.mobileNumber || ""}
                                className={`flex-1 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${edit === "mobileNumber" ? "bg-white text-black" : "bg-gray-50 text-gray-600"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setEdit("mobileNumber")}
                                className="p-3 bg-gray-50 border border-gray-100 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                <Edit size={16} />
                            </button>
                        </div>
                        {edit === "mobileNumber" && (
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-gray-50 border border-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-50 border border-gray-100 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="email"
                                name="email"
                                disabled={edit !== "email"}
                                onChange={handleChange}
                                value={editform?.email || ""}
                                className={`flex-1 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${edit === "email" ? "bg-white text-black" : "bg-gray-50 text-gray-600"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setEdit("email")}
                                className="p-3 bg-gray-50 border border-gray-100 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                <Edit size={16} />
                            </button>
                        </div>
                        {edit === "email" && (
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1  bg-white border-2 border-green-500 text-green-600 font-semibold py-2 px-2 rounded-3xl hover:bg-green-50 hover:border-green-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-50 border border-gray-100 font-semibold py-2 px-2 rounded-3xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={handleLogout}
                        className="flex-1 bg-gray-50 border border-gray-200 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        Logout
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-white border-2 border-red-200 text-red-600 font-semibold py-2 px-4 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
}

export default UserPage;