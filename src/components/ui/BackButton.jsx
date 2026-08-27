import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = ({ title = "Back" }) => {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "16px",
                color: "#fff",
                "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                },
            }}
        >
            {title}
        </Button>
    );
};

export default BackButton;
