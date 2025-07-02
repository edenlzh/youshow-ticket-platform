import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function EventListPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>所有演出列表</h1>
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
          <a href={`/events/${evt._id}`}>查看详情 / 购买</a>
        </div>
      ))}
    </div>
  );
}

export default EventListPage;