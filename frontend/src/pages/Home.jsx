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

// Import axios for making HTTP requests
import axios from 'axios';

// Custom table component for displaying NEO data
import CustomTable from '../components/CustomTable';
import Typography from '@mui/material/Typography';

// Spinner component to indicate loading state
import CircularProgress from '@mui/material/CircularProgress';

// Component for displaying error alerts
import Alert from '@mui/material/Alert';

// Divider component for separating UI sections
import Divider from '@mui/material/Divider';

// Chart component for NEO count by date
import NeoCountByDateChart from '../components/NeosPerDay';

// Chart component for hazardous NEO proportions
import HazardNeosPieChart from '../components/HazardNeosPieChart';

// Chart showing top largest asteroids
import TopLargestAsteroidsChart from '../components/LargestAsteroids';

// Chart showing top fastest asteroids
import TopFastestAsteroidsChart from '../components/FastestAsteroids';

// Footer component for the page
import Footer from '../components/Footer';

// MUI icons used in the UI
import PublicIcon from '@mui/icons-material/Public';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';

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

            // If the data was successfully retrieved from the API, we will update the state variable with the new information.
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
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <Box textAlign="center" sx={{ mt: 2 }}>
                    <PublicIcon fontSize="large" />
                </Box>

                <Typography variant="h3" align="center" color="#0057AD;" sx={{ mt: 2, mb: 1 }}>
                    AsteroidWatch
                </Typography>

                <Typography variant="h6" align="center" sx={{ mt: 2, mb: 2 }}>
                    Near-Earth Object Tracker
                </Typography>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={4}
                    sx={{ mt: 2, mb: 2 }}
                >
                    <Box display="flex" alignItems="center">
                        <VisibilityIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">Real-time Monitoring</Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <ScienceIcon sx={{ mr: 1 }} />
                        <Typography variant="subtitle1">NASA Data</Typography>
                    </Box>
                </Box>

                {errorAlert}

                <Box display="flex" flexDirection="column" width="30%" sx={{ mt:10, mx: "auto", mb: 5 }}>

                <Box
                    display="flex"
                    flexDirection="column"
                    width="80%"
                    sx={{ mx: "auto" }}
                >

                    {/* Start Date */}
                    <Box sx={{ mb: 5 }}>
                        <Typography display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <CalendarMonthIcon sx={{ mr: 1 }} />
                            Start Date
                        </Typography>
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={selectedStartDate}
                                onChange={(newDate) => changeNeoDate(newDate, "start")}
                                disabled={loading}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>

                    {/* End Date */}
                    <Box sx={{ mb: 5 }}>
                        <Typography display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <CalendarMonthIcon sx={{ mr: 1 }} />
                            End Date
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={selectedEndDate}
                                onChange={(newDate) => changeNeoDate(newDate, "end")}
                                disabled={loading}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>

                    <Button
                        variant="contained"

                        size="large"

                        color="primary"

                        sx={{ mt: 5, mb: 5, borderRadius: "25px" }}

                        onClick={searchForNeos}

                        disabled={loading}
                    >
                        <Box display="flex" alignItems="center">
                            <SearchIcon sx={{ mr: 1 }} />
                            <Typography>Search</Typography>
                        </Box>
                    </Button>
                </Box>

                <Divider />

                {/* If the loading state variable is set to true, we will display the loading icon */}
                {loading && (
                    <div>
                        <Box display="flex" alignItems="center" flexDirection="column" sx={{ mx: "auto", mb: 5, mt: 5 }}>
                            <CircularProgress />
                        </Box>
                    </div>
                )}

                {/* If Near-Earth object data was present when the API call was made, we will display it in the table  */}
                {retrievedNeoData && (
                    <>
                        <div>
                            <Box display="flex" alignContent="center" flexDirection="column" width="80%" sx={{ mx: "auto", mb: 5, mt: 5 }}>
                                <div class="header">
                                    <h1>Dashboard Overview</h1>
                                    <p>Number of Near-Earth Objects: {retrievedNeoData.element_count}</p>
                                </div>
                            </Box>

                            <Box display="flex" alignContent="center" width="80%" flexDirection="column" sx={{ mx: "auto" }}>
                                <div class="table-section">
                                    <div class="section-title">Near-Earth Objects - Data</div>
                                    <CustomTable
                                        retrievedNeoData={ retrievedNeoData.near_earth_objects }
                                        numberOfNeos={ retrievedNeoData.element_count }
                                        loading={ loading }
                                    />
                                </div>

                                <div class="number-of-neos-chart-section">
                                    <div class="number-of-neos-chart-title">Number of Near-Earth Objects Per Day</div>

                                    <NeoCountByDateChart rawNeoData={retrievedNeoData.near_earth_objects} />
                                </div>

                                <div class="hazardous-neos-chart-section">
                                    <div class="hazardous-neos-chart-title">Hazardous/Non-Hazardous Near-Earth Objects</div>

                                    <HazardNeosPieChart rawNeoData={retrievedNeoData.near_earth_objects} />
                                </div>

                                <div class="largest-asteroids-chart-section">
                                    <div class="largest-asteroids-chart-title">Largest Asteroids</div>

                                    <TopLargestAsteroidsChart rawNeoData={retrievedNeoData.near_earth_objects} />
                                </div>

                                <div class="fastest-asteroids-chart-section">
                                    <div class="fastest-asteroids-chart-title">Fastest Asteroids</div>

                                    <TopFastestAsteroidsChart rawNeoData={retrievedNeoData.near_earth_objects} />
                                </div>
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

                <Footer />
            </Box>
        </div>
    );
};

export default Home;