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
import TableSortLabel from '@mui/material/TableSortLabel';

// Define the columns for the table, each with an ID, label, and minimum width
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

// Reusable table component that receives data and loading state as props
const CustomTable = ({ retrievedNeoData, numberOfNeos, loading }) => {
  // Helper function to structure a row's data
  function createData(id, name, diameter, hazardous, approachDate, velocity, miss_distance, orbit_body) {
    return { id, name, diameter, hazardous, approachDate, velocity, miss_distance, orbit_body };
  }

  const [searchTerm, setSearchTerm] = React.useState("");

  // Flatten and transform the raw data into a structured row format
  const rows = Object.values(retrievedNeoData)
    .flat()
    .map((neoRow) => {
      const velocityNum = parseFloat(neoRow.close_approach_data[0].relative_velocity.kilometers_per_hour);
      const missDistanceNum = parseFloat(neoRow.close_approach_data[0].miss_distance.kilometers);

      return createData(
        neoRow.id,
        neoRow.name,
        (neoRow.estimated_diameter.kilometers.estimated_diameter_min).toFixed(2) + " - " + (neoRow.estimated_diameter.kilometers.estimated_diameter_max).toFixed(2),
        neoRow.is_potentially_hazardous_asteroid ? "Yes" : "No",
        neoRow.close_approach_data[0].close_approach_date_full,
        velocityNum,    // Stored as number for sorting
        missDistanceNum, // Stored as number for sorting
        neoRow.close_approach_data[0].orbiting_body,
      );
    });

  // Filter rows based on the search term
  const allRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Sorting state
  const [orderDirection, setOrderDirection] = React.useState('asc');
  const [valueToOrderBy, setValueToOrderBy] = React.useState('');

  // Toggle sort direction and set active column
  const sortColumn = (property) => {
    const isAsc = valueToOrderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setValueToOrderBy(property);
  };

  // Return a sorted copy of the rows based on the comparator
  const sortDataInColumn = (rows, comparator) => {
    return [...rows].sort(comparator);
  };

  // Return a comparator function depending on the current order and property
  const getComparator = (order, orderBy) => {
    return (a, b) => {
      const aVal = isNaN(Number(a[orderBy])) ? a[orderBy] : Number(a[orderBy]);
      const bVal = isNaN(Number(b[orderBy])) ? b[orderBy] : Number(b[orderBy]);

      if (order === 'desc') {
        return bVal < aVal ? -1 : bVal > aVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    };
  };

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {/* Search input field */}
      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: "25px",
          },
        }}
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

      {/* Table with sticky header and pagination */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sortDirection={valueToOrderBy === column.id ? orderDirection : false}
                    onClick={() => sortColumn(column.id)}
                    style={{ cursor: 'pointer', minWidth: column.minWidth, fontWeight: 'bold', backgroundColor: "#f7f7f7" }}
                  >
                    <TableSortLabel
                      active={valueToOrderBy === column.id}
                      direction={valueToOrderBy === column.id ? orderDirection : 'asc'}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortDataInColumn(allRows, getComparator(orderDirection, valueToOrderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {/* Format numerical values appropriately */}
                            {column.id === 'velocity' && typeof value === 'number'
                              ? value.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
                              : column.id === 'miss_distance' && typeof value === 'number'
                                ? value.toFixed(3)
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

        {/* Pagination controls */}
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