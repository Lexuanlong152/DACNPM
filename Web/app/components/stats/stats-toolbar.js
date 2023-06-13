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
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DateAdapter from '@mui/lab/AdapterDateFns';

const StatsToolbar = (props) => (
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
                Lịch sử đo đạt
            </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ width: '100%' }}>
                        {/* <TextField
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
                )
              }}
              placeholder="Tìm kiếm khách hàng"
              variant="outlined"
              onChange={(event) => {
                props.onSearchChange(event.target.value);
              }}
            /> */}
                        <DateTimePicker
                            label="Từ lúc"
                            value={new Date(props.start)}
                            onChange={(val) => {
                                props.onChange(val.getTime(), props.end);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ marginRight: '10px' }}
                                />
                            )}
                        ></DateTimePicker>
                        <DateTimePicker
                            label="Cho đến"
                            value={new Date(props.end)}
                            onChange={(val) => {
                                props.onChange(props.start, val.getTime());
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ marginRight: '10px' }}
                                />
                            )}
                        ></DateTimePicker>
                        <TextField
                            label="Khu vực"
                            value={props.type}
                            select
                            onChange={(event) => {
                                props.onTypeChange(event.target.value);
                            }}
                        >
                            {['Nhiệt độ', 'Độ ấm không khí'].map(
                                (item, index) => (
                                    <MenuItem key={index} value={index}>
                                        {item}
                                    </MenuItem>
                                ),
                            )}
                        </TextField>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
);


export default StatsToolbar;