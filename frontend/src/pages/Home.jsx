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

import CircularProgress from '@mui/material/CircularProgress';

import Alert from '@mui/material/Alert';

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

    const [retrievedNeoData, setRetrievedNeoData] = useState();

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // Updates both the selected dayjs object and its formatted string version
    const changeNeoDate = (dateProvided, type) => {
        // If the date entered is the start date, update that date.
        if (type === "start") {
            try {
                setSelectedStartDate(dateProvided);
                setStartFormattedDate(dateProvided.format('YYYY-MM-DD'));
            }

            // If an invalid date was given, this error message will be displayed.
            catch (error) {
                setErrorMessage("Invalid date given. Please provide a valid date.");

                // Returning the current date in the field, to displace the invalid date.
                setSelectedStartDate(dayjs());

                return;
            }
        }

        // If the date entered is the end date, update that date.
        else if (type === "end") {
            try {
                setSelectedEndDate(dateProvided);
                setEndFormattedDate(dateProvided.format('YYYY-MM-DD'))
            }

            catch {
                setErrorMessage("Invalid date given. Please provide a valid date.");

                // Returning the current date in the field, to displace the invalid date.
                setSelectedEndDate(dayjs());

                return;
            }
        }
    };

    // Make a POST API request to the backend, passing the start and end date as the arguments.
    const searchForNeos = async () => {
        setErrorMessage("");

        // If the end date is before the start date, don't submit the API request
        if (dayjs(formattedEndDate).isBefore(formattedStartDate)) {
            setErrorMessage("The end date must be after the start date.");
            return;
        }

        setLoading(true);

        try {
            const requestNeoData = await axios.post("http://localhost:4000/api/asteroids",
                { startDate: formattedStartDate, endDate: formattedEndDate}
            );

            // If the data was successfully retrieved from the API, we will updat the state variable with the new information.
            if (requestNeoData.status === 200) {
                setRetrievedNeoData(requestNeoData.data.data);
            }
        }
        // If there was an issue when retrieving the data, such as a 500 status code, we will just set the data value to null.
        // This will mean that a simple message saying "No data available" will be displayed on the page.
        catch (error) {
            
            if (error.response.status === 500) {
                setRetrievedNeoData(null);
            }
        }

        setLoading(false);
    };

    let errorAlert;

    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: '50%', margin: '0 auto', mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    return (
        <div>
            <Typography variant="h4" align="center" sx={{ mt: 2, mb: 4 }}>
                AsteroidWatch: Near-Earth Object Tracker
            </Typography>

            {errorAlert}

            <Box display="flex" flexDirection="column" width="30%" sx={{ mt:15, mx: "auto" }}>

                {/* Set up the localization context so DatePicker uses dayjs */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Start Date"

                        value={selectedStartDate}

                        onChange={(newDate) => changeNeoDate(newDate, "start")}

                        sx={{ mb: 5 }}

                        disabled={loading}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select End Date"

                        value={selectedEndDate}

                        onChange={(newDate) => changeNeoDate(newDate, "end")}

                        disabled={loading}
                    />
                </LocalizationProvider>

                <Button
                    variant="contained"

                    size="large"

                    color="primary"

                    sx={{ mt: 5, mb: 5, borderRadius: "25px" }}

                    onClick={searchForNeos}

                    disabled={loading}
                >
                    Search
                </Button>
            </Box>

            {/* If the loading state variable is set to true, we will display the loading icon */}
            {loading && (
                <div>
                    <Box display="flex" alignItems="center" flexDirection="column" sx={{ mx: "auto", mb: 5 }}>
                        <CircularProgress />
                    </Box>
                </div>
            )}

            {/* If Near-Earth object data was present when the API call was made, we will display it in the table  */}
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
                                loading={ loading }
                            />
                        </Box>
                        
                    </div>
                </>
            )}

            {retrievedNeoData === null &&(
                <div>
                    <Box display="flex" alignContent="center" flexDirection="column" sx={{ mx: "auto", mb: 5 }}>
                        <Typography 
                            align="center"

                            variant="h6"
                        >
                            No data available
                        </Typography>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default Home;