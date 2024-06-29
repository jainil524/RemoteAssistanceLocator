import { useState } from "react";
import '../CSS/SignUp.css';
import Field from "../Component/Field";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });
    const [role, setRole] = useState("role");
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

        if (!firstName) {
            newErrors.firstName = "First name is required.";
            isValid = false;
        }

        if (!lastName) {
            newErrors.lastName = "Last name is required.";
            isValid = false;
        }

        if (!email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (password.value.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
            isValid = false;
        }

        if (role === "role") {
            newErrors.role = "Role selection is required.";
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
                    <h2>Sign Up</h2>
                    <Field
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        error={errors.firstName}
                    />
                    <Field
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        error={errors.lastName}
                    />
                    <Field
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        placeholder="Email address"
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
                    <div className="Field">
                        <label>Role <sup>*</sup></label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="role">Role</option>
                            <option value="individual">Individual</option>
                            <option value="business">Business</option>
                        </select>
                        {errors.role && <p className="error">{errors.role}</p>}
                    </div>
                    <button type="submit">
                        Register
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

