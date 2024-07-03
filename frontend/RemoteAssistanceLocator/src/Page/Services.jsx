import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../CSS/Services.css";
import PopUp from "../Component/PopUp.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function Services() {
    const [status, setStatus] = useState(false);
    const [startTime, changeStartTime] = useState(dayjs());
    const [endTime, changeEndTime] = useState(dayjs());
    const [services, changeServices] = useState(null);
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    useEffect(() => {
        const fetchRequestedServices = async () => {
            let headersList = {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
            let response = await fetch("http://localhost:3000/getallservicerequests",{
                method: "GET",
                headers: headersList
            });
            let data = await response.json();
            console.log(data);
            changeServices(data.data);
        }
        fetchRequestedServices();
    }, []);

    function changeStatus() {
        setStatus(!status);
    }

    function acceptService() {

    }




    return (
        services && services.length > 0
            ?
            <>
                <div className="service-container">
                    <div className="service-container-header">
                        <h1>Requested Services</h1>
                        <input type="text" placeholder="Search ..." />
                    </div>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead style={{ backgroundColor: '#ddd' }}>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Service Name</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Location</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Time</TableCell>
                                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th">{row.serviceTaken}</TableCell>
                                        <TableCell align="center">
                                            <a herf={`https://www.google.com/maps/search/${row.location.coordinates[0] +","+ row.location.coordinates[1]}`}>
                                                {row.location.coordinates[0] +" , "+ row.location.coordinates[1]}
                                            </a>
                                        </TableCell>
                                        <TableCell align="center">{ 
                                            dayjs(row.date).format("DD-MM-YYYY hh:mm A")
                                        }</TableCell>
                                        <TableCell align="center">
                                            <button onClick={changeStatus}>{row.status}</button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        status ?
                            <PopUp hidefunction={changeStatus}>
                                <div className="requestForm">
                                    <h2>Request service</h2>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker label="Start Time" value={startTime}
                                                onChange={(newValue) => changeStartTime(newValue)} />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                            <DateTimePicker label="End Time" value={endTime}
                                                onChange={(newValue) => changeEndTime(newValue)} />
                                        </DemoContainer>
                                    </LocalizationProvider>

                                    <button type={"button"} onClick={acceptService}>Request</button>
                                </div>
                            </PopUp>
                            : ""
                    }

                </div>
            </>
            :
            <div>Loading...</div>
    )


}

export default Services;