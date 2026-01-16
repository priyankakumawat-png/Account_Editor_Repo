import {
    Box,
    Flex,
    Text,
    TextField,
    Button,
    Heading,
    Toast,
    Loader,
} from "@vibe/core";
import CompanyLogo from "../../assets/Images/CompanyLogo.png"
import signin from "../../assets/Images/signin.jpg"
import { useNavigate } from "react-router-dom";
import './SignIn.css'
import { useState } from "react";
import axios from "axios";

export default function SignIn() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    
    const [toast, setToast] = useState({
        open: false,
        type: "positive",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 7)
            return "Password must be at least 7 characters";
        if (value.length > 20)
            return "Password must be less than 20 characters";
        return "";
    };



    // console.log("form ", formData);


    const signIn = async () => {
        if (errors.email || errors.password) {
            setToast({
                open: true,
                type: "negative",
                message: "Please fix the errors before submitting"
            });
            return;
        }



        setLoading(true);

        try {
            const res = await axios.post(
                "https://kindra-unsonorous-gale.ngrok-free.dev/api/superadmin/login",
                {
                    email: formData.email,
                    password: formData.password
                },
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        Accept: "application/json",
                    }
                }
            );

            setToast({
                open: true,
                type: "positive",
                message: "Login successful"
            });

            setTimeout(() => {
                // navigate("/");
            }, 1000);

            // localStorage.setItem("UserToken" , res.data.data.token)
          localStorage.setItem("UserToken", res.data.data.token);
navigate("/");

        } catch (error) {
            setToast({
                open: true,
                type: "negative",
                message: error.response?.data?.message || "Login failed",
                 actions: [
        {
          label: "View template",
          onClick: () => console.log("Go to template"),
        },
      ],
            });
        } finally {
            setLoading(false);
        }
    };


    const isFormValid =
        !errors.email &&
        !errors.password &&
        formData.email &&
        formData.password;



    return (
        <Box className="signINCont">
            <Flex className="innsingconti">

                <Box className="form-manage">

                    <Box className="upplef">
                        <Box style={{ width: "120px" }}>
                            <img src={CompanyLogo} alt="" />

                        </Box>

                        <Box>
                            <Flex direction="column" align="start" gap={10}>
                                <Heading type="h3" weight="norboldmal" >Sign In</Heading>
                                <Text>
                                    Enter your email address and password to access admin panel.
                                </Text>
                            </Flex>
                        </Box>

                        <Box>

                            <Flex direction="column" gap="medium" className="full-form-data" >
                                <TextField
                                    className="emailll"
                                    title="Email"
                                    size="large"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    error={errors.email}  
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, email: value }));
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: validateEmail(value)
                                        }));
                                    }}
                                />


                                <TextField
                                    title="Password"
                                    size="large"
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    error={errors.password}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, password: value }));
                                        setErrors((prev) => ({
                                            ...prev,
                                            password: validatePassword(value)
                                        }));
                                    }}
                                />



                                <Button
                                    size="large"
                                    disabled={loading || !isFormValid}
                                    style={{ width: "100%", backgroundColor: "purple" , color:"#ffffff"}}
                                    onClick={signIn}
                                >
                                    {loading ? <Loader size="small"  color="#ffffff"/> : "Sign In"}
                                </Button>





                            </Flex>
                        </Box>
                    </Box>
                </Box>
                <Box className="img-manage">
                    <img src={signin} alt="" className="imgg-c" />
                </Box>
            </Flex>


            <Toast
                open={toast.open}
                type={toast.type}
                onClose={() => setToast({ ...toast, open: false })}
            >
                {toast.message}
            </Toast>

        </Box>
    );
}
