import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../../redux/slices/snackbarSlice";

const GlobalSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector(
        (state) => state.snackbar
    );

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => dispatch(hideSnackbar())}
        >
            <Alert
                variant="filled"
                severity={severity}
                onClose={() => dispatch(hideSnackbar())}
                sx={{
                    color: "#fff", // 👈 text white
                    "& .MuiAlert-icon": {
                        color: "#fff", // 👈 icon white
                    },
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;
