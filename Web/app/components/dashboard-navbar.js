import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Tooltip,
    Button,
    Avatar,
    TextField,
    MenuItem,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';

import AuthController from '../controller/auth-controller';
import AppContext from '../context/app-context';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
}));

const DashboardNavbar = (props) => {
    const { onSidebarOpen } = props;
    const { area, setArea, areas, _ } = useContext(AppContext);

    return (
        <>
            <DashboardNavbarRoot
                sx={{
                    left: {
                        lg: 280,
                    },
                    width: {
                        lg: 'calc(100% - 280px)',
                    },
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        minHeight: 64,
                        left: 0,
                        px: 2,
                    }}
                >
                    <Typography sx={{ m: 1 }} variant="h6" color="textPrimary">
                        Khu vực:
                    </Typography>
                    {areas.length === 0 ? null : (
                        <TextField
                            label=""
                            value={area}
                            select
                            onChange={(event) => {
                                setArea(event.target.value);
                            }}
                            size="small"
                            sx={{
                                width: '100px',
                                textAlign: 'center',
                            }}
                        >
                            {areas.map((item, i) => (
                                <MenuItem key={item.id} value={i}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    <IconButton
                        onClick={onSidebarOpen}
                        sx={{
                            display: {
                                xs: 'inline-flex',
                                lg: 'none',
                            },
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Avatar
                        sx={{
                            height: 40,
                            width: 40,
                            mr: 1,
                        }}
                        src={AuthController.getInstance().getCurrentUser().avt}
                    ></Avatar>
                    <Tooltip title="logout">
                        <Button
                            variant="contained"
                            onClick={() => {
                                AuthController.getInstance().logout();
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Tooltip>
                </Toolbar>
            </DashboardNavbarRoot>
        </>
    );
};

DashboardNavbar.propTypes = {
    onSidebarOpen: PropTypes.func,
};


export default DashboardNavbar;