"use client";
import React, { useState } from "react";
import Button from '@mui/material/Button'
import { Avatar, Backdrop, Box, Checkbox, CircularProgress, Container, CssBaseline, FormControlLabel, Grid, IconButton, InputAdornment, Link, TextField, Theme, ThemeProvider, Typography, createTheme, outlinedInputClasses } from "@mui/material";
import { Copyright } from "@mui/icons-material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signIn, useSession } from "next-auth/react";
// import axios from "axios"
import { frame1 } from "@/assets/images";
import CustomTextBox from "@/app/components/InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { API, instance } from "@/app/lib/axios"
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const page = () => {
    const [email, setEmail] = useState<string | null>("")
    const [password, setPassword] = useState<string | null>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault();
        try {
            const response = await API.post("/api/user/signin", { email: email, password: password });
            console.log(response);
            setEmail("");
            setPassword("");
            router.push("/");
            setLoading(false)
            toast.success(response.data?.message ?? "Login success");
        } catch (error: any) {
            setEmail("");
            setPassword("");
            console.log(error);
            setLoading(false)
            toast.error(error?.response?.data?.error ?? "Login failed");
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: "center",
                maxWidth: "100%",
                height: "100vh",
                backgroundImage: `url(${frame1.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: "24px",
                    padding: "24px",
                    maxWidth: "400px",
                    background: "rgb(74 168 255 / 12%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(7.1px)",
                    border: "3px solid rgb(151 180 207 / 24%)"
                }}
            >
                {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar> */}
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username or Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    {isPasswordVisible ?
                                        <VisibilityIcon sx={{
                                            color: "whitesmoke",
                                        }} />
                                        :
                                        <VisibilityOffIcon sx={{
                                            color: "whitesmoke",
                                        }} />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2, color: "#121212" }}
                        fullWidth
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default page;
