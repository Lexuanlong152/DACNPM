import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container } from '@mui/material';

import WaterHistoryListResults from '../../components/water-history/water-history-list-results';
import WaterHistoryToolbar from '../../components/water-history/water-history-toolbar';
import DashboardLayout from '../../components/dashboard-layout';
import AppContext from '../../context/app-context';
import LocationController from '../../controller/location-controller';

const WaterHistory = () => {
    const isUnmounted = useRef(false);
    const [records, setRecords] = useState([]);
    const [start, setStart] = useState(Date.now() - 31536000000);
    const [end, setEnd] = useState(Date.now());

    const { area, setArea, areas, setAreas } = useContext(AppContext);

    useEffect(() => {
        return () => {
            isUnmounted.current = true;
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (areas.length > 0) {
                var data =
                    await LocationController.getInstance().getPumpRecords(
                        areas[area],
                    );
                if (isUnmounted.current) return;
                setRecords(data);
            }
        })();
    }, [area, areas]);
    return (
        <>
            <Head>
                <title>Water History | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <WaterHistoryToolbar
                        start={start}
                        end={end}
                        onChange={(start, end) => {
                            setStart(start);
                            setEnd(end);
                        }}
                    />
                    <Box sx={{ mt: 3 }}>
                        <WaterHistoryListResults
                            waterHistorys={records.filter((e) => {
                                return (
                                    e.startTime.getTime() <= end &&
                                    e.startTime.getTime() >= start
                                );
                            })}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

WaterHistory.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WaterHistory;
