import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div
            className="min-h-screen w-full max-w-lg mx-auto bg-[#0d2429] text-white"
            style={{
                backgroundImage: "url(https://i.pinimg.com/1200x/12/c6/06/12c6060d700f3681ca19894a108d69c4.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Outlet />
        </div>
    );
};

export default AuthLayout;