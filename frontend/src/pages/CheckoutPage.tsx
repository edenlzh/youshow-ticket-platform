import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");
  const dateIndex = parseInt(searchParams.get("dateIndex") || "0", 10);

  const [seatMap, setSeatMap] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [promoCode, setPromoCode] = useState("");
  const [discountRate, setDiscountRate] = useState(1);

  useEffect(() => {
    if (eventId) {
      loadSeatMap(eventId);
    }
  }, [eventId]);

  const loadSeatMap = async (id: string) => {
    const res = await api.get(`/seatmaps/event/${id}`);
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

  // 当用户点击“应用优惠”按钮
  const handleApplyPromo = async () => {
    // 你可以在前端先加载 event.promotions, 
    // or 让后端验证
    const eventRes = await api.get(`/events/${eventId}`);
    if (eventRes.data.success) {
      const promotions = eventRes.data.event.promotions || [];
      const promo = promotions.find((p: any) => p.code === promoCode);
      if (promo) {
        setDiscountRate(promo.discountRate);
        alert(`已应用优惠码 ${promoCode}, 折扣率: ${promo.discountRate * 100}%`);
      } else {
        alert("优惠码无效");
      }
    }
  };

  const handlePay = async () => {
    // 订单信息(简化示例)
    // 在计算 totalPrice 时
    const basePrice = selectedSeats.length * 100;  // or whatever
    const totalPrice = basePrice * discountRate;
    const userEmail = "testuser@mail.com"; // 或从登录信息获取

    const res = await api.post("/orders", {
      eventId, // 记录哪个演出
      userEmail,
      seats: selectedSeats,
      totalPrice,
      dateIndex, // 可加上你要的场次信息
    });
    if (res.data.success) {
      alert("购票成功！请查收邮箱中的PDF电子票");
      // 你也可以 navigate('/') 或刷新
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>结算页面 - 场次 {dateIndex + 1}</h1>

      {seatMap ? (
        <div>
          <h2>{seatMap.name}</h2>
          {/* 这里渲染座位点，可做成一个SeatSelector组件 or inline */}
          {seatMap.seatMapData?.seats?.map((seat: any) => (
            <button
              key={seat.id}
              style={{
                margin: 5,
                backgroundColor: selectedSeats.includes(seat.id)
                  ? "red"
                  : "green",
              }}
              onClick={() => handleSelectSeat(seat.id)}
            >
              {seat.label}
            </button>
          ))}

          <div style={{ marginTop: 20 }}>
            已选座位：{selectedSeats.join(", ")}
          </div>
          <button onClick={handlePay} disabled={selectedSeats.length === 0}>
            确认支付
          </button>
        </div>
      ) : (
        <div>座位图加载中...</div>
      )}
    </div>
  );
}

export default CheckoutPage;
