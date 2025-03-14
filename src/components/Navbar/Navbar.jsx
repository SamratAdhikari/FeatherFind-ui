import { CircleUserRound } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Hide dropdown when clicking outside
    useEffect(() => {
        const user = localStorage.getItem("username");
        if (user) {
            setUsername(user);
        }

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Logout handler
    const logout = () => {
        console.log("Logout triggered");
        localStorage.removeItem("username");
        setUsername(null);
        navigate("/login");
    };

    return (
        <nav className="bg-[#02542D] h-16 flex justify-center items-center w-full">
            <div className="w-[95%] md:w-[85%] flex justify-between items-center">
                <div className="flex items-center justify-between w-[10%]">
                    <img
                        src="/assets/logo.png"
                        alt="logo"
                        className="w-12"
                    />
                    <span className="text-xl font-semibold text-background">
                        FeatherFind
                    </span>
                </div>
                <div className="hidden md:block md:w-[40%] lg:w-[30%]">
                    <ul className="flex justify-between text-background font-semibold text-md md:text-lg">
                        <li>
                            <Link to="/" className="text-inherit">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/user" className="text-inherit">
                                Map
                            </Link>
                        </li>
                        {/* <li>
                            <Link to="/pricing" className="text-inherit">
                                Pricing
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/contact" className="text-inherit">
                                Contact
                            </Link>
                        </li>
                        {/* <li className="relative">
                            <div className="relative">
                                <CircleUserRound
                                    className="text-secondary cursor-pointer"
                                    onClick={() =>
                                        setShowDropdown((prev) => !prev)
                                    }
                                />
                                {showDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 w-20 bg-white shadow-md rounded-md z-10"
                                    >
                                        <ul className="py-2">
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-textSecondary text-sm"
                                                onClick={() =>
                                                    navigate("/user")
                                                }
                                            >
                                                Map
                                            </li>
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-textSecondary text-sm"
                                                onClick={logout}
                                            >
                                                Logout
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
