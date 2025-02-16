import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
    return (
        <div className="w-full min-h-screen bg-background flex flex-col justify-between">
            <Navbar className="w-full p-0 m-0" />
            <main>{children}</main>
            <Footer className="w-full p-0 m-0" />
        </div>
    );
};

export default Layout;
