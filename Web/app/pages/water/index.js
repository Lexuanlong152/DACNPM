import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { useState, useRef, useEffect, useContext } from 'react';
import 'firebase/compat/firestore';
import firebase from '../../config/firebase';
import WaterToolbar from '../../components/water/water-toolbar';
import PumpCard from '../../components/water/pump-card';
import DashboardLayout from '../../components/dashboard-layout';
import IotServer from '../../controller/adafruit-io';
import LocationController from '../../controller/location-controller';
import AppContext from '../../context/app-context';
import PumpHistoryRecord from '../../models/pump-history-record';

const Water = () => {
    const { area, setArea, areas, setAreas } = useContext(AppContext);
    const location = areas.length > 0 ? areas[area] : undefined;

    const componentMounted = useRef(false);
    const isUnmounted = useRef(false);
    const [pump, setPump] = useState({});
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    
    useEffect(() => {
        if (location) {
            if (componentMounted.current) return undefined;
            componentMounted.current = true;

            const iotServer = IotServer.getInstance();
            iotServer.subscribePump((record) => {
                if (isUnmounted.current) return;
                setPump(record);
            });

            const locationController = LocationController.getInstance();
            locationController.subscribeTemperature(location, (res) => {
                if (isUnmounted.current) return;
                setTemperature(res ? res.value : null);
            });
            locationController.subscribeHumidity(location, (res) => {
                if (isUnmounted.current) return;
                setHumidity(res ? res.value : null);
            });
        }

        return () => {
            isUnmounted.current = true;
        };
    }, []);

    const togglePump = async () => {
        console.log('send toggle pump: ' + !pump.status);
        var res = await IotServer.getInstance().setPump(!pump.status);
        if (res) {
            var temp = await IotServer.getInstance().getPumpRecord();
            var newObj = Object.assign(
                Object.create(Object.getPrototypeOf(pump)),
                pump,
            );
            newObj.status = !pump.status;
            LocationController.getInstance().addPumpRecord(
                location,
                new PumpHistoryRecord(
                    '',
                    temp.id,
                    false,
                    firebase.firestore.Timestamp.now(),
                    firebase.firestore.Timestamp.now(),
                    '',
                ),
            );
            setPump(newObj);
        }
    };
    return (
        <>
            <Head>
                <title>Water | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <WaterToolbar />
                    <Box sx={{ pt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item key={0} lg={4} md={6} xs={12}>
                                <PumpCard
                                    pump={pump}
                                    temperature={temperature}
                                    humidity={humidity}
                                    togglePump={togglePump}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 3,
                        }}
                    >
                        <Pagination color="primary" count={3} size="small" />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

Water.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Water;
