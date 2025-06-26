import React from 'react';
import ReactApexChart from 'react-apexcharts';

const rawData = `
2023-10-02 04:00:00+07:00 1.05661 1.06945 1.04482 1.05744 5556210.0
2023-11-01 04:00:00+07:00 1.05744 1.10171 1.05165 1.08851 4361892.0
2023-12-01 05:00:00+07:00 1.08851 1.11393 1.07238 1.10375 4412582.0
2024-01-01 05:00:00+07:00 1.10368 1.10388 1.07947 1.0818 4510752.0
2024-02-01 05:00:00+07:00 1.0818 1.08975 1.06949 1.08052 3786185.0
2024-03-01 05:00:00+07:00 1.08052 1.09812 1.07677 1.07894 3701382.0
2024-04-01 04:00:00+07:00 1.07843 1.0885 1.06011 1.06654 4022686.0
2024-05-01 04:00:00+07:00 1.06654 1.08949 1.06494 1.08475 3271175.0
2024-06-03 04:00:00+07:00 1.08443 1.0916 1.0666 1.07108 3461545.0
2024-07-01 04:00:00+07:00 1.07432 1.0948 1.07099 1.08256 4273885.0
2024-08-01 04:00:00+07:00 1.08256 1.12016 1.07774 1.10453 5214677.0
2024-09-02 04:00:00+07:00 1.10448 1.12138 1.10019 1.11345 4802964.0
2024-10-01 04:00:00+07:00 1.11345 1.11437 1.07608 1.08831 4619362.0
2024-11-01 04:00:00+07:00 1.08831 1.09367 1.03314 1.05741 5601292.0
2024-12-02 05:00:00+07:00 1.05645 1.06293 1.03425 1.03549 4860264.0
2025-01-01 05:00:00+07:00 1.03549 1.05329 1.01766 1.0356 6189827.0
2025-02-03 05:00:00+07:00 1.02325 1.05284 1.02098 1.03738 5357300.0
2025-03-03 05:00:00+07:00 1.04022 1.09544 1.03882 1.08147 5915720.0
2025-04-01 04:00:00+07:00 1.08147 1.15729 1.07779 1.13276 11680509.0
2025-05-01 04:00:00+07:00 1.13276 1.13547 1.12654 1.13389 428357.0
`;

// Hàm parse raw data thành mảng candlestick và volume
const parseData = (raw) => {
    const lines = raw.trim().split('\n');
    const candleData = [];
    const volumeData = [];
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        // parse ngày, bỏ timezone +07:00 để tránh lỗi timezone, hoặc dùng new Date(parts[0]+"T"+parts[1])
        const dateStr = parts[0] + 'T' + parts[1].split('+')[0];
        const date = new Date(dateStr);
        const open = parseFloat(parts[2]);
        const high = parseFloat(parts[3]);
        const low = parseFloat(parts[4]);
        const close = parseFloat(parts[5]);
        const volume = parseFloat(parts[6]);
        candleData.push({ x: date.getTime(), y: [open, high, low, close] });
        volumeData.push({ x: date.getTime(), y: volume });
    });
    return { candleData, volumeData };
};

const ApexChartWithVolume = () => {
    const { candleData, volumeData } = parseData(rawData);

    const [state] = React.useState({
        series: [{
            data: candleData
        }],
        options: {
            title: {
                text: 'CandleStick Chart',
                align: 'left'
            },
            chart: {
                height: 290, type: 'candlestick', id: 'candles', toolbar: { autoSelected: 'pan', show: false, },
                zoom: { enabled: true }
            },
            xaxis: { type: 'datetime', },
            yaxis: { tooltip: { enabled: true } }
        },
        seriesBar: [{
            name: 'Volume',
            data: volumeData
        }],
        optionsBar: {
            chart: {
                height: 160,
                type: 'bar',
                brush: {
                    enabled: true,
                    target: 'candles'
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        min: candleData[0].x,
                        max: candleData[candleData.length - 1].x
                    },
                    fill: {
                        color: '#ccc',
                        opacity: 0.4
                    },
                    stroke: {
                        color: '#0D47A1'
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    colors: {
                        ranges: [
                            { from: -1000, to: 0, color: '#F15B46' },
                            { from: 1, to: 100000000, color: '#FEB019' }
                        ]
                    }
                }
            },
            stroke: {
                width: 0
            },
            xaxis: { type: 'datetime', axisBorder: { offsetX: 13 } },
            yaxis: {
                labels: { show: true }
            }
        }
    });

    return (
        <div>
            <div id="chart-candlestick">
                <ReactApexChart
                    options={state.options}
                    series={state.series}
                    type="candlestick"
                    height={600}
                />
            </div>
            <div id="chart-bar">
                <ReactApexChart
                    options={state.optionsBar}
                    series={state.seriesBar}
                    type="bar"
                    height={160}
                />
            </div>
        </div>
    );
};

export default ApexChartWithVolume;
