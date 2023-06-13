import { useState, useRef, useEffect, useContext } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Box,
    Card,
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

import DeviceRow from './device-row';
import LocationController from '../../controller/location-controller';
import AppContext from '../../context/app-context';
import IotServer from '../../controller/adafruit-io';

const getDevices = async (location) => {
    if (!location)
        return [];

    const devices = await LocationController.getInstance().getDeviceRecords(location) ?? [];
    return devices.sort((a, b) => {
        if (a.name != b.name)
            return a.name < b.name;
        if (a.type != b.type)
            return a.type < b.type;
        return a.topic < b.topic;
    });
};

const DevicesTable = ({ editable, committing }) => {
    const { area, setArea, areas, setAreas } = useContext(AppContext);
    const location = areas.length === 0 ? null : areas[area];

    const [devices, setDevices] = useState([]);
    const [types, setTypes] = useState([]);
    const [topics, setTopics] = useState([]);
    const isUnmounted = useRef(false);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    useEffect(() => {
        return () => {
            isUnmounted.current = true;
        };
    }, []);

    useEffect(() => {
        if (isUnmounted.current) return;
        getDevices(location).then(devs => setDevices(devs));
        IotServer.getInstance().getTopics().then(tops => setTopics(tops));
        IotServer.getInstance().getDeviceTypes().then(typs => setTypes(typs));
    }, [editable, area, areas]);

    const commitState = useRef(0);
    const incCommitState = () => {
        commitState.current += 1;
    }
    const decCommitState = () => {
        commitState.current -= 1;
        if (commitState.current == 0) {
            getDevices(location).then(devs => setDevices(devs));
        }
    }

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
                    <Table align="center">
                        <TableHead>
                            <TableRow>
                                <TableCell> STT </TableCell>
                                <TableCell> Tên </TableCell>
                                <TableCell> Loại </TableCell>
                                <TableCell> Topic </TableCell>
                                {editable ? (
                                    <TableCell>Điều chỉnh</TableCell>
                                ) : null}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {devices
                                .slice(limit * page, limit * page + limit)
                                .map((device, index) => (
                                    <DeviceRow
                                        key={index}
                                        device={device}
                                        index={index}
                                        editable={editable}
                                        committing={committing}
                                        incCommitState={incCommitState}
                                        decCommitState={decCommitState}
                                        types={types}
                                        topics={topics}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={devices.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Card>
    );
};


export default DevicesTable;