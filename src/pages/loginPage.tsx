import { useState } from "react";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthFormData {
    username: string;
    email: string;
    mobileNumber: string;
    password: string;
}

const BASE_URL = "http://localhost:8000/api/user";


function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AuthFormData>({
        username: "",
        email: "",
        mobileNumber: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        if (!formData.email || !formData.password) {
            alert("Email and password are required");
            return;
        }

        if (!isLogin) {
            if (!formData.username || !formData.mobileNumber) {
                alert("All fields are required");
                return;
            }

            if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
                alert("Mobile number must be 10 digits");
                return;
            }
        }

        setLoading(true);

        try {
            const endpoint = isLogin
                ? `${BASE_URL}/loginUser`
                : `${BASE_URL}/registerUser`;

            const payload = isLogin
                ? {
                    email: formData.email,
                    password: formData.password,
                }
                : {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    mobileNumber: formData.mobileNumber.trim(),
                    password: formData.password,
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get("content-type");
            const data =
                contentType && contentType.includes("application/json")
                    ? await response.json()
                    : null;


            alert(data.message || "Success!");
        
            navigate('/user')

        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  from-yellow-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
                        <img src="/keepLogo.png" alt="Keep Logo" className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Keep Notes</h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to continue' : 'Create your account'}
                    </p>
                </div>
    
                    <div className="space-y-5">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                                            placeholder="Enter mobile number"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {isLogin ? 'Email or Username' : 'Email'}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={isLogin ? 'text' : 'email'}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                                    placeholder={isLogin ? "Email or username" : "Enter email"}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" /> }
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({
                                    username: '',
                                    email: '',
                                    mobileNumber: '',
                                    password: ''
                                });
                            }}
                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>

            </div>
        
    );
}

export default LoginPage
