import PropTypes from 'prop-types';
import { Box, Modal, Button, Typography } from '@mui/material';

const ModalTemplate = (props) => {
    return (
        <div>
            <Modal
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '98%',
                        maxWidth: '700px',
                        bgcolor: 'background.paper',
                        outline: 'none',
                        boxShadow: 24,
                        borderRadius: '8px',
                        p: 4,
                        minHeight: 500,
                        // height: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary"
                        >
                            {props.title}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: 'calc(100vh - 402px)',
                            overflowY: 'overlay',
                        }}
                    >
                        {props.children}
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            height: '42px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            maxWidth: '980px',
                        }}
                    >
                        <Button
                            onClick={props.onClose}
                            color="secondary"
                            variant="contained"
                            sx={{ width: '100px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={props.onAccept}
                            variant="contained"
                            sx={{ width: '100px' }}
                        >
                            OK
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

ModalTemplate.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onAccept: PropTypes.func,
};

export default ModalTemplate;
