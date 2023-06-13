import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { useState, useEffect, useRef, useContext } from 'react';

import ModalTemplate from '../../components/modal-template';
import LocationController from '../../controller/location-controller';
import IotServer from '../../controller/adafruit-io';
import AppContext from '../../context/app-context';
import DeviceRecord from '../../models/device-record';

const NEW_TOPIC_PROMT = 'Create new topic base on name';

const CreateDevice = ({ open, onClose }) => {
    const { area, setArea, areas, setAreas } = useContext(AppContext);
    const location = areas[area];

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [topic, setTopic] = useState('');

    const [types, setTypes] = useState([]);
    const [topics, setTopics] = useState([]);
    useEffect(() => {
        IotServer.getInstance()
            .getDeviceTypes()
            .then((res) => {
                setTypes(res);
            });
        IotServer.getInstance()
            .getTopics()
            .then((res) => {
                setTopics([NEW_TOPIC_PROMT, ...res]);
            });
    }, []);

    const onAccept = async () => {
        if (name === '' || type === '' || topic === '')
            return;

        if (topic == NEW_TOPIC_PROMT) {
            topic = await IotServer.getInstance().createTopic(name);

            await IotServer.getInstance()
                .getTopics()
                .then((res) => {
                    setTopics([NEW_TOPIC_PROMT, ...res]);
                });
        }

        await LocationController.getInstance().addDevice(
            location,
            DeviceRecord.factory({
                id: Math.floor(Math.random()*10000 + 100).toString(),
                name: name,
                type: type,
                topic: topic,
            }),
        );
        onClose();
    };

    return (
        <ModalTemplate
            open={open}
            onClose={onClose}
            onAccept={onAccept}
            title={'Thông tin thiết bị'}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 0px',
                }}
            >
                <Typography sx={{ fontSize: '14px' }}>Tên</Typography>
                <TextField
                    fullWidth
                    required
                    placeholder="Tên"
                    sx={{ marginBottom: '20px' }}
                    variant="outlined"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <Typography sx={{ fontSize: '14px' }}>Loại</Typography>
                <TextField
                    select
                    sx={{ marginBottom: '20px' }}
                    variant="outlined"
                    fullWidth={true}
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                >
                    {types.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography sx={{ fontSize: '14px' }}>Topic</Typography>
                <TextField
                    select
                    variant="outlined"
                    fullWidth={true}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                >
                    {topics.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </ModalTemplate>
    );
};

export default CreateDevice;
