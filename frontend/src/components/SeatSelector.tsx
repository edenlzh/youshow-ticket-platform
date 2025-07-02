import React, { useState } from "react";

interface SeatSelectorProps {
  seatMapData: any;       // 从后端获取的座位图数据
  onChange: (selectedSeats: string[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ seatMapData, onChange }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // 将最新的选座结果通知父组件
  React.useEffect(() => {
    onChange(selectedSeats);
  }, [selectedSeats, onChange]);

  if (!seatMapData || !seatMapData.seats) {
    return <div>暂无座位信息</div>;
  }

  return (
    <div>
      <h3>选择座位</h3>
      {seatMapData.seats.map((seat: any) => {
        const isSelected = selectedSeats.includes(seat.id);
        return (
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            style={{
              margin: 5,
              backgroundColor: isSelected ? "red" : "green",
            }}
          >
            {seat.label}
          </button>
        );
      })}
    </div>
  );
};

export default SeatSelector;