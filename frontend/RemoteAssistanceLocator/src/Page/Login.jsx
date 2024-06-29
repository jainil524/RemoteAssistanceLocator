import { useState } from "react";
import '../CSS/SignUp.css';
import Field from "../Component/Field";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });
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

        if (password.value.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            alert("Account created!");
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
                        onChange={(e) => setPassword({ ...password, value: e.target.value })}
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

