import React, { useRef, useEffect } from 'react';

const dates = [
  "1985-06-03",
  "1985-07-01",
  "1985-08-01",
  "1985-09-02",
  "1985-10-01",
  "1985-11-01",
  "1985-12-02",
  "1986-01-01",
  "1986-02-03"
];

const BasicDateTimeAxes = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    const margin = 60;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chuyển mảng ngày thành timestamp (ms)
    const timestamps = dates.map(d => new Date(d).getTime());

    // Tính min, max timestamp trên trục X
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    // Trục Y từ -100 đến 120
    const yMin = -100;
    const yMax = 120;

    // Hàm chuyển timestamp thành vị trí x trên canvas
    const getX = (ts) => margin + ((ts - minTimestamp) / (maxTimestamp - minTimestamp)) * (width - 2 * margin);

    // Hàm chuyển giá trị Y thành vị trí y trên canvas
    const getY = (val) => height - margin - ((val - yMin) / (yMax - yMin)) * (height - 2 * margin);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Vẽ trục X (nằm ở vị trí y = getY(0) vì Y có thể âm dương)
    const zeroY = getY(-120);
    ctx.beginPath();
    ctx.moveTo(margin, zeroY);
    ctx.lineTo(width - margin, zeroY);
    ctx.stroke();

    // Vẽ trục Y (nằm ở vị trí x = margin)
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();

    // Vẽ nhãn cho trục X (ngày tháng)
    timestamps.forEach(ts => {
      const x = getX(ts);
      const dateStr = new Date(ts).toISOString().slice(0, 10); // yyyy-mm-dd
      ctx.fillText(dateStr, x, zeroY + 5);

      // Vẽ tick nhỏ
      ctx.beginPath();
      ctx.moveTo(x, zeroY - 5);
      ctx.lineTo(x, zeroY + 5);
      ctx.stroke();
    });

    // Vẽ nhãn cho trục Y (giá trị từ -100 đến 120, mỗi 20 đơn vị)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let val = yMin; val <= yMax; val += 20) {
      const y = getY(val);
      ctx.fillText(val, margin - 10, y);

      // Vẽ tick nhỏ
      ctx.beginPath();
      ctx.moveTo(margin - 5, y);
      ctx.lineTo(margin + 5, y);
      ctx.stroke();
    }

  }, []);

  return (
    <div>
      <h3>Trục X datetime và trục Y từ -100 đến 120</h3>
      <canvas ref={canvasRef} width={700} height={400} style={{ border: '1px solid #ccc' }} />
    </div>
  );
};

export default BasicDateTimeAxes;
