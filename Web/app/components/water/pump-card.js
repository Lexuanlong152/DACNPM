import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
    Button,
} from '@mui/material';
import ShowerIcon from '@mui/icons-material/Shower';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import GrassIcon from '@mui/icons-material/Grass';
import AirIcon from '@mui/icons-material/Air';

const PumpCard = ({
    pump,
    temperature,
    humidity,
    togglePump,
}) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pb: 3,
                    }}
                >
                    <Button
                        color={pump.status === true ? 'primary' : 'secondary'}
                        fullWidth
                        sx={{ height: '100px' }}
                        variant="contained"
                        onClick={togglePump}
                    >
                        <ShowerIcon sx={{ fontSize: 60 }} />
                    </Button>
                </Box>
                <Typography
                    align="center"
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                >
                    {'Vòi nước ' + pump.name}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        variant="h6"
                    >
                        {'Trạng thái: '}
                    </Typography>
                    <Typography
                        color={pump.status === true ? 'primary' : 'secondary'}
                        variant="h6"
                        sx={{ marginLeft: '6px' }}
                    >
                        {pump.status === true ? 'Bật' : 'Tắt'}
                    </Typography>
                </Box>
            </CardContent>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Grid
                    container
                    spacing={2}
                    sx={{ justifyContent: 'space-between' }}
                >
                    <Grid
                        item
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <ThermostatAutoIcon color="action" />
                        <Typography
                            color="textSecondary"
                            display="inline"
                            sx={{ pl: 1 }}
                            variant="body2"
                        >
                            {temperature + '\u00B0C'}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <GrassIcon color="action" />
                        <Typography
                            color="textSecondary"
                            display="inline"
                            sx={{ pl: 1 }}
                            variant="body2"
                        >
                         g/m\u00B3
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <AirIcon color="action" />
                        <Typography
                            color="textSecondary"
                            display="inline"
                            sx={{ pl: 1 }}
                            variant="body2"
                        >
                            {humidity + ' g/m\u00B3'}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};

PumpCard.propTypes = {
    pump: PropTypes.object.isRequired,
};


export default PumpCard;