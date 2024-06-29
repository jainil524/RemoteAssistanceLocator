import Login from "./Page/Login";
import SignUp from "./Page/SignUp";
import Profile from "./Page/Profile";
import Home from "./Page/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Services from "./Page/Services.jsx";
import Layout from "./Component/Layout.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="service" element={<Services />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
