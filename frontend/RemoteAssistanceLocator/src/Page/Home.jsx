import {useEffect, useState} from "react";
import "../CSS/Home.css";
import dayjs from 'dayjs';
import Card from "../Component/Card.jsx";
import PopUp from "../Component/PopUp.jsx";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import checkLogin from "../functions/checkLogin.js";
import {useNavigate} from "react-router-dom";
import fetchData from "../functions/fetchdata.js";

function Home() {
    const [search, setSearch] = useState("");
    const [service, setService] = useState("");
    const [time, changeTime] = useState(dayjs('2024-06-30T10:30'));
    const [status, setStatus] = useState(false);
    const navigat = useNavigate();
    const [services, changeServices] = useState(null);
    const [position, setPosition] = useState({latitude: null, longitude: null});

    function changeStatus() {
        setStatus(!status);
    }

    const RequestService = async () => {
        let headersList = {
            "Accept": "*/*",
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

        // let headersList = {
        //     "Accept": "*/*",
        //     "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        //     "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODAwODU2NjIwZmI1OWZmMTdkMTM5MSIsImVtYWlsIjoiY2hpbnRhbkBnbWFpbC5jb20iLCJpYXQiOjE3MTk2NjgyNzcsImV4cCI6MTcxOTc1NDY3N30.u9yEI9VizY0VcBSV2QM8Rx6VGQC5hVkmceGuG0gG55c",
        //     "Content-Type": "application/json"
        //    }
           
        //    let bodyContent = JSON.stringify({
        //        "location": {
        //            "latitude": 23.1735296,
        //            "longitude": 72.6499328
        //        },
        //        "date": "2024-06-06T17:10:00.000Z",
        //        "serviceTaken": "667ffe1726e1f1e2d76fde1a"
        //    });
           
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
            "Accept": "*/*",
            "Authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        }

        let response1 = await fetchData("http://localhost:3000/getallservices", headersList, JSON.stringify({}), "POST")
        let response2 = await fetchData("http://localhost:3000/getallservicerequests", headersList, JSON.stringify({}), "POST")
        changeServices(response2.data);

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


    return( services && service.length == 0) ? <div>
        <div className="container">
            <button onClick={changeStatus}>Request Service</button>
            <input type="text" value={search} placeholder={"Search.."} onChange={e => setSearch(e.target.value)}/>
        </div>

        <div className="card-container">
            <h1>Services</h1>

            {
                services.map((item) => {
                    

                    return <Card name={item.serviceTaken} assignee={"Not Assigned"} status={item.status} fees={"50"}/>
                })
            }

           
        </div>

        {
            status ?
                <PopUp hidefunction={changeStatus}>
                    <div className="requestForm">
                        <h2>Request service</h2>
                        <div className="field">
                            <select value={service} onChange={e => setService(e.target.value)}>
                                {
                                    services.map((item) => {
                                        return <option value={item._id} key={item._id}>{item.description}</option>
                                    })
                                }
                            </select>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']}>
                                <DateTimePicker label="Basic date time picker" value={time}
                                                onChange={(newValue) => changeTime(newValue)}/>
                            </DemoContainer>
                        </LocalizationProvider>
                        <div className="location">
                            <button type={"button"} onClick={getLocation}>Set Location</button>
                        </div>

                        <button type={"button"} onClick={RequestService}>Request</button>
                    </div>
                </PopUp> : ""
        }
    </div> : "Loading";
}

export default Home;