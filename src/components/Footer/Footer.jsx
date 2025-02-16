import { Github } from "lucide-react";

const Footer = () => {
    return (
        <div className="h-[250px] bg-primary w-full flex justify-center items-center py-4">
            <div className="w-[95%] md:w-[85%] h-full flex p-4 flex-col justify-between">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <img
                            src="/assets/logo.png"
                            alt="logo"
                            className="w-[25%] self-start"
                        />
                        <p className="text-background text-sm mt-2 w-[40%] self-start">
                            <span className="font-semibold">Pakheta</span> is a
                            bird conservation project by{" "}
                            <span className="font-semibold">iKANCode</span> that
                            uses advanced AI techniques to identify bird species
                            from audio recordings.
                        </p>
                    </div>

                    <div>
                        <ul className="flex flex-col text-background text-md">
                            <li className="mb-2">Pricing</li>
                            <li className="mb-2">About</li>
                            <li className="mb-2">Contact</li>
                        </ul>
                    </div>
                </div>

                <div className="h-px w-full bg-background "></div>
                <div className="flex justify-between items-center text-background mb-4">
                    <p>
                        &copy; 2025{" "}
                        <span className="font-semibold">iKANCode</span>
                    </p>

                    <Github />
                </div>
            </div>
        </div>
    );
};

export default Footer;
