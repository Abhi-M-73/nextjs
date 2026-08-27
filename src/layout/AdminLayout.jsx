import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import DashboardHeader from "../components/common/DashboardHeader";
import { useState } from "react";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen">
            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className="flex flex-col flex-1 min-w-0 bg-[#021d29]">
                <div className="shrink-0">
                    <DashboardHeader
                        onMenuClick={() => {
                            setIsOpen(true);
                            setIsCollapsed(false);
                        }}
                    />
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
