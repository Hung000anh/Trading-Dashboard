// src/components/Chart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "../styles/Chart.css";

const dataMap = {
  "1h": [
    { time: 1609459200, open: 100, high: 110, low: 95, close: 105, volume: 1200 },
    { time: 1609462800, open: 105, high: 108, low: 101, close: 102, volume: 950 },
    { time: 1609466400, open: 102, high: 106, low: 99, close: 100, volume: 1100 },
    { time: 1609470000, open: 100, high: 103, low: 98, close: 101, volume: 900 },
    { time: 1609473600, open: 101, high: 107, low: 100, close: 106, volume: 1300 },
    { time: 1609477200, open: 106, high: 112, low: 104, close: 110, volume: 1400 },
    { time: 1609480800, open: 110, high: 115, low: 108, close: 113, volume: 1500 },
    { time: 1609484400, open: 113, high: 118, low: 112, close: 117, volume: 1600 },
    { time: 1609488000, open: 117, high: 120, low: 115, close: 119, volume: 1700 },
    { time: 1609491600, open: 119, high: 123, low: 118, close: 121, volume: 1750 },
    { time: 1609495200, open: 121, high: 125, low: 120, close: 123, volume: 1650 },
    { time: 1609498800, open: 123, high: 128, low: 122, close: 127, volume: 1800 },
    { time: 1609502400, open: 127, high: 130, low: 125, close: 129, volume: 1900 },
    { time: 1609506000, open: 129, high: 133, low: 128, close: 132, volume: 2000 },
    { time: 1609509600, open: 132, high: 135, low: 130, close: 134, volume: 2100 },
    { time: 1609513200, open: 134, high: 138, low: 133, close: 137, volume: 2200 },
    { time: 1609516800, open: 137, high: 140, low: 135, close: 139, volume: 2300 },
    { time: 1609520400, open: 139, high: 143, low: 138, close: 141, volume: 2400 },
    { time: 1609524000, open: 141, high: 145, low: 140, close: 144, volume: 2500 },
    { time: 1609527600, open: 144, high: 147, low: 142, close: 146, volume: 2600 },
  ],
  "1d": [
    { time: "2018-12-01", open: 40, high: 60, low: 35, close: 50, volume: 5000 },
    { time: "2018-12-02", open: 50, high: 55, low: 45, close: 53, volume: 5200 },
    { time: "2018-12-03", open: 53, high: 58, low: 50, close: 56, volume: 5100 },
    { time: "2018-12-04", open: 56, high: 60, low: 54, close: 58, volume: 5300 },
    { time: "2018-12-05", open: 58, high: 62, low: 57, close: 60, volume: 5400 },
    { time: "2018-12-06", open: 60, high: 65, low: 59, close: 64, volume: 5500 },
    { time: "2018-12-07", open: 64, high: 67, low: 62, close: 66, volume: 5600 },
    { time: "2018-12-08", open: 66, high: 70, low: 65, close: 69, volume: 5700 },
    { time: "2018-12-09", open: 69, high: 72, low: 68, close: 70, volume: 5800 },
    { time: "2018-12-10", open: 70, high: 75, low: 69, close: 74, volume: 5900 },
    { time: "2018-12-11", open: 74, high: 78, low: 73, close: 77, volume: 6000 },
    { time: "2018-12-12", open: 77, high: 82, low: 76, close: 80, volume: 6100 },
    { time: "2018-12-13", open: 80, high: 85, low: 79, close: 84, volume: 6200 },
    { time: "2018-12-14", open: 84, high: 88, low: 83, close: 87, volume: 6300 },
    { time: "2018-12-15", open: 87, high: 90, low: 85, close: 89, volume: 6400 },
    { time: "2018-12-16", open: 89, high: 93, low: 88, close: 91, volume: 6500 },
    { time: "2018-12-17", open: 91, high: 95, low: 90, close: 93, volume: 6600 },
    { time: "2018-12-18", open: 93, high: 98, low: 92, close: 97, volume: 6700 },
    { time: "2018-12-19", open: 97, high: 100, low: 95, close: 99, volume: 6800 },
    { time: "2018-12-20", open: 99, high: 102, low: 98, close: 101, volume: 6900 },
  ],
  "w": [
    { time: "2018-10-01", open: 35, high: 55, low: 30, close: 50, volume: 4800 },
    { time: "2018-10-08", open: 50, high: 60, low: 45, close: 55, volume: 5000 },
    { time: "2018-10-15", open: 55, high: 70, low: 50, close: 65, volume: 5200 },
    { time: "2018-10-22", open: 65, high: 80, low: 60, close: 75, volume: 5400 },
    { time: "2018-10-29", open: 75, high: 90, low: 70, close: 85, volume: 5600 },
    { time: "2018-11-05", open: 85, high: 100, low: 80, close: 95, volume: 5800 },
    { time: "2018-11-12", open: 95, high: 110, low: 90, close: 105, volume: 6000 },
    { time: "2018-11-19", open: 105, high: 115, low: 100, close: 110, volume: 6200 },
    { time: "2018-11-26", open: 110, high: 120, low: 105, close: 115, volume: 6400 },
    { time: "2018-12-03", open: 115, high: 125, low: 110, close: 120, volume: 6600 },
    { time: "2018-12-10", open: 120, high: 130, low: 115, close: 125, volume: 6800 },
    { time: "2018-12-17", open: 125, high: 135, low: 120, close: 130, volume: 7000 },
    { time: "2018-12-24", open: 130, high: 140, low: 125, close: 135, volume: 7200 },
    { time: "2018-12-31", open: 135, high: 145, low: 130, close: 140, volume: 7400 },
    { time: "2019-01-07", open: 140, high: 150, low: 135, close: 145, volume: 7600 },
    { time: "2019-01-14", open: 145, high: 155, low: 140, close: 150, volume: 7800 },
    { time: "2019-01-21", open: 150, high: 160, low: 145, close: 155, volume: 8000 },
    { time: "2019-01-28", open: 155, high: 165, low: 150, close: 160, volume: 8200 },
    { time: "2019-02-04", open: 160, high: 170, low: 155, close: 165, volume: 8400 },
    { time: "2019-02-11", open: 165, high: 175, low: 160, close: 170, volume: 8600 },
  ],
};
const TIMEFRAMES = ["1h", "4h", "1d", "w", "m"];
const CHART_TYPES = ["candlestick", "area", "line", "bar"];

const Chart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Màu sắc mặc định
  const [bgColor] = useState("#ffffff");
  const [upColor] = useState("#26a69a");
  const [downColor] = useState("#ef5350");

  // Trạng thái lựa chọn khung thời gian và loại biểu đồ
  const [timeFrame, setTimeFrame] = useState("1d");
  const [chartType, setChartType] = useState("candlestick");

  // Format dữ liệu volume cho histogram (cột)
  const getVolumeData = (data) =>
    data.map(({ time, volume, close, open }) => ({
      time,
      value: volume ?? 0,
      color: close > open ? upColor : downColor,
    }));

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Khởi tạo chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: "solid", color: bgColor },
        textColor: "black",
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    // Tạo legend hiển thị dữ liệu khi di chuột
    const legend = document.createElement("div");
    legend.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 6px 12px;
      font-size: 14px;
      font-family: sans-serif;
      border-radius: 4px;
      pointer-events: none;
      user-select: none;
      color: black;
      z-index: 10;
    `;
    legend.innerText = "No data";
    chartContainerRef.current.appendChild(legend);

    // Thêm series cho biểu đồ nến
    const candlestickSeries = chart.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
      priceScaleId: "right",
    });
    candlestickSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.05,    // ít khoảng trống trên cùng hơn
        bottom: 0.3,  // nhiều không gian hơn cho volume
      },
    });

    // Thêm series cho volume (dạng histogram)
    const volumeSeries = chart.addHistogramSeries({
      color: upColor,
      priceFormat: { type: "volume" },
      priceScaleId: "", // overlay scale cho volume
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,  // volume bắt đầu từ 80% chiều cao chart
        bottom: 0,
      },
    });

    // Lấy dữ liệu hiện tại theo khung thời gian và set cho series
    const currentData = dataMap[timeFrame] || [];
    candlestickSeries.setData(currentData);
    volumeSeries.setData(getVolumeData(currentData));

    // Fit content chart
    chart.timeScale().fitContent();

    // Cập nhật legend khi di chuột trên chart
    chart.subscribeCrosshairMove(param => {
      if (!param.time || !param.seriesData.size) {
        legend.innerText = "No data";
        return;
      }
      const candle = param.seriesData.get(candlestickSeries);
      if (candle) {
        legend.innerHTML = `
          Time: <strong>${param.time}</strong><br/>
          Open: <strong>${candle.open}</strong><br/>
          High: <strong>${candle.high}</strong><br/>
          Low: <strong>${candle.low}</strong><br/>
          Close: <strong>${candle.close}</strong>
        `;
      } else {
        legend.innerText = "No data";
      }
    });

    // Lưu tham chiếu chart
    chartRef.current = chart;

    // Resize observer để resize chart khi container thay đổi kích thước
    resizeObserverRef.current = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    });
    resizeObserverRef.current.observe(chartContainerRef.current);

    // Cleanup khi unmount component
    return () => {
      resizeObserverRef.current?.disconnect();
      chart.remove();
      if (legend && legend.parentNode) {
        legend.parentNode.removeChild(legend);
      }
    };
  }, [bgColor, upColor, downColor, timeFrame]);

  return (
    <div className="chart-financial">
      <div className="chart-toolbar">
        <input
          type="text"
          placeholder="Search symbol (e.g., BTCUSDT)"
          onChange={(e) => console.log("Search:", e.target.value)}
        />
        <div className="timeframe-buttons">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={timeFrame === tf ? "active" : ""}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="chart-type-select">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {CHART_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default Chart;