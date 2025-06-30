import { Outlet, Navigate } from "react-router"

export default function ProtectedRoutes(){
    const user = localStorage.getItem("user")
    return user?<Outlet/>:<Navigate to="/login"></Navigate>
}
