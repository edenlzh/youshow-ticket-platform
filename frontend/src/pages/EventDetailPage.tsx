import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import SeatMapViewer from "../components/SeatMapViewer";

function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [seatMap, setSeatMap] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    loadEvent();
    loadSeatMap();
  }, [eventId]);

  // 点击“购买”时，带上 dateIndex 跳到 checkout
  const handleBuy = (dateIndex: number) => {
  navigate(`/checkout?eventId=${eventId}&dateIndex=${dateIndex}`);
  };

  const loadEvent = async () => {
    const res = await api.get(`/events/${eventId}`);
    if (res.data.success) {
      setEvent(res.data.event);
    }
  };

  const loadSeatMap = async () => {
    const res = await api.get(`/seatmaps/event/${eventId}`);
    if (res.data.success) {
      setSeatMap(res.data.seatMap);
    }
  };

  const handleSelectSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { eventId, seats: selectedSeats } });
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
  
      {event.dates?.map((d: any, idx: number) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <p>
            场次 {idx + 1}: {new Date(d.startTime).toLocaleString()} ~ {new Date(d.endTime).toLocaleString()}
          </p>
          <button onClick={() => handleBuy(idx)}>
            购买（场次 {idx + 1}）
          </button>
        </div>
      ))}
  
      <p>地址：{event.address}</p>
      <p>票价：{event.price}</p>
      {/* <p>能否退票: {event.canRefund}</p> */}
      {/* 座位图 */}
      {seatMap ? (
        <SeatMapViewer seatMapData={seatMap.seatMapData} />
      ) : (
        <p>加载座位图中...</p>
      )}
      ...
    </div>
  );
}

export default EventDetailPage;
