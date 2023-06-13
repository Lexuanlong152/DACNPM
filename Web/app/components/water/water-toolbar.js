import { Box, Button, Typography } from '@mui/material';

const WaterToolbar = (props) => (
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
                Tưới nước
            </Typography>
        </Box>
    </Box>
);


export default WaterToolbar;