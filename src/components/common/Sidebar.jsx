import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { adminRoutes } from "../../routes/routes";
import mainContent from "../../utils/mainContent";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const menu = adminRoutes;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static z-50 top-0 left-0 h-screen 
        ${isCollapsed ? "w-20" : "w-64"} 
        bg-gradient-to-b from-[#071c24] to-[#04141a] 
        text-gray-300 p-4 flex flex-col
        transform transition-all duration-300

        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        <div className="flex items-center justify-between mb-8">

          {/* Logo */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl">
              <img className="h-10" src={mainContent.applogo} alt="" />
            </div>
          )}

          {/* Desktop Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-gray-700"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden"
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {menu.map((section, index) => (
            <div key={index}>

              {/* Section Title */}
              {!isCollapsed && (
                <p className="text-sm text-gray-400 mb-2">
                  {section.section}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <NavLink
                    key={i}
                    to={`/admin/${item.path}`}
                    end
                    className={({ isActive }) =>
                      `flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                      } p-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                        : "hover:bg-[#0f2a33] hover:text-white"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={20} />

                    {!isCollapsed && (
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              {!isCollapsed && index !== menu.length - 1 && (
                <div className="border-b border-gray-700 mt-5"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;