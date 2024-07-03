import { useEffect, useState } from "react";
import "../CSS/Home.css";
import dayjs from 'dayjs';
import Card from "../Component/Card.jsx";
import PopUp from "../Component/PopUp.jsx";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import checkLogin from "../functions/checkLogin.js";
import { useNavigate } from "react-router-dom";
import fetchData from "../functions/fetchdata.js";

function Home() {
    const [search, setSearch] = useState("");
    const [service, setService] = useState("");
    const [time, changeTime] = useState(dayjs('2024-06-30T10:30'));
    const [status, setStatus] = useState(false);
    const navigat = useNavigate();
    const [services, changeServices] = useState(null);
    const [position, setPosition] = useState({ latitude: null, longitude: null });

    function changeStatus() {
        setStatus(!status);
    }

    const RequestService = async () => {
        let headersList = {
            "Authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
        let body = {
            "location": {
                "latitude": position.latitude,
                "longitude": position.longitude
            },
            "date": time,
            "serviceTaken": service
        };

        let response = await fetch("http://localhost:3000/requestservice", {
            method: "POST",
            body: JSON.stringify(body),
            headers: headersList
        });

        let data = await response.text();
        console.log(data);

        console.log(response, body);
        setStatus(false);
    }

    const loadData = async () => {
        let headersList = {
            "Authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        }

        let response1 = await fetchData("http://localhost:3000/getallservices", headersList, null, "GET")
        let response2 = await fetchData("http://localhost:3000/getallservicerequests", headersList, null, "GET")
        changeServices(response1.data);

        console.log(response1, response2);
    }

    useEffect(() => {
        if (!checkLogin()) {
            navigat("/login");
        }
        loadData();
    }, []);

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


    return services ? <div>
        <div className="container">
            <button onClick={changeStatus}>Request Service</button>
            <input type="text" value={search} placeholder={"Search.."} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="card-container">
            <h1>Services</h1>

            {
                services.length > 0
                ?
                    services.map((service) => (
                        <Card name={service.serviceName} assignee={service.user} status={service.status} fees={service.price} />
                    ))
                :
                    <div>No services Requested yet!!</div>
            }

        </div>

        {
            status ?
                <PopUp hidefunction={changeStatus}>
                    <div className="requestForm">
                        <h2>Request service</h2>
                        <div className="field">
                            <select onChange={({target})=>
                                 setService(target.value)
                            }>
                                {
                                    services.map((service) => (
                                        <option value={service._id}>{service.serviceName}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']}>
                                <DateTimePicker label="Basic date time picker" value={time}
                                    onChange={(newValue) => changeTime(newValue)} />
                            </DemoContainer>
                        </LocalizationProvider>
                        <div className="location">
                            <button type={"button"} onClick={getLocation}>Set Location</button>
                        </div>

                        <button type={"button"} onClick={RequestService}>Request</button>
                    </div>
                </PopUp> : ""
        }
    </div> : <div>Loading...</div>

}

export default Home;