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

const AreaListResults = ({ locations, onClickItem, onEditItem, onDeleteItem }) => {
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
                                <TableCell>Tên khu vực</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Xem chi tiết</TableCell>
                                <TableCell>Điều chỉnh</TableCell>
                                <TableCell>Xóa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations
                                .slice(0, limit)
                                .map((location, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        // selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                                    >
                                        <TableCell>{i++}</TableCell>
                                        <TableCell>{location.name}</TableCell>
                                        <TableCell>
                                            {location.date.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={() => {
                                                    onClickItem(index);
                                                }}
                                            >
                                                Chi tiết
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={() => {
                                                    onEditItem(index);
                                                }}
                                            >
                                                Điều chỉnh
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={() => {
                                                    onDeleteItem(index);
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
                count={locations.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};

AreaListResults.propTypes = {
    locations: PropTypes.array.isRequired,
    onClickItem: PropTypes.func,
    onEditItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
};

export default AreaListResults;