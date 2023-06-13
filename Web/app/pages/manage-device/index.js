import Head from 'next/head';
import {
    Box,
    Container,
    speedDialActionClasses,
    Typography,
    TextField,
    MenuItem,
    InputAdornment,
    SvgIcon,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';

import DashboardLayout from '../../components/dashboard-layout';
import DevicesTable from '../../components/manage-device/devices-table';
import DeviceTableToolBar from '../../components/manage-device/device-table-toolbar';
import CreateDevice from '../../components/manage-device/create-device';
import ModalTemplate from '../../components/modal-template';
import LocationController from '../../controller/location-controller';

const ManageDevice = () => {
    const [editable, setEditable] = useState(false);
    const [committing, setCommitting] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (committing) {
            setCommitting(false);
            setEditable(false);
            setCreating(false);
        }
    }, [committing]);

    return (
        <>
            <Head>
                <title> Manage Device | Greenhouse </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false} component="form">
                    <DeviceTableToolBar
                        editing={editable}
                        onApply={() => setCommitting(true)}
                        onCancel={() => setEditable(false)}
                        onEdit={() => setEditable(true)}
                        onCreate={() => setCreating(true)}
                    />
                    <Box sx={{ mt: 3 }}>
                        <DevicesTable
                            editable={editable}
                            committing={committing}
                        />
                    </Box>
                </Container>
                <CreateDevice
                    open={creating}
                    onClose={() => {
                        setCreating(false);
                        setEditable(true);
                        setEditable(false);
                    }}
                />
            </Box>
        </>
    );
};

ManageDevice.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ManageDevice;
