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
} from '@mui/material';

const types = ['Nhiệt độ', 'Độ ẩm không khí'];

const units = ['\u00B0C', 'g/m\u00B3'];

const StatsListResults = ({ stats, type }) => {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };
    var count = 1;
    return (
        <Card>
            <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Ngày đo</TableCell>
                                <TableCell>Giờ đo</TableCell>
                                <TableCell>{types[type]}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats
                                .slice(limit * page, limit * page + limit)
                                .map((stat, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        // selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                                    >
                                        <TableCell>{count++}</TableCell>
                                        <TableCell>
                                            {new Date(stat.collectedTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(stat.collectedTime).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {stat.value + ' ' + units[type]}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={stats.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

StatsListResults.propTypes = {
    stats: PropTypes.array.isRequired,
    type: PropTypes.number.isRequired,
};


export default StatsListResults;