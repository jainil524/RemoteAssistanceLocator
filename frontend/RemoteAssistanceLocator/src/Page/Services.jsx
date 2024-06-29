import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../CSS/Services.css";
import PopUp from "../Component/PopUp.jsx";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo/index.js";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {useState} from "react";
import dayjs from "dayjs";

function Services() {
    const [status, setStatus] = useState(false);
    const [startTime, changeStartTime] = useState(dayjs());
    const [endTime, changeEndTime] = useState(dayjs());

    function createData(name, calories, fat, carbs, protein) {
        return {name, calories, fat, carbs, protein};
    }

    const rows = [
        createData('Frozen yoghurt', 15121212212129, 6.121212120, 12121224, 4.1212120),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    function changeStatus() {
        setStatus(!status);
    }

    function acceptService() {

    }

    return (
        <>
            <div className="service-container">
                <div className="service-container-header">
                    <h1>Requested Services</h1>
                    <input type="text" placeholder="Search ..."/>
                </div>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead style={{backgroundColor: '#ddd'}}>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bold'}}>Service Name</TableCell>
                                <TableCell align="center" style={{fontWeight: 'bold'}}>Location</TableCell>
                                <TableCell align="center" style={{fontWeight: 'bold'}}>Time</TableCell>
                                <TableCell align="center" style={{fontWeight: 'bold'}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th">{row.name}</TableCell>
                                    <TableCell align="center">{row.calories}</TableCell>
                                    <TableCell align="center">{row.calories}</TableCell>
                                    <TableCell align="center">
                                        <button onClick={changeStatus}>Accept</button>
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
                                                        onChange={(newValue) => changeStartTime(newValue)}/>
                                    </DemoContainer>
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker label="End Time" value={endTime}
                                                        onChange={(newValue) => changeEndTime(newValue)}/>
                                    </DemoContainer>
                                </LocalizationProvider>

                                <button type={"button"} onClick={acceptService}>Request</button>
                            </div>
                        </PopUp>
                        : ""
                }

            </div>
        </>
    );

}

export default Services;