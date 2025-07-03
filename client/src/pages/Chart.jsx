// src/components/Chart.jsx
import { useState } from "react";
import "../styles/Chart.css";
import { eurusd_1d, eurusd_1w, eurusd_1m } from "../utils/testData";
import { useFinancialChart } from "../hooks/useFinancialChart";

// Các lựa chọn có sẵn cho biểu đồ
const TIMEFRAMES = ["4h", "1d", "1w", "1m"];
const CHART_TYPES = ["candlestick", "area", "line", "bar"];
const RANGES = ["3M", "6M", "1Y", "ALL"];

// Mapping dữ liệu mẫu tương ứng với từng timeframe
const TIMEFRAME_DATA = {
  "1d": eurusd_1d,
  "1w": eurusd_1w,
  "1m": eurusd_1m,
};

const Chart = () => {
  // State lưu trạng thái lựa chọn người dùng
  const [timeFrame, setTimeFrame] = useState("1d");
  const [range, setRange] = useState("ALL");
  const [chartType, setChartType] = useState("candlestick");

  // Lấy dữ liệu phù hợp với timeframe hiện tại
  const allData = TIMEFRAME_DATA[timeFrame] || eurusd_1d;

  // Hook custom quản lý chart, nhận tham số để cập nhật biểu đồ
  const { chartContainerRef } = useFinancialChart({
    timeFrame,
    range,
    chartType,
    data: allData,
  });

  return (
    <div className="chart-financial">
      {/* Toolbar chứa thanh tìm kiếm, chọn timeframe, chọn kiểu biểu đồ */}
      <div className="chart-toolbar">
        <input
          type="text"
          placeholder="Search symbol (e.g., BTCUSDT)"
          onChange={(e) => console.log("Search:", e.target.value)}
          aria-label="Search symbol"
        />

        {/* Nút chọn timeframe */}
        <div className="timeframe-buttons" role="group" aria-label="Select timeframe">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={timeFrame === tf ? "active" : ""}
              aria-pressed={timeFrame === tf}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dropdown chọn loại biểu đồ */}
        <div className="chart-type-select">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            aria-label="Select chart type"
          >
            {CHART_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Container chính để render biểu đồ */}
      <div ref={chartContainerRef} className="chart-container" aria-label="Financial chart" />

      {/* Nút chọn khoảng thời gian (range) dữ liệu */}
      <div className="range-buttons" role="group" aria-label="Select data range">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={range === r ? "active" : ""}
            aria-pressed={range === r}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chart;
