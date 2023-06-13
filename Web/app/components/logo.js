import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import SensorDoorTwoToneIcon from '@mui/icons-material/SensorDoorTwoTone';

const Logo = styled(() => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <SensorDoorTwoToneIcon
                color={'primary'}
                sx={{
                    fontSize: '48px',
                }}
            />
        </Box>
    );
})``;

Logo.defaultProps = {
    variant: 'primary',
};

Logo.propTypes = {
    variant: PropTypes.oneOf(['light', 'primary']),
};


export default Logo;