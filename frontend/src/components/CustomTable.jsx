import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'diameter', label: 'Diameter (km)', minWidth: 100 },
  { id: 'hazardous', label: 'Hazardous', minWidth: 100 },
  { id: 'approachDate', label: 'Approach Date', minWidth: 100 },
  { id: 'velocity', label: 'Velocity (km/h)', minWidth: 100 },
  { id: 'miss_distance', label: 'Miss Distance (km)', minWidth: 100 },
  { id: 'orbit_body', label: 'Orbit', minWidth: 100 },
];

const CustomTable = ({ retrievedNeoData, numberOfNeos, loading }) => {
    function createData(id, name, diameter, hazardous, approachDate, velocity, miss_distance, orbit_body) {
        return { id, name, diameter, hazardous, approachDate, velocity, miss_distance, orbit_body };
    }

    const [searchTerm, setSearchTerm] = React.useState("");

    const rows = Object.values(retrievedNeoData)
        .flat() // Makes it a single array
        .map((neoRow) => 
            createData(
                neoRow.id,
                neoRow.name,
                (neoRow.estimated_diameter.kilometers.estimated_diameter_min).toFixed(2) + " - " + (neoRow.estimated_diameter.kilometers.estimated_diameter_max).toFixed(2),
                neoRow.is_potentially_hazardous_asteroid ? "Yes" : "No",
                neoRow.close_approach_data[0].close_approach_date_full,
                parseFloat(neoRow.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(3),
                parseFloat(neoRow.close_approach_data[0].miss_distance.kilometers).toFixed(3),
                neoRow.close_approach_data[0].orbiting_body,
            )
        );
    
    const allRows = rows.filter((row) => 
        Object.values(row).some((value) => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    
    

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <TextField
                label="Search"

                variant="outlined"

                margin="normal"

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                disabled={loading}

                sx={{ '& .MuiOutlinedInput-root': {
                    borderRadius: "25px",
                }, }}

                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>
                    ),
                    },
                }}
            />

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead >
                    <TableRow>
                        {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: "#f7f7f7" }}
                        >
                            {column.label}
                        </TableCell>
                        ))}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {allRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                            {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                                );
                            })}
                            </TableRow>
                        );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>

                <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={numberOfNeos}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

export default CustomTable;