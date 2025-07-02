// src/components/Chart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "../styles/Chart.css";
import { eurusd_1d, eurusd_1w, eurusd_1m } from "../utils/testData";

const TIMEFRAMES = ["1h", "4h", "1d", "1w", "1m"];
const CHART_TYPES = ["candlestick", "area", "line", "bar"];
const Chart = () => {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [bgColor] = useState("#ffffff");
  const [upColor] = useState("#26a69a");
  const [downColor] = useState("#ef5350");

  const [timeFrame, setTimeFrame] = useState("1d");
  const [chartType, setChartType] = useState("candlestick");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Tạo chart 1 lần
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: "solid", color: bgColor },
        textColor: "black",
      },
      rightPriceScale: { borderVisible: false },
    });

    // Tạo legend
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

    // Tạo series candlestick
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
      priceScaleId: "right",
    });
    candlestickSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.05, bottom: 0.3 },
    });

    // Tạo series volume
    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      color: upColor,
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Cập nhật legend khi di chuột
    chartRef.current.subscribeCrosshairMove(param => {
      if (!param.time || !param.seriesData.size) {
        legend.innerText = "No data";
        return;
      }
      const candle = param.seriesData.get(candlestickSeriesRef.current);
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

    // Resize observer
    resizeObserverRef.current = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    });
    resizeObserverRef.current.observe(chartContainerRef.current);

    // Cleanup khi unmount
    return () => {
      resizeObserverRef.current?.disconnect();
      chartRef.current.remove();
      if (legend && legend.parentNode) {
        legend.parentNode.removeChild(legend);
      }
    };
  }, [bgColor, upColor, downColor]);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

    let currentData;

    switch (timeFrame) {
      case "1w":
        currentData = eurusd_1w;
        break;
      case "1m":
        currentData = eurusd_1m;
        break;
      case "1h":
      case "4h":
      case "1d":
      default:
        currentData = eurusd_1d;
        break;
    }

    candlestickSeriesRef.current.setData(currentData);
    volumeSeriesRef.current.setData(
      currentData.map(({ time, volume, close, open }) => ({
        time,
        value: volume ?? 0,
        color: close > open ? upColor : downColor,
      }))
    );

    chartRef.current.timeScale().fitContent();
  }, [timeFrame, bgColor, upColor, downColor]);

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
