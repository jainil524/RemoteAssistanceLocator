import {useState} from "react";
import "../CSS/Home.css";
import dayjs from 'dayjs';
import Card from "../Component/Card.jsx";
import PopUp from "../Component/PopUp.jsx";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

function Home() {
    const [search, setSearch] = useState("");
    const [service, setService] = useState("");
    const [time, changeTime] = useState(dayjs('2024-06-30T10:30'));
    const [status, setStatus] = useState(false);

    function changeStatus() {
        setStatus(!status);
    }

    function RequestService() {

    }

    return <div>
        <div className="container">
            <button onClick={changeStatus}>Request Service</button>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>

        <div className="card-container">
            <h1>Services</h1>

            <Card name={"Service Name"} assignee={"Not Assigned"} status={"Requested"} fees={"50"}/>
        </div>

        {
            status ?
                <PopUp hidefunction={changeStatus}>
                    <div className="requestForm">
                        <h2>Request service</h2>
                        <div className="field">
                            <select value={service} onChange={e => setService(e.target.value)}>
                                <option>Service 1</option>
                                <option>Service 2</option>
                                <option>Service 3</option>
                                <option>Service 4</option>
                            </select>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']}>
                                <DateTimePicker label="Basic date time picker" value={time}
                                                onChange={(newValue) => changeTime(newValue)}/>
                            </DemoContainer>
                        </LocalizationProvider>

                        <button type={"button"} onClick={RequestService}>Request</button>
                    </div>
                </PopUp> : ""
        }
    </div>;
}

export default Home;