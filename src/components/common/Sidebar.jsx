// import { X, ChevronLeft, ChevronRight } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { adminRoutes } from "../../routes/routes";
// import mainContent from "../../utils/mainContent";

// const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
//   const menu = adminRoutes;

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed md:static z-50 top-0 left-0 h-screen
//         ${isCollapsed ? "w-20" : "w-64"}
//         bg-gradient-to-b from-[#071c24] to-[#04141a]
//         text-gray-300 p-4 flex flex-col
//         transform transition-all duration-300

//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0
//       `}
//       >
//         <div className="flex items-center justify-between mb-8">

//           {/* Logo */}
//           {!isCollapsed && (
//             <div className="flex items-center gap-3 bg-white p-2 rounded-xl">
//               <img className="h-10" src={mainContent.applogo} alt="" />
//             </div>
//           )}

//           {/* Desktop Toggle */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden md:flex p-2 rounded-lg hover:bg-gray-700"
//           >
//             {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//           </button>

//           {/* Mobile Close */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="md:hidden"
//           >
//             <X />
//           </button>
//         </div>

//         {/* Menu */}
//         <div className="flex-1 space-y-6 overflow-y-auto">
//           {menu.map((section, index) => (
//             <div key={index}>

//               {/* Section Title */}
//               {!isCollapsed && (
//                 <p className="text-sm text-gray-400 mb-2">
//                   {section.section}
//                 </p>
//               )}

//               <div className="space-y-1">
//                 {section.items.map((item, i) => (
//                   <NavLink
//                     key={i}
//                     to={`/admin/${item.path}`}
//                     end
//                     className={({ isActive }) =>
//                       `flex items-center ${isCollapsed ? "justify-center" : "gap-3"
//                       } p-3 rounded-xl transition-all duration-200
//                       ${isActive
//                         ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
//                         : "hover:bg-[#0f2a33] hover:text-white"
//                       }`
//                     }
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <item.icon size={20} />

//                     {!isCollapsed && (
//                       <span className="text-sm font-medium">
//                         {item.name}
//                       </span>
//                     )}
//                   </NavLink>
//                 ))}
//               </div>

//               {!isCollapsed && index !== menu.length - 1 && (
//                 <div className="border-b border-gray-700 mt-5"></div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { adminRoutes } from "../../routes/routes";
import mainContent from "../../utils/mainContent";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const menu = adminRoutes;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-200 bg-white
          px-3 py-4 text-slate-600 shadow-sm
          transition-all duration-300 md:static
          ${isCollapsed ? "w-20" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div
          className={`mb-8 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* Logo */}
          {!isCollapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <img
                  src={mainContent.applogo}
                  alt="Application Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-base font-bold text-transparent">
                  Admin Panel
                </h2>
                <p className="truncate text-[11px] text-slate-400">
                  Management Portal
                </p>
              </div>
            </div>
          )}

          {/* Desktop Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              hidden rounded-lg border border-slate-200 bg-white p-2
              text-slate-500 shadow-sm transition-all
              hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600
              md:flex
              ${isCollapsed ? "mx-auto" : ""}
            `}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
          {menu.map((section, sectionIndex) => (
            <div key={section.section || sectionIndex}>
              {/* Section Title */}
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.section}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <NavLink
                    key={item.path || itemIndex}
                    to={`/admin/${item.path}`}
                    end
                    title={isCollapsed ? item.name : undefined}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `
                        group flex items-center rounded-xl px-3 py-3
                        transition-all duration-200
                        ${isCollapsed ? "justify-center" : "gap-3"}
                        ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-200"
                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={19}
                          strokeWidth={isActive ? 2.4 : 2}
                          className="shrink-0"
                        />

                        {!isCollapsed && (
                          <span className="truncate text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Section Divider */}
              {!isCollapsed && sectionIndex !== menu.length - 1 && (
                <div className="mx-3 mt-5 border-b border-slate-100" />
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-600">
              Admin Dashboard
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Manage your platform easily
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
