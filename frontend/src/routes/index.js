import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import Home from '../pages/Home'; 
import Login from '../pages/Login'; 
import AdminPanel from '../pages/AdminPanel';
import AllUsers from "../pages/AllUsers"; 
import Allproducts from '../pages/Allproducts'; 
import Allcategory from '../pages/AllCategory';
import Allorders from '../pages/Allorders'; 
import Bills from '../pages/Bills'; 
import Allsub from "../pages/Allsub"
const router = createBrowserRouter([
    {
        path: "*", // This will match all paths
        element: <App />, // Main app component
        children: [
            {
                path: "", // Root path
                element: <Home /> // Home component
            },
            {
                path: "login", // Login path
                element: <Login />
            },
            {
                path: "admin-panel", // Admin panel path
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users", // Admin: All users
                        element: <AllUsers />
                    },
                    {
                        path: "all-sub", // Admin: Add subcategory
                        element: <Allsub />
                    },
                    {
                        path: "all-products", // Admin: All products
                        element: <Allproducts />
                    },
                    {
                        path: "all-category", // Admin: All products
                        element: <Allcategory />
                    },
                    {
                        path: "all-orders", // Admin: All orders
                        element: <Allorders />
                    },
                    {
                        path: "bill", // Admin: Bills
                        element: <Bills />
                    }
                ]
            },
        ]
    }
]);

export default router;

