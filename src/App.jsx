import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Map, Spectrogram, Login } from "./pages";
import Layout from "./components/Layout/Layout";
import Pricing from "./pages/Pricing";
import { action as LoginAction } from "./pages/Login";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
    {   
        path: "/user",
        element: (
            <Layout>
                <Map />
            </Layout>
        ),
    },
    {
        path: "/record",
        element: (
            <Layout>
                <Spectrogram />
            </Layout>
        ),
    },
    {
        path: "/pricing",
        element: (
            <Layout>
                <Pricing />
            </Layout>
        ),
    },
    {
        path: "/login",
        element: (
            <Layout>
                <Login />
            </Layout>
        ),
        action: LoginAction, // Place the action here, inside the /login route object
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
