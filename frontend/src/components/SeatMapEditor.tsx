import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text, Line } from "react-konva";

interface SeatData {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  price: number;
}

// "Symbol" interface
interface SymbolItem {
  id: string;
  type: "exit" | "toilet" | "bar";
  x: number;
  y: number;
}

interface Props {
  onChange: (data: any) => void;
}

const SeatMapEditor: React.FC<Props> = ({ onChange }) => {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const stageRef = useRef<any>(null);

  // 每次 seats 改变，就构建 seatMapData 并回调给父组件
  useEffect(() => {
    const seatMapData = { seats }; // 还可以加舞台坐标等
    onChange(seatMapData);
  }, [seats, onChange]);

  const addSeat = () => {
    setSeats((prev) => [
      ...prev,
      {
        id: `seat_${prev.length + 1}`,
        x: 100,
        y: 100,
        label: `S${prev.length + 1}`,
        color: "blue",
        price: 0,
      },
    ]);
  };

  const handleDragMove = (e: any, id: string) => {
    const { x, y } = e.target.position();
    setSeats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x, y } : s))
    );
  };

  const handleLabelChange = (id: string, label: string) => {
    setSeats((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  const handleColorChange = (id: string, color: string) => {
    setSeats((prev) => prev.map((s) => (s.id === id ? { ...s, color } : s)));
  };

  const handlePriceChange = (id: string, price: number) => {
    setSeats((prev) => prev.map((s) => (s.id === id ? { ...s, price } : s)));
  };

  const handleExport = () => {
    // 将当前座位配置输出为 JSON
    const data = {
      seats,
      // 还可包含舞台位置等
    };
    onChange(data);
    alert("座位图数据已导出");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <h3>座位图编辑器</h3>
      <button onClick={addSeat}>添加座位</button>{" "}
      <div style={{ width: 800, height: 600, border: "1px solid #000", marginTop: 10 }}>
        <Stage width={800} height={600}>
          <Layer>
            {/* 以50px为网格间隔，800x600画布为例 */}
            {[...Array(16)].map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 50, 800, i * 50]}
                stroke="#ccc"
                dash={[4, 4]} // 虚线
              />
            ))}
            {[...Array(16)].map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 50, 0, i * 50, 600]}
                stroke="#ccc"
                dash={[4, 4]}
              />
            ))}
          </Layer>

          <Layer>
            {/* 舞台 */}
            <Rect x={300} y={20} width={200} height={30} fill="gray" cornerRadius={5} />
            <Text text="舞台/银幕" x={360} y={25} fill="white" />

            {/* 座位 */}
            {seats.map((seat) => (
              <Circle
                key={seat.id}
                x={seat.x}
                y={seat.y}
                radius={10}
                fill={seat.color}
                draggable
                onDragMove={(e) => handleDragMove(e, seat.id)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <button onClick={handleExport}>导出座位图</button>
      
      {/* 座位信息编辑面板 */}
      <div style={{ marginTop: 10 }}>
        {seats.map((seat) => (
          <div key={seat.id} style={{ marginBottom: 5 }}>
            <label>ID: {seat.id}</label>
            <input
              style={{ marginLeft: 5 }}
              value={seat.label}
              onChange={(e) => handleLabelChange(seat.id, e.target.value)}
            />
            <input
              type="color"
              style={{ marginLeft: 5 }}
              value={seat.color}
              onChange={(e) => handleColorChange(seat.id, e.target.value)}
            />
            <input
              type="number"
              style={{ marginLeft: 5 }}
              value={seat.price}
              onChange={(e) => handlePriceChange(seat.id, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMapEditor;
