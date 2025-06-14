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

// Home page definition
const Home = () => {
    // Holds the selected date as a dayjs object for the DatePicker
    const [selectedDate, setSelectedDate] = useState(dayjs()); // for DatePicker

    // Holds the same date formatted as a string (for API requests)
    const [formattedDate, setFormattedDate] = useState(dayjs().format('YYYY-MM-DD')); // for backend

    // Updates both the selected dayjs object and its formatted string version
    const changeNeoDate = (dateProvided) => {
        setSelectedDate(dateProvided);
        setFormattedDate(dateProvided.format('YYYY-MM-DD'));
    };

    console.log(formattedDate);

    return (
        // MUI Box component for layout — centers the DatePicker on the page
        <Box display="flex" flexDirection="column" width="30%" sx={{ mt:15, mx: "auto" }}>
            {/* Set up the localization context so DatePicker uses dayjs */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Select Date"

                    value={selectedDate}

                    onChange={changeNeoDate}
                />
            </LocalizationProvider>
        </Box>
    );
};

export default Home;