import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox,
    Button,
} from '@mui/material';

const StaffListResults = ({ employees, onSelect }) => {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    let i = 1;
    return (
        <Card>
            <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Địa chỉ email</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Quản trị</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees
                                .slice(0, limit)
                                .map((employee, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        // selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                                    >
                                        <TableCell>{i++}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            {employee.date.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={employee.isManager}
                                                onChange={(event) => {}}
                                                value={employee.isManager}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    onSelect(index);
                                                }}
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={employees.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

StaffListResults.propTypes = {
    employees: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
};


export default StaffListResults;