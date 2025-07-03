import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export function useFinancialChart({ timeFrame, range, chartType, data }) {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const mainSeriesRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const legendElRef = useRef(null);
    const crosshairSubscriptionRef = useRef(null);

    // State quản lý: timeframe, range, chart type

    // Màu sắc
    const bgColor = "#ffffff";
    const upColor = "#26a69a";
    const downColor = "#ef5350";

    /**
     * Lọc dữ liệu theo khoảng range
     * @param {Array} data mảng dữ liệu chart
     * @param {string} range khoảng thời gian lọc ("3M", "6M", "1Y", "ALL")
     * @returns dữ liệu lọc theo thời gian
     */
    const filterDataByRange = (data, range) => {
        if (range === "ALL") return data;

        const lastEntry = data[data.length - 1];
        if (!lastEntry?.time) return data;

        // Convert thời gian cuối cùng sang timestamp giây (nếu là chuỗi)
        const lastTime =
            typeof lastEntry.time === "string"
                ? Math.floor(new Date(lastEntry.time).getTime() / 1000)
                : lastEntry.time;

        const SECONDS_IN_DAY = 86400;
        let from;

        switch (range) {
            case "3M":
                from = lastTime - SECONDS_IN_DAY * 90;
                break;
            case "6M":
                from = lastTime - SECONDS_IN_DAY * 180;
                break;
            case "1Y":
                from = lastTime - SECONDS_IN_DAY * 365;
                break;
            default:
                from = data[0].time;
        }

        // Lọc dữ liệu chỉ lấy các phần tử có thời gian >= from
        return data.filter((d) => {
            const t = typeof d.time === "string" ? Math.floor(new Date(d.time).getTime() / 1000) : d.time;
            return t >= from;
        });
    };

    /**
     * Tạo phần legend hiển thị thông tin giá khi hover
     */
    const createLegend = () => {
        const legend = document.createElement("div");
        legend.className = "chart-legend";
        legend.innerText = "No data";
        chartContainerRef.current.appendChild(legend);
        return legend;
    };

    /**
     * Cập nhật nội dung legend khi hover vào biểu đồ
     * @param {Object} param dữ liệu crosshair move event
     * @param {HTMLElement} legendEl element legend cần update
     */
    const updateLegend = (param, legendEl) => {
        if (!param.time || !param.seriesData.size) {
            legendEl.innerText = "No data";
            return;
        }

        const candle = param.seriesData.get(mainSeriesRef.current);
        if (candle) {
            legendEl.innerHTML = `
        Time: <strong>${param.time}</strong><br/>
        Open: <strong>${candle.open ?? candle.value ?? "-"}</strong><br/>
        High: <strong>${candle.high ?? "-"}</strong><br/>
        Low: <strong>${candle.low ?? "-"}</strong><br/>
        Close: <strong>${candle.close ?? candle.value ?? "-"}</strong>
      `;
        } else {
            legendEl.innerText = "No data";
        }
    };

    // Các hàm tạo các loại series biểu đồ khác nhau
    const createMainSeries = {
        area: () =>
            chartRef.current.addAreaSeries({
                topColor: upColor + "33",
                bottomColor: downColor + "10",
                lineColor: upColor,
                lineWidth: 2,
            }),
        line: () =>
            chartRef.current.addLineSeries({
                color: upColor,
                lineWidth: 2,
            }),
        bar: () =>
            chartRef.current.addBarSeries({
                upColor,
                downColor,
                thinBars: true,
            }),
        candlestick: () =>
            chartRef.current.addCandlestickSeries({
                upColor,
                downColor,
                borderVisible: false,
                wickUpColor: upColor,
                wickDownColor: downColor,
            }),
    };

    /**
     * Thêm volume series (histogram) phía dưới chart chính
     * @param {Array} data dữ liệu chart
     * @returns volumeSeries
     */
    const addVolumeSeries = (data) => {
        const volumeSeries = chartRef.current.addHistogramSeries({
            color: upColor,
            priceFormat: { type: "volume" },
            priceScaleId: "",
        });

        // Tùy chỉnh vị trí scale của volume (phần dưới chart)
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        volumeSeries.setData(
            data.map(({ time, volume, close, open }) => ({
                time,
                value: volume ?? 0,
                color: close > open ? upColor : downColor,
            }))
        );

        return volumeSeries;
    };

    /**
     * Khởi tạo chart, xử lý resize
     */
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Tạo chart
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: { background: { type: "solid", color: bgColor }, textColor: "black" },
            rightPriceScale: { borderVisible: false },
        });
        chartRef.current = chart;

        // Tạo legend hiển thị giá hover
        legendElRef.current = createLegend();

        // Resize khi container thay đổi kích thước
        const resizeObserver = new ResizeObserver(() => {
            chart.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
        });
        resizeObserver.observe(chartContainerRef.current);
        resizeObserverRef.current = resizeObserver;

        // Cleanup khi unmount
        return () => {
            resizeObserver.disconnect();
            chart.remove();
            if (legendElRef.current?.parentNode) {
                legendElRef.current.parentNode.removeChild(legendElRef.current);
            }
        };
    }, []);

    /**
     * Cập nhật biểu đồ khi thay đổi timeframe, range hoặc chartType
     */
    useEffect(() => {
        if (!chartRef.current) return;

        // Remove listener cũ
        if (crosshairSubscriptionRef.current) {
            crosshairSubscriptionRef.current.unsubscribe();
            crosshairSubscriptionRef.current = null;
        }

        // Remove series cũ nếu có
        if (mainSeriesRef.current) {
            try {
                chartRef.current.removeSeries(mainSeriesRef.current);
            } catch { }
            mainSeriesRef.current = null;
        }
        if (volumeSeriesRef.current) {
            try {
                chartRef.current.removeSeries(volumeSeriesRef.current);
            } catch { }
            volumeSeriesRef.current = null;
        }

        // Tạo series mới dựa theo chartType
        const createFn = createMainSeries[chartType] || createMainSeries["candlestick"];
        const mainSeries = createFn();
        mainSeries.priceScale().applyOptions({ scaleMargins: { top: 0.2, bottom: 0.3 } });
        mainSeriesRef.current = mainSeries;

        // Lấy dữ liệu theo timeframe, rồi lọc theo range
        const filteredData = filterDataByRange(data, range);
        
        // Set data cho main series
        if (chartType === "area" || chartType === "line") {
            mainSeries.setData(filteredData.map(({ time, close }) => ({ time, value: close })));
        } else {
            mainSeries.setData(filteredData);
        }

        // Thêm volume series
        volumeSeriesRef.current = addVolumeSeries(filteredData);

        // Đăng ký event update legend khi hover
        if (legendElRef.current) {
            crosshairSubscriptionRef.current = chartRef.current.subscribeCrosshairMove((param) =>
                updateLegend(param, legendElRef.current)
            );
        }

        // Fit content tự động scale trục thời gian
        chartRef.current.timeScale().fitContent();
    }, [chartType, timeFrame, range]);
    return { chartContainerRef };
}