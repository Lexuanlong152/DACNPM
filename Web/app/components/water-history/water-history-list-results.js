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

const WaterHistoryListResults = ({ waterHistorys }) => {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Card>
            <PerfectScrollbar>
                <Box sx={{ minWidth: 1050 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thời gian bắt đầu</TableCell>
                                <TableCell>Thời gian kết thúc</TableCell>
                                <TableCell>Hình thức</TableCell>
                                <TableCell>Người tưới</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {waterHistorys
                                .slice(limit * page, limit * page + limit)
                                .map((waterHistory, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        // selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                                    >
                                        <TableCell>
                                            {waterHistory.startTime.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {waterHistory.endTime.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {waterHistory.auto
                                                ? 'Tự động'
                                                : ' Thủ công'}
                                        </TableCell>
                                        <TableCell>
                                            {waterHistory.auto
                                                ? 'Hệ thống'
                                                : waterHistory.user}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={waterHistorys.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

WaterHistoryListResults.propTypes = {
    waterHistorys: PropTypes.array.isRequired,
};


export default WaterHistoryListResults;