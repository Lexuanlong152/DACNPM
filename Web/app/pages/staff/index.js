import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container, Typography, TextField, Checkbox } from '@mui/material';
import { set } from 'date-fns';

import StaffListResults from '../../components/staff/staff-list-results';
import StaffToolbar from '../../components/staff/staff-toolbar';
import DashboardLayout from '../../components/dashboard-layout';
import sendHttpRequest from '../../utils/request-api';
import ModalTemplate from '../../components/modal-template';
import AppContext from '../../context/app-context';
import EmployeeController from '../../controller/employee-controller';
import AuthController from '../../controller/auth-controller';

const Staff = () => {
    const isUnmounted = useRef(false);
    const [employees, setEmployee] = useState([]);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [search, setSearch] = useState('');

    const { area, _, areas, __ } = useContext(AppContext);

    const filted = employees.filter((e) => e.email.includes(search));

    useEffect(() => {
        return () => {
            isUnmounted.current = true;
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (areas.length > 0) {
                var employeeData =
                    await EmployeeController.getInstance().loadEmployees(
                        areas[area],
                    );
                if (isUnmounted.current) return;
                setEmployee(employeeData);
            }
        })();
    }, [area, areas]);

    return (
        <>
            <Head>
                <title>Staff | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <StaffToolbar
                        onSearchChange={(value) => {
                            setSearch(value);
                        }}
                        onOpenModal={() => {
                            setOpen(!open);
                        }}
                    />
                    <Box sx={{ mt: 3 }}>
                        <StaffListResults
                            employees={filted}
                            onSelect={async (index) => {
                                if (
                                    filted[index].email ===
                                    AuthController.getInstance().getCurrentUser()
                                        .email
                                )
                                    return;
                                if (
                                    await EmployeeController.getInstance().removeEmployee(
                                        areas[area],
                                        filted[index].email,
                                    )
                                ) {
                                    var res =
                                        await EmployeeController.getInstance().loadEmployees(
                                            areas[area],
                                        );
                                    if (isUnmounted.current) return;
                                    setEmployee(res);
                                }
                            }}
                        />
                    </Box>
                </Container>
                <ModalTemplate
                    open={open}
                    onClose={() => {
                        setOpen(!open);
                    }}
                    onAccept={async () => {
                        if (areas.length > 0 && email != '') {
                            await EmployeeController.getInstance().addEmployee(
                                areas[area],
                                email,
                                isManager,
                            );
                            var res =
                                await EmployeeController.getInstance().loadEmployees(
                                    areas[area],
                                );
                            if (isUnmounted.current) return;
                            setEmployee(res);
                        }
                        if (isUnmounted.current) return;
                        setOpen(!open);
                        setEmail('');
                        setIsManager(false);
                    }}
                    title={'Thông tin nhân viên'}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px 0px',
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>
                            Email:
                        </Typography>
                        <TextField
                            variant="outlined"
                            focused
                            fullWidth
                            color="info"
                            sx={{
                                backgroundColor: 'white',
                                marginBottom: '20px',
                            }}
                            inputProps={{
                                style: {
                                    fontSize: '15px',
                                    textAlign: 'left',
                                    padding: '8px 14px',
                                },
                            }}
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Checkbox
                                checked={isManager}
                                onChange={() => {
                                    setIsManager(!isManager);
                                }}
                                value={isManager}
                            ></Checkbox>
                            <Typography sx={{ fontSize: '14px' }}>
                                Quản trị viên
                            </Typography>
                        </Box>
                    </Box>
                </ModalTemplate>
            </Box>
        </>
    );
};

Staff.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Staff;
