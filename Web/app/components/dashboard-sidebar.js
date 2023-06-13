import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
    Box,
    Divider,
    Drawer,
    Grid,
    Typography,
    useMediaQuery,
} from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';
import BathroomIcon from '@mui/icons-material/Bathroom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import GroupIcon from '@mui/icons-material/Group';
import ApiIcon from '@mui/icons-material/Api';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';

import AuthController from '../controller/auth-controller';
import Logo from './logo';
import NavItem from './nav-item';

var items1 = [
    {
        href: '/',
        icon: <EqualizerIcon fontSize="small" />,
        title: 'Thống kê',
    },
    {
        href: '/stats',
        icon: <DeviceThermostatIcon fontSize="small" />,
        title: 'Lịch sử đo đạt',
    },
    {
        href: '/water-history',
        icon: <WaterDamageIcon fontSize="small" />,
        title: 'Lịch sử tưới',
    },
    {
        href: '/water',
        icon: <BathroomIcon fontSize="small" />,
        title: 'Tưới nước',
    },
    {
        href: '/manage-device',
        icon: <DevicesOtherIcon fontSize="small" />,
        title: 'Thiết bị',
    },
    {
        href: '/staff',
        icon: <GroupIcon fontSize="small" />,
        title: 'Nhân viên',
    },
    {
        href: '/area',
        icon: <ApiIcon fontSize="small" />,
        title: 'Khu vực',
    },
];

var items2 = [
    {
        href: '/',
        icon: <EqualizerIcon fontSize="small" />,
        title: 'Thống kê',
    },
    {
        href: '/stats',
        icon: <DeviceThermostatIcon fontSize="small" />,
        title: 'Lịch sử đo đạt',
    },
    {
        href: '/water-history',
        icon: <WaterDamageIcon fontSize="small" />,
        title: 'Lịch sử tưới',
    },
    {
        href: '/water',
        icon: <BathroomIcon fontSize="small" />,
        title: 'Tưới nước',
    },
    {
        href: '/manage-device',
        icon: <DevicesOtherIcon fontSize="small" />,
        title: 'Thiết bị',
    },
];

const DashboardSidebar = (props) => {
    const { open, onClose } = props;
    const router = useRouter();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
        defaultMatches: true,
        noSsr: false,
    });
    var items = AuthController.getInstance().getCurrentUser().isManager
        ? items1
        : items2;

    useEffect(
        () => {
            if (!router.isReady) {
                return;
            }

            if (open) {
                onClose?.();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.asPath],
    );

    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    pt="20px"
                >
                    <Grid item xs={4} pl="20px">
                        <Logo
                            sx={{
                                height: 42,
                                width: 42,
                            }}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" fontWeight="bold" pr="20px">
                            StoreHouse
                        </Typography>
                    </Grid>
                </Grid>
                <Divider
                    sx={{
                        borderColor: '#2D3748',
                        my: 3,
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    {items.map((item) => (
                        <NavItem
                            key={item.title}
                            icon={item.icon}
                            href={item.href}
                            title={item.title}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.900',
                        color: '#FFFFFF',
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.900',
                    color: '#FFFFFF',
                    width: 280,
                },
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};


export default DashboardSidebar;