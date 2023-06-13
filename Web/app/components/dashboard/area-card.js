import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import YardIcon from '@mui/icons-material/Yard';
import { useContext } from 'react';

import AppContext from '../../context/app-context';

const AreaCard = (props) => {
    const { area, _, areas, __ } = useContext(AppContext);

    return (
        <Card {...props}>
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
                            VỊ TRÍ
                        </Typography>
                        <Typography color="textPrimary" variant="h4">
                            {'Khu vực ' +
                                (areas.length > 0 ? areas[area]?.name : '')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar
                            sx={{
                                backgroundColor: 'primary.main',
                                height: 56,
                                width: 56,
                            }}
                        >
                            <YardIcon />
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};


export default AreaCard;