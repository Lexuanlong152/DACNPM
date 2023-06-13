import Head from 'next/head';
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container, Typography, TextField, Checkbox } from '@mui/material';

import AreaListResults from '../../components/area/area-list-results';
import AreaToolbar from '../../components/area/area-toolbar';
import DashboardLayout from '../../components/dashboard-layout';
import ModalTemplate from '../../components/modal-template';
import AppContext from '../../context/app-context';
import LocationController from '../../controller/location-controller';
import AuthController from '../../controller/auth-controller';

const Stats = () => {
    const isUnmounted = useRef(false);
    const [ open, setOpen ] = useState(false);
    const [ edit, setEdit ] = useState(-1);
    const [ del, setDel ] = useState(-1);
    const [search, setSearch] = useState('');

    const [select, setSelect] = useState(-1);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [devices, setDevices] = useState([]);

    const { area, setArea, areas, setAreas } = useContext(AppContext);

    const filted = areas.filter((e) => e.name.includes(search));

    useEffect(() => {
        return () => {
            isUnmounted.current = false;
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (select >= 0 && filted.length > select) {
                var res =
                    await LocationController.getInstance().getDeviceRecords(
                        filted[select],
                    );
                if (isUnmounted.current) return;
                setDevices(res);
            }
        })();
    }, [select]);

    return (
        <>
            <Head>
                <title>Area | Greenhouse</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <AreaToolbar
                        onSearchChange={(value) => {
                            setSearch(value);
                        }}
                        onOpenModal={() => {
                            setOpen(!open);
                        }}
                    />
                    <Box sx={{ mt: 3 }}>
                        <AreaListResults
                            locations={filted}
                            onClickItem={(index) => {
                                setSelect(index);
                            }}
                            onEditItem={(index) => {
                                setName(filted[index].name)
                                setDescription(filted[index].description)
                                setEdit(index);
                            }}
                            onDeleteItem={(index) => {
                                setDel(index);
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
                        if (
                            await LocationController.getInstance().addLocation(
                                name,
                                description,
                            )
                        ) {
                            var res =
                                await LocationController.getInstance().getLocations(
                                    AuthController.getInstance().getCurrentUser(),
                                );
                            setAreas(res);
                            if (isUnmounted.current) return;
                            setName('');
                            setDescription('');
                            setOpen(false);
                        }
                    }}
                    title={'Khu vực mới'}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px 0px',
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>
                            Tên khu vực:
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
                                    // border: '3px solid #5048E5',
                                    // borderRadius: '8px'
                                },
                            }}
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                        <Typography sx={{ fontSize: '14px' }}>
                            Mô tả:
                        </Typography>
                        <TextField
                            variant="outlined"
                            focused
                            fullWidth
                            color="info"
                            multiline
                            rows={4}
                            sx={{
                                backgroundColor: 'white',
                                marginBottom: '20px',
                            }}
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </Box>
                </ModalTemplate>
                <ModalTemplate
                    open={select != -1}
                    onClose={() => {
                        setSelect(-1);
                    }}
                    title={'Thông tin khu vực'}
                >
                    {select >= 0 && select < filted.length ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '20px 0px',
                            }}
                        >
                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color="secondary"
                                >
                                    Tên khu vực
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    {'Khu vực ' + filted[select].name}
                                </Typography>
                            </Box>
                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color="secondary"
                                >
                                    Mô tả
                                </Typography>
                                <Typography sx={{ fontSize: '16px' }}>
                                    {filted[select].description}
                                </Typography>
                            </Box>
                            <Box sx={{ marginBottom: '20px' }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color="secondary"
                                >
                                    Thiết bị
                                </Typography>
                                {devices.map((e, ind) => {
                                    return (
                                        <Typography
                                            key={ind}
                                            sx={{ fontSize: '16px' }}
                                        >
                                            {'Thiết bị ' +
                                                e.name +
                                                ' (' +
                                                e.type +
                                                ')'}
                                        </Typography>
                                    );
                                })}
                            </Box>
                        </Box>
                    ) : null}
                </ModalTemplate>
                <ModalTemplate
                    open={edit != -1}
                    onClose={() => {
                        setName("");
                        setDescription("");
                        setEdit(-1);
                    }}
                    onAccept={async () => {
                        if (await LocationController.getInstance().editLocations(filted[edit].id, name, description)) {
                            var res =
                                await LocationController.getInstance().getLocations(
                                    AuthController.getInstance().getCurrentUser(),
                                );
                            setAreas(res);
                            if (isUnmounted.current) return;
                            setName("");
                            setDescription("");
                            setEdit(-1);
                        }
                        else {

                        }
                    }}
                    title={'Chỉnh sửa khu vực'}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px 0px',
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>
                            Tên khu vực:
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
                                    // border: '3px solid #5048E5',
                                    // borderRadius: '8px'
                                },
                            }}
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                            }}
                        />
                        <Typography sx={{ fontSize: '14px' }}>
                            Mô tả:
                        </Typography>
                        <TextField
                            variant="outlined"
                            focused
                            fullWidth
                            color="info"
                            multiline
                            rows={4}
                            sx={{
                                backgroundColor: 'white',
                                marginBottom: '20px',
                            }}
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </Box>
                </ModalTemplate>
                <ModalTemplate
                    open={del != -1}
                    onClose={() => {
                        setDel(-1);
                    }}
                    onAccept={async () => {
                        if (await LocationController.getInstance().deleteLocations(filted[del].id)) {
                            console.log(123);
                            var res =
                                await LocationController.getInstance().getLocations(
                                    AuthController.getInstance().getCurrentUser(),
                                );
                            setAreas(res);
                            setArea(0);
                            if (isUnmounted.current) return;
                            setDel(-1);
                        }
                    }}
                    title={'Xóa khu vực'}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px 0px',
                            height: "100%"
                        }}
                    >
                        <Typography sx={{ fontSize: '20px', fontWeight: "500" }}>
                            {"Nếu bạn bấm OK, khu vực bạn chọn sẽ bị xóa vĩnh viễn. Bạn có chắc là muốn xóa khu vực " + filted[del]?.name + " chứ?"}
                        </Typography>
                        
                    </Box>
                </ModalTemplate>
            </Box>
        </>
    );
};

Stats.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stats;
