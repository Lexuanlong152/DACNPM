import { useState, useEffect, useContext, useRef } from 'react';
import {
    TableCell,
    TableRow,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import LocationController from '../../controller/location-controller';
import DeviceRecord from '../../models/device-record';
import AppContext from '../../context/app-context';
import IotServer from '../../controller/adafruit-io';

const DeviceRow = ({ device, editable, index, committing, incCommitState, decCommitState, types, topics }) => {
    const { area, setArea, areas, setAreas } = useContext(AppContext);
    const location = areas[area];

    // local state, commit to database when applied.
    const [type, setType] = useState(device.type);
    const [name, setName] = useState(device.name);
    const [topic, setTopic] = useState(device.topic);
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (committing && editable) {
            incCommitState();
            var promise;
            if (deleted)
                promise = LocationController.getInstance().removeDevice(
                    location,
                    DeviceRecord.factory({
                        id: device.id,
                        name: name,
                        type: type,
                        topic: topic,
                    }),
                );
            else
                promise = LocationController.getInstance().setDeviceRecord(
                    location,
                    DeviceRecord.factory({
                        id: device.id,
                        name: name,
                        type: type,
                        topic: topic,
                    }),
                );

            promise.then(decCommitState);
        }
    }, [committing]);
    useEffect(() => {
        setType(device.type);
        setName(device.name);
        setTopic(device.topic);
        setDeleted(false);
    }, [editable, device]);

    return deleted ? null : (!editable ? (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell>{topic}</TableCell>
        </TableRow>
    ) : (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <TextField
                    required
                    fullWidth={true}
                    defaultValue={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </TableCell>
            <TableCell>
                <TextField
                    select
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
            </TableCell>
            <TableCell>
                <TextField
                    select
                    fullWidth={true}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                >
                    {topics.map((topic) => (
                        <MenuItem key={topic} value={topic}>
                            {topic}
                        </MenuItem>
                    ))}
                </TextField>
            </TableCell>
            <TableCell>
                <Button variant="contained" onClick={() => setDeleted(true)}>
                    <DeleteIcon />
                </Button>
            </TableCell>
        </TableRow>
    ));
};

export default DeviceRow;
