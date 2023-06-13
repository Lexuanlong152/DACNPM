import { Box, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

const DeviceTableToolBar = ({
    editing,
    onApply,
    onCancel,
    onEdit,
    onCreate,
}) => {
    return (
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
                Thiết bị
            </Typography>
            <Box sx={{ m: 1 }}>
                {editing ? (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<CheckCircleIcon />}
                            onClick={onApply}
                            sx={{ marginRight: '10px' }}
                        >
                            <Typography> Xác nhận </Typography>
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<CancelIcon />}
                            onClick={onCancel}
                        >
                            <Typography> Hủy </Typography>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            onClick={onCreate}
                            sx={{ marginRight: '10px' }}
                        >
                            <Typography> Thêm mới </Typography>
                        </Button>
                        <Button
                            variant="contained"
                            endIcon={<EditIcon />}
                            onClick={onEdit}
                        >
                            <Typography> Sửa </Typography>
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};


export default DeviceTableToolBar;