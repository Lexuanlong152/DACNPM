import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';

const TemperatureCard = ({ temperature }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Grid
                container
                spacing={3}
                sx={{ justifyContent: 'space-between' }}
            >
                <Grid item>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                    >
                        Nhiệt độ
                    </Typography>
                    <Typography color="textPrimary" variant="h4">
                        {(temperature ? temperature.value : 0).toString() +
                            '\u00B0C'}
                    </Typography>
                </Grid>
                <Grid item>
                    <Avatar
                        sx={{
                            backgroundColor: 'error.main',
                            height: 56,
                            width: 56,
                        }}
                    >
                        <ThermostatAutoIcon />
                    </Avatar>
                </Grid>
            </Grid>
            {/* <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ArrowDownwardIcon color="error" />
        <Typography
          color="error"
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          2&#176;C
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          So với 1 giờ trước
        </Typography>
      </Box> */}
        </CardContent>
    </Card>
);


export default TemperatureCard;