import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container } from '@mui/material';

import StatsListResults from '../../components/stats/stats-list-results';
import StatsToolbar from '../../components/stats/stats-toolbar';
import DashboardLayout from '../../components/dashboard-layout';
import AppContext from '../../context/app-context';
import LocationController from '../../controller/location-controller';

const Stats = () => {
    const isUnmounted = useRef(false);
    const [type, setType] = useState(0);
    const [stats, setStats] = useState(null);
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
                if (type === 0) {
                    var res =
                        await LocationController.getInstance().getTemperatureRecords(
                            areas[area],
                        );
                    if (isUnmounted.current) return;
                    setStats(res);
                } else if (type === 1) {
                    var res =
                        await LocationController.getInstance().getHumidityRecords(
                            areas[area],
                        );
                    setStats(res);
                    if (isUnmounted.current) return;
                    
                } 
            }
        })();
    }, [type, area, areas]);
    return (
        <>
            <Head>
                <title>Stats | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <StatsToolbar
                        type={type}
                        start={start}
                        end={end}
                        onChange={(start, end) => {
                            setStart(start);
                            setEnd(end);
                        }}
                        onTypeChange={(value) => {
                            setType(value);
                        }}
                    />
                    <Box sx={{ mt: 3 }}>
                        <StatsListResults
                            stats={
                                stats
                                    ? stats.filter(start, end).getRecords()
                                    : []
                            }
                            type={type}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

Stats.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stats;
