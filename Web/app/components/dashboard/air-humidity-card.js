import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AirIcon from '@mui/icons-material/Air';

const AirHumidityCard = ({ humidity }) => (
    <Card>
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
                        Độ ẩm không khí
                    </Typography>
                    <Typography color="textPrimary" variant="h4">
                        {(humidity ? humidity.value : 0).toString() +
                            ' g/m\u00B3'}
                    </Typography>
                </Grid>
                <Grid item>
                    <Avatar
                        sx={{
                            backgroundColor: 'success.main',
                            height: 56,
                            width: 56,
                        }}
                    >
                        <AirIcon />
                    </Avatar>
                </Grid>
            </Grid>
            {/* <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pt: 2
        }}
      >
        <ArrowUpwardIcon color="success" />
        <Typography
          variant="body2"
          sx={{
            mr: 1
          }}
        >
          1 g/m&sup3;
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


export default AirHumidityCard;