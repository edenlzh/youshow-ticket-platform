import React, { useEffect, useState } from "react";
import api from "../api";

function MerchantDashboard() {
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
    <div style={{ padding: "20px" }}>
      <h1>商户后台 - 演出管理</h1>
      <a href="/merchant/create-event">创建新演出</a>
      <ul>
        {events.map((evt) => (
          <li key={evt._id}>
            {evt.title} - {evt.startTime}
            <a href={`/merchant/edit-event/${evt._id}`}>编辑</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MerchantDashboard;
