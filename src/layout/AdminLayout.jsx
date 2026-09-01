// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/common/Sidebar";
// import DashboardHeader from "../components/common/DashboardHeader";
// import { useState } from "react";

// const AdminLayout = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     return (
//         <div className="flex h-screen">
//             <Sidebar
//                 isOpen={isOpen}
//                 setIsOpen={setIsOpen}
//                 isCollapsed={isCollapsed}
//                 setIsCollapsed={setIsCollapsed}
//             />

//             <div className="flex flex-col flex-1 min-w-0 bg-[#021d29]">
//                 <div className="shrink-0">
//                     <DashboardHeader
//                         onMenuClick={() => {
//                             setIsOpen(true);
//                             setIsCollapsed(false);
//                         }}
//                     />
//                 </div>

//                 <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLayout;

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import DashboardHeader from "../components/common/DashboardHeader";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <DashboardHeader
            onMenuClick={() => {
              setIsOpen(true);
              setIsCollapsed(false);
            }}
          />
        </header>

        {/* Page Content */}
        <section className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
