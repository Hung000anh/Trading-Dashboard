// utils/testData.js

function generateDailyData(startDateStr, days, startPrice) {
  const data = [];
  let currentPrice = startPrice;
  let currentDate = new Date(startDateStr);

  for (let i = 0; i < days; i++) {
    const open = currentPrice;
    // Giá dao động +/- 5% random
    const changePercent = (Math.random() - 0.5) * 0.1;
    const close = Math.max(1, open * (1 + changePercent));
    const high = Math.max(open, close) * (1 + Math.random() * 0.05);
    const low = Math.min(open, close) * (1 - Math.random() * 0.05);
    const volume = Math.floor(1000 + Math.random() * 2000);

    data.push({
      time: currentDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    // Next day
    currentPrice = close;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

function generateWeeklyData(startDateStr, weeks, startPrice) {
  const data = [];
  let currentPrice = startPrice;
  let currentDate = new Date(startDateStr);

  for (let i = 0; i < weeks; i++) {
    const open = currentPrice;
    const changePercent = (Math.random() - 0.5) * 0.1;
    const close = Math.max(1, open * (1 + changePercent));
    const high = Math.max(open, close) * (1 + Math.random() * 0.05);
    const low = Math.min(open, close) * (1 - Math.random() * 0.05);
    const volume = Math.floor(7000 + Math.random() * 4000);

    data.push({
      time: currentDate.toISOString().slice(0, 10),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });

    // Next week
    currentPrice = close;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return data;
}

export const eurusd_1d = generateDailyData("2024-01-01", 400, 100); // 400 ngày ~ 13 tháng
export const eurusd_1w = generateWeeklyData("2024-01-01", 60, 100); // 60 tuần ~ hơn 1 năm
export const eurusd_1m = [
  { time: "2024-01-01", open: 100, high: 130, low: 90, close: 120, volume: 55000 },
  { time: "2024-02-01", open: 120, high: 140, low: 110, close: 135, volume: 48000 },
  { time: "2024-03-01", open: 135, high: 150, low: 130, close: 145, volume: 50000 },
  { time: "2024-04-01", open: 145, high: 155, low: 140, close: 150, volume: 47000 },
  { time: "2024-05-01", open: 150, high: 160, low: 145, close: 158, volume: 52000 },
  { time: "2024-06-01", open: 158, high: 165, low: 150, close: 160, volume: 53000 },
  { time: "2024-07-01", open: 160, high: 170, low: 155, close: 165, volume: 55000 },
  { time: "2024-08-01", open: 165, high: 175, low: 160, close: 170, volume: 56000 },
];