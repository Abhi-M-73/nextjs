import React from "react";

const ReusableButton = ({
  label,
  onClick,
  icon: Icon,
  disabled = false,
  loading = false,
  className = "",
  variant = "primary",
  type = "button",
}) => {
  const baseClasses =
    "relative overflow-hidden inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-300";

  const variants = {
    primary:
      "w-full py-2 px-4 bg-[var(--btnColor)] hover:bg-[var(--btnHoverColor)] text-black disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
    header:
      "lg:hidden fixed top-[2px] left-0 right-0 z-50 mx-3 rounded-2xl border border-blue-400/20 bg-black/90 supports-[backdrop-filter]:backdrop-blur-2xl py-2",
  };

  return (
    <>
      <style>{`
        /* Shine animation layer */
        .shine-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 120%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.25) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
        }

        .shine-effect:hover::before {
          animation: shineMove 0.9s ease-out forwards;
        }

        @keyframes shineMove {
          0% { left: -120%; }
          100% { left: 120%; }
        }

        /* Spinner */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 9999px;
          animation: spin 0.6s linear infinite;
        }
      `}</style>

      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} shine-effect ${variants[variant]} ${className}`}
      >
        {/* Spinner when loading */}
        {loading ? (
          <div className="spinner"></div>
        ) : (
          Icon && <Icon className="w-5 h-5 text-black" />
        )}

        <span className="text-lg">
          {loading ? "Processing..." : label}
        </span>
      </button>
    </>
  );
};

export default ReusableButton;