import {useState} from "react";
import '../CSS/SignUp.css';
import Field from "../Component/Field";
import {useNavigate} from "react-router-dom";
import fetchData from "../functions/fetchdata.js";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [role, setRole] = useState("role");

    const [errors, setErrors] = useState({
        firstName: "",
        email: "",
        password: "",
        role: "",
        phone: ""
    });
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const newErrors = {firstName: "", lastName: "", email: "", password: "", role: ""};

        if (!name) {
            newErrors.firstName = "First name is required.";
            isValid = false;
        }

        if (!email.includes('@')) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
            isValid = false;
        }
        if (phone.length < 8) {
            newErrors.phone = "Please enter a valid phone number.";
            isValid = false;
        }

        if (role === "role") {
            newErrors.role = "Role selection is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(position.latitude);
        if (validateForm()) {
            let headersList = {
                "Accept": "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "name": name,
                "email": email,
                "phone": phone,
                "password": password,
                "role": role,
                "location": {
                    "type": "Point",
                    "coordinates": [position.latitude, position.longitude]
                }
            });

            let data = await fetchData("http://localhost:3000/register", headersList, bodyContent, "POST");

            if (data.status == "success") {
                console.log(data.status)
                navigate("/login");
            }
        }
    };

    function getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }


    return (
        <div className="signup">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <h2>Sign Up</h2>
                    <Field
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="firstName"
                        type="text"
                        placeholder="Name"
                        error={errors.firstName}
                    />
                    <Field label={"Phone"} name={"Phone"} value={phone} placeholder={"Phone number"}
                           error={errors.phone} onChange={(e) => setPhone(e.target.value)}/>
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
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        placeholder="Password"
                        label="Password"
                        error={errors.password}
                    />


                    <div className="Field">
                        <label>Role <sup>*</sup></label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="role">Role</option>
                            <option value="consumer">User</option>
                            <option value="provider">Business</option>
                        </select>
                        {errors.role && <p className="error">{errors.role}</p>}
                    </div>

                    <div className="location">
                        <button type={"button"} onClick={getLocation}>Set Location</button>
                    </div>

                    <button type="submit">Register</button>
                </fieldset>
            </form>
        </div>
    );
}

