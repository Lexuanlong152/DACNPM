import {
    Box,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    SvgIcon,
    Typography,
    Divider,
    MenuItem,
    Button,
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';

const AreaToolbar = (props) => (
    <Box>
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1,
            }}
        >
            <Typography sx={{ m: 1 }} variant="h4">
                Khu vực
            </Typography>
            <Box sx={{ m: 1 }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={props.onOpenModal}
                >
                    Thêm khu vực
                </Button>
            </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <SearchIcon />
                                        </SvgIcon>
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Tìm kiếm khu vực"
                            variant="outlined"
                            onChange={(event) => {
                                props.onSearchChange(event.target.value);
                            }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
);

export default AreaToolbar;