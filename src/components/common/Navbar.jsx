import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const sections = ["home", "plan", "ecosystem", "how it works", "about"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // 🔥 Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      let current = "ecosystem";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;

          if (window.scrollY >= top - 200) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Scroll function
  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // 🔥 Active style
  const navClass = (id) =>
    `cursor-pointer px-4 py-1 rounded-full transition ${active === id
      ? "bg-white/20 text-white"
      : "text-white/80 hover:text-white"
    }`;

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center mt-4">
      <div className="flex items-center justify-between w-[90%] max-w-6xl px-6 py-3 rounded-full 
      bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">

        {/* Logo */}
        <h1 className="text-white font-semibold text-lg">Tradegain</h1>

        {/* <div className="rounded-full">
          <img src={mainContent.applogo} className="md:w-32 w-28 p-1 scale-150 " alt="" />
        </div> */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {sections.map((id) => (
            <span
              key={id}
              onClick={() => handleScrollTo(id)}
              className={navClass(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth/login" className="text-white/80 text-sm cursor-pointer">Log In</Link>
          <Link to="/auth/register" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium">
            Register
          </Link>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden text-white">
          {open ? (
            <X size={24} onClick={() => setOpen(false)} />
          ) : (
            <Menu size={24} onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-20 w-[90%] max-w-6xl text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex flex-col gap-4 text-white">

          {sections.map((id) => (
            <span
              key={id}
              onClick={() => handleScrollTo(id)}
              className={navClass(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
            
          ))}
          <a href="https://docs.liberland.org/blockchain/white-paper"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white px-4 py-1 rounded-full transition"
          >
            White Paper
          </a>

          <hr className="border-white/20" />

          <Link to="/auth/login" className="text-white/80 text-sm cursor-pointer">Log In</Link>
          <Link to="/auth/login" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium">
            Buy LLD Coin
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;