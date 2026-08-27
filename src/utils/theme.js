import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#00d0fc", // teal
            light: "#4ddcff",
            dark: "#00a8cc",
            contrastText: "#ffffff",
        },

        secondary: {
            main: "#ef4444", // red
        },

        background: {
            default: "#ffffff",
            paper: "#f8fafc",
        },

        text: {
            primary: "#0f172a",
            secondary: "#64748b",
        },

        divider: "rgba(0, 208, 252, 0.15)",
    },

    shape: {
        borderRadius: 12,
    },

    typography: {
        fontFamily: "HelveticaCustom",
        h1: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
        },
        h2: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: "none",
        },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `
            radial-gradient(circle at 20% 20%, rgba(0,208,252,0.08), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(239,68,68,0.06), transparent 40%),
            #ffffff
          `,
                },

                input: {
                    "&:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px #f8fafc inset !important",
                        WebkitTextFillColor: "#0f172a !important",
                    },
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontWeight: 600,
                },

                containedPrimary: {
                    background: "linear-gradient(to right, #00d0fc, #00a8cc)",
                    boxShadow: "0 0 20px rgba(0,208,252,0.25)",
                },

                outlinedPrimary: {
                    borderColor: "#00d0fc",
                    color: "#00a8cc",
                    "&:hover": {
                        background: "rgba(0,208,252,0.08)",
                        borderColor: "#4ddcff",
                    },
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0,208,252,0.2)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(0,208,252,0.2)",
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: "#ffffff",
                    borderRadius: 10,
                    "& fieldset": {
                        borderColor: "rgba(0,208,252,0.25)",
                    },
                    "&:hover fieldset": {
                        borderColor: "#00d0fc",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#00a8cc",
                    },
                },
                input: {
                    color: "#0f172a",
                },
            },
        },
    },
});

export default lightTheme;