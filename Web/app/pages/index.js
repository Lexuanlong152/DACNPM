import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container, Grid } from '@mui/material';
import axios from 'axios';
import AirHumidity from '../components/dashboard/air-humidity';
import DashboardLayout from '../components/dashboard-layout';
import Temperature from '../components/dashboard/temperature';
import TemperatureRecord from '../models/temperature-record';
import HumidityRecord from '../models/humidity-record';
import AirHumidityCard from '../components/dashboard/air-humidity-card';
import TemperatureCard from '../components/dashboard/temperature-card';
import AreaCard from '../components/dashboard/area-card';
import IotServer from '../controller/adafruit-io';
import AppContext from '../context/app-context';
import LocationController from '../controller/location-controller';

const Dashboard = () => {
    const isUnmounted = useRef(false);
    const flag = useRef(false)
    const addTempFlag = useRef(false);
    const addHumiFlag = useRef(false);
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [tempRecs, setTempRecs] = useState(null);
    const [airHumRecs, setAirHumRecs] = useState(null);

    const { area, setArea, areas, setAreas } = useContext(AppContext);

    const tempUnsubcriber = useRef(() => {});
    const airUnsubcriber = useRef(() => {});
    const location = areas.length > 0 ? areas[area] : undefined;
    
    useEffect(() => {
        if(areas.length > 0 ){
                (async () => {
                IotServer.getInstance().subscribeTemperature((tempRecord) => {
                    tempUnsubcriber.current();
                    tempUnsubcriber.current = LocationController.getInstance().subscribeTemperature(
                                    areas[area],
                                    (tempRecordRec) => {
                                    if(tempRecordRec.id !== tempRecord.id && addTempFlag.current === false){
                                            addTempFlag.current = true;
                                            LocationController.getInstance().addTempRecord(
                                                location,
                                                new TemperatureRecord(
                                                    tempRecord.id,
                                                    tempRecord.deviceId,
                                                    tempRecord.value,
                                                    tempRecord.name,
                                                    tempRecord.collectedTime
                                                ),
                                            );
                                    }
                                    },
                                );
                    if (!isUnmounted.current) setTemperature(tempRecord);
                })
                IotServer.getInstance().subscribeHumidity((humidRecord) => {
                    airUnsubcriber.current();
                    airUnsubcriber.current = LocationController.getInstance().subscribeHumidity(
                        areas[area],
                        (humiRecordRec) => {
                        if(humiRecordRec.id !== humidRecord.id && addHumiFlag.current === false){
                                addHumiFlag.current = true;
                                LocationController.getInstance().addHumiRecord(
                                    location,
                                    new HumidityRecord(
                                        humidRecord.id,
                                        humidRecord.deviceId,
                                        humidRecord.value,
                                        humidRecord.name,
                                        humidRecord.collectedTime
                                    ),
                                );
                        }
                        },
                    );
                    if (!isUnmounted.current) setHumidity(humidRecord);
                })
            }) ()
        }
        
        
        return () => {
            isUnmounted.current = true;
        };
    }, []);

    useEffect(() => {
        const timerId = setInterval(() => {
            addTempFlag.current = false;
            addHumiFlag.current = false;
            IotServer.getInstance().getTemperatureRecord().then((res) =>{
                if(res.value >= 29 && flag.current === false){
                    const to = '+84365256850';
                    const body = 'This is auto warning message from IOT assigment'
                    const res = axios.post('http://localhost:5000/api/messages',{
                        to,
                        body,
                    })
                    console.log(res.data);
                    flag.current = true;
                } else if(res.value < 29 && flag){
                    console.log("temperature was normal");
                }
            });
        },5000)
        return () => clearInterval(timerId);
    }, [])
    
    useEffect(() => {
        tempUnsubcriber.current();
        airUnsubcriber.current();

        if (areas.length > 0) {
            tempUnsubcriber.current =
                LocationController.getInstance().subscribeTemperature(
                    areas[area],
                    (tempRecord) => {
                        if (isUnmounted.current) return;
                        setTemperature(tempRecord);
                    },
                );

            airUnsubcriber.current =
                LocationController.getInstance().subscribeHumidity(
                    areas[area],
                    (humidRecord) => {
                        if (isUnmounted.current) return;
                        setHumidity(humidRecord);
                    },
                );
        }

        (async () => {
            if (areas.length > 0) {
                var temperatureRecordsData =
                    await LocationController.getInstance().getTemperatureRecords(
                        areas[area],
                    );
                var airHumidityRecordsData =
                    await LocationController.getInstance().getHumidityRecords(
                        areas[area],
                    );
                if (isUnmounted.current) return;
                setTempRecs(temperatureRecordsData);
                setAirHumRecs(airHumidityRecordsData);
            }
        })();
    }, [area, areas]);
                
    return (
        <>
            <Head>
                <title>Dashboard | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item xl={3} lg={6} sm={6} xs={12}>
                            <TemperatureCard temperature={temperature} />
                        </Grid>
                        <Grid item xl={3} lg={6} sm={6} xs={12}>
                            <AirHumidityCard humidity={humidity} />
                        </Grid>
                        <Grid item xl={3} lg={6} sm={6} xs={12}>
                            <AreaCard sx={{ height: '100%' }} />
                        </Grid>
                        <Grid item lg={12} md={12} xl={12} xs={12}>
                            <AirHumidity
                                records={
                                    airHumRecs ? airHumRecs.getRecords() : []
                                }
                            />
                        </Grid>
                        <Grid item lg={12} md={12} xl={12} xs={12}>
                            <Temperature
                                records={tempRecs ? tempRecs.getRecords() : []}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
