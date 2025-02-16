import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import server from "../lib/axios/axios.instance";

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);

    try {
        // Send POST request to the server
        const res = await server.post("/auth/", data);
        console.log(res);

        // Check for authentication in the response
        if (res.data && res.data.authentication) {
            toast.success("Logged In Successfully");
            localStorage.setItem("username", data.username); // Store username in localStorage
            return redirect("/"); // Redirect to the home page
        } else {
            toast.error("Invalid credentials. Please try again.");
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error(
            error?.response?.data?.msg || "Login failed. Please try again."
        );
    }
};

// Login Component
const Login = () => {
    return (
        <div className="h-full bg-background flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] md:w-[400px]">
                <h2 className="text-3xl font-semibold text-center text-primary mb-6">
                    Login
                </h2>
                {/* This Form component triggers the action function automatically */}
                <Form method="post" className="flex flex-col">
                    <label
                        htmlFor="username"
                        className="text-gray-700 font-medium mb-2"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        required
                        className="border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your username"
                    />

                    <label
                        htmlFor="password"
                        className="text-gray-700 font-medium mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your password"
                    />

                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-[#227747] transition-all"
                    >
                        Login
                    </button>
                </Form>
                <p className="text-sm text-center text-gray-500 mt-4">
                    {"Don't have an account? "}
                    <a href="/signup" className="text-primary font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
