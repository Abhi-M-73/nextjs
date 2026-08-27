import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../../redux/slices/authSlice';
import BackButton from '../../components/ui/BackButton';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { adminLogin } from '../../api/admin.api';
import { showSnackbar } from '../../redux/slices/snackbarSlice';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email === "" || formData.password === "") {
            dispatch(showSnackbar({
                message: "All fields are required",
                severity: "error"
            }));
            return
        }
        try {
            const response = await adminLogin(formData);
            if (response.success) {
                dispatch(setUser(response?.data));
                dispatch(setToken(response?.token));
                navigate("/admin/dashboard");
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.message,
                severity: "error"
            }));
        }
       
    }

    return (
        <div
            className="flex justify-center items-start px-4 min-h-screen">
            <div className="w-full max-w-xl space-y-8 py-6">
                <BackButton title="Home" />
                <div className="bg-black/20 backdrop-blur-md rounded-2xl mt-5 p-6 border border-gray-700 shadow-lg space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
                        <p className="text-gray-400 text-sm">
                            Login to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <TextField
                            type="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            size="medium"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            type={showPassword ? "text" : "password"}
                            name="password"
                            label="Password"
                            variant="outlined"
                            size="medium"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff size="small" /> : <Visibility size="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="medium"
                            startIcon={<LoginIcon />}
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
