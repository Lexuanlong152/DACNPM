import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    useTheme,
    MenuItem,
    TextField,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import * as React from 'react';
import { useRouter } from 'next/router';

const timedata = [
    {
        value: 'Mỗi 30 phút',
    },
    {
        value: 'Mỗi 1 giờ',
    },
    {
        value: 'Mỗi 1 ngày',
    },
];

const Temperature = (props) => {
    const theme = useTheme();
    const [select, setSelect] = React.useState(0);
    const router = useRouter();

    function getValues(data, select) {
        if (data.length == 0) return [];

        function getTime(date) {
            if (select == 0 || select == 1) {
                var hours = date.getHours().toString();
                var minute = date.getMinutes().toString();
                hours = hours.length == 1 ? '0' + hours : hours;
                minute = minute.length == 1 ? '0' + minute : minute;
                return hours + ':' + minute;
            } else {
                return date.toLocaleDateString();
            }
        }

        var step = select == 0 ? 1800000 : select == 1 ? 3600000 : 86400000;
        var now = data[0].collectedTime;
        var count = 0;
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var e = data[i];
            if (
                Date.parse(e.collectedTime) <= Date.parse(now) - count * step &&
                Date.parse(e.collectedTime) > Date.parse(now) - (count + 1) * step
            ) {
                var newTime = new Date(Date.parse(now) - count * step);
                res.push({ value: e.value, time: getTime(newTime) });
                count++;
                if (count == 10) return res;
            } else if (Date.parse(e.collectedTime) < Date.parse(now) - (count + 1) * step) {
                while (Date.parse(e.collectedTime) < Date.parse(now) - (count + 1) * step) {
                    var newTime = new Date(Date.parse(now) - count * step);
                    res.push({ value: e.value, time: getTime(newTime) });
                    count++;
                    if (count == 10) return res;
                }

                newTime = new Date(Date.parse(now) - count * step);
                res.push({ value: e.value, time: getTime(newTime) });
                count++;
                if (count == 10) return res;
            }
        }
        return res;
    }

    var stats = getValues(props.records, select).reverse();

    const data = {
        datasets: [
            {
                backgroundColor: theme.palette.error.main,
                barPercentage: 0.5,
                barThickness: 12,
                borderRadius: 4,
                categoryPercentage: 0.5,
                data: stats.map((e) => e.value),
                label: 'Nhiệt độ',
                maxBarThickness: 10,
            },
        ],
        labels: stats.map((e) => e.time),
    };

    const options = {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        xAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary,
                },
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
            },
        ],
        yAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary,
                    beginAtZero: true,
                    min: 0,
                },
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: theme.palette.divider,
                    drawBorder: false,
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                    zeroLineColor: theme.palette.divider,
                },
            },
        ],
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary,
        },
    };

    return (
        <Card {...props}>
            <CardHeader
                action={
                    <Box>
                        <TextField
                            value={select}
                            select
                            onChange={(event) => {
                                setSelect(event.target.value);
                            }}
                            sx={{
                                width: '160px',
                            }}
                            inputProps={{
                                style: {
                                    fontColor: 'primary',
                                },
                            }}
                        >
                            {timedata.map((item, ind) => (
                                <MenuItem key={ind} value={ind}>
                                    {item.value}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                }
                title="Nhiệt độ"
            />
            <Divider />
            <CardContent>
                <Box
                    sx={{
                        height: 400,
                        position: 'relative',
                    }}
                >
                    <Bar data={data} options={options} />
                </Box>
            </CardContent>
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2,
                }}
            >
                <Button
                    color="primary"
                    endIcon={<ArrowRightIcon fontSize="small" />}
                    size="small"
                    onClick={async () => {
                        await router.push('/stats');
                    }}
                >
                    Chi tiết
                </Button>
            </Box>
        </Card>
    );
};


export default Temperature;