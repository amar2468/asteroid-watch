// Import MUI's LocalizationProvider to set up date handling
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Import the MUI DatePicker component
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Adapter for using dayjs with the MUI DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Import dayjs to handle date objects and formatting
import dayjs from 'dayjs';

// Import Box for layout/styling from MUI
import Box from '@mui/material/Box';

// React hook for managing component state
import { useState } from 'react';

// Importing Button from MUI
import Button from '@mui/material/Button';

import axios from 'axios';

import CustomTable from '../components/CustomTable';
import Typography from '@mui/material/Typography';

// Home page definition
const Home = () => {
    // Holds the selected start date as a dayjs object for the DatePicker
    const [selectedStartDate, setSelectedStartDate] = useState(dayjs()); // for DatePicker

    // Holds the selected end date as a dayjs object for the DatePicker
    const [selectedEndDate, setSelectedEndDate] = useState(dayjs()); // for DatePicker

    // Holds the start date formatted as a string (for API requests)
    const [formattedStartDate, setStartFormattedDate] = useState(dayjs().format('YYYY-MM-DD')); // for backend

    // Holds the end date formatted as a string (for API requests)
    const [formattedEndDate, setEndFormattedDate] = useState(dayjs().format('YYYY-MM-DD')); // for backend

    const [retrievedNeoData, setRetrievedNeoData] = useState(null);

    // Updates both the selected dayjs object and its formatted string version
    const changeNeoDate = (dateProvided, type) => {
        // If the date entered is the start date, update that date.
        if (type === "start") {
            setSelectedStartDate(dateProvided);
            setStartFormattedDate(dateProvided.format('YYYY-MM-DD'));
        }

        // If the date entered is the end date, update that date.
        else if (type === "end") {
            setSelectedEndDate(dateProvided);
            setEndFormattedDate(dateProvided.format('YYYY-MM-DD'))
        }
    };

    // Make a POST API request to the backend, passing the start and end date as the arguments.
    const searchForNeos = async () => {
        const requestNeoData = await axios.post("http://localhost:4000/api/asteroids",
            { startDate: formattedStartDate, endDate: formattedEndDate}
        );

        // If the data was successfully retrieved from the API, we will updat the state variable with the new information.
        if (requestNeoData.status === 200) {
            setRetrievedNeoData(requestNeoData.data.data);
        }
    };

    return (
        <div>
            <Box display="flex" flexDirection="column" width="30%" sx={{ mt:15, mx: "auto" }}>
                {/* Set up the localization context so DatePicker uses dayjs */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Start Date"

                        value={selectedStartDate}

                        onChange={(newDate) => changeNeoDate(newDate, "start")}

                        sx={{ mb: 5 }}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select End Date"

                        value={selectedEndDate}

                        onChange={(newDate) => changeNeoDate(newDate, "end")}
                    />
                </LocalizationProvider>

                <Button
                    variant="contained"

                    size="large"

                    color="primary"

                    sx={{ mt: 5, mb: 5 }}

                    onClick={searchForNeos}
                >
                    Search
                </Button>
            </Box>

            {retrievedNeoData && (
                <>
                    <div>
                        <Box display="flex" alignContent="center" flexDirection="column" sx={{ mx: "auto", mb: 5 }}>
                            <Typography 
                                align="center"

                                variant="h6"
                            >
                                Number of Near-Earth Objects: {retrievedNeoData.element_count}
                            </Typography>
                        </Box>

                        <Box display="flex" alignContent="center" width="80%" flexDirection="column" sx={{ mx: "auto" }}>
                            <CustomTable
                                retrievedNeoData={ retrievedNeoData.near_earth_objects }
                                numberOfNeos={ retrievedNeoData.element_count }
                            />
                        </Box>
                        
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;