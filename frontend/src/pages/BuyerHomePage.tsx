import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function BuyerHomePage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await api.get("/events");
    if (res.data.success) {
      setEvents(res.data.events);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Youshow - 购票平台</h1>
      {events.map((evt) => (
        <div key={evt._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h2>{evt.title}</h2>
          <p>{evt.description}</p>
          {/* 遍历 evt.dates 数组 */}
          {evt.dates?.map((d: any, idx: number) => (
            <p key={idx}>
              时间段 {idx + 1}：
              {new Date(d.startTime).toLocaleString()} ~ {new Date(d.endTime).toLocaleString()}
            </p>
          ))}
          <p>票价：{evt.price}</p>
          <Link to={`/events/${evt._id}`}>查看详情 / 购买</Link>
        </div>
      ))}
    </div>
  );
}

export default BuyerHomePage;
