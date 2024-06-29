import { useState } from "react";
import '../CSS/SignUp.css';
import Field from "../Component/Field";
import fetchData from "../functions/fetchdata.js";
import {useNavigate} from "react-router-dom";

export default function SignUp() {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: ""
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { firstName: "", lastName: "", email: "", password: "", role: "" };

        if (!email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let headersList = {
                "Accept": "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "email": email,
                "password": password
            });
            let data = await fetchData("http://localhost:3000/login",headersList, bodyContent,"POST");
            if (data.status === "success") {
                navigate("/home");
            }
        }
    };

    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <h2>Login</h2>
                    <Field
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        placeholder="Email"
                        error={errors.email}
                    />
                    <Field
                        value={password.value}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        placeholder="Password"
                        label="Password"
                        error={errors.password}
                    />
                    <button type="submit">Login</button>
                </fieldset>
            </form>
        </div>
    );
}

