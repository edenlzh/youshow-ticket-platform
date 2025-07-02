import React from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";

interface Props {
  seatMapData: any; // { seats: [ { x, y, label, price } ... ] }
}

const SeatMapViewer: React.FC<Props> = ({ seatMapData }) => {
  if (!seatMapData || !seatMapData.seats) return <div>No seat data</div>;

  return (
    <Stage width={800} height={600}>
      <Layer>
        {/* 舞台示例 */}
        <Rect x={300} y={20} width={200} height={30} fill="gray" cornerRadius={5} />
        <Text text="舞台/银幕" x={360} y={25} fill="white" />

        {seatMapData.seats.map((seat: any) => (
          <Circle
            key={seat.id}
            x={seat.x}
            y={seat.y}
            radius={10}
            fill="blue"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default SeatMapViewer;