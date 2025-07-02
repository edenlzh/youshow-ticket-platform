import React, { useState } from "react";
import api from "../api";
import SeatMapEditor from "../components/SeatMapEditor";
import DatePicker from "react-datepicker";
import MapSelector from "../components/MapSelector";
import PromotionsEditor from "../components/PromotionsEditor";
import "react-datepicker/dist/react-datepicker.css";

// 定义一个多日期的类型
interface IDateRange {
  startTime: Date | null;
  endTime: Date | null;
}

function EventCreatePage() {
  // 原先表单数据去掉了单一的 startTime/endTime
  // 保留标题、简介、地址、票价、是否支持退票等
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    price: 0,
    canRefund: false,
    promotions: [],
  });

  // 多日期数组，每个元素是 { startTime, endTime }
  const [dates, setDates] = useState<IDateRange[]>([
    { startTime: null, endTime: null },
  ]);

  // 用于保存座位图（由 SeatMapEditor 返回）
  const [seatMapData, setSeatMapData] = useState<any>({});

  /**
   * 处理除复选框外的表单输入
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 处理复选框（是否退票）
   */
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, canRefund: e.target.checked }));
  };

  /**
   * 添加一个新的日期区间
   */
  const handleAddDateRange = () => {
    setDates((prev) => [...prev, { startTime: null, endTime: null }]);
  };

  /**
   * 删除某个日期区间
   */
  const handleRemoveDateRange = (index: number) => {
    setDates((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 提交创建演出 & 座位图
   */
  const handleCreateEvent = async () => {
    try {
      // 1) 整理日期数组，仅提交用户已选择完成的日期
      const finalDates = dates
        .filter((d) => d.startTime && d.endTime)
        .map((d) => ({
          startTime: d.startTime,
          endTime: d.endTime,
        }));

      // 2) 组装要发送的 payload
      const payload = {
        ...formData,
        dates: finalDates, // 替换掉原先的单一时间
      };

      // 3) 向后端创建演出
      const res = await api.post("/events", payload);
      if (res.data.success) {
        const createdEvent = res.data.event;

        // 4) 创建座位图(可选，如果不需要立即创建可省略)
        const seatRes = await api.post("/seatmaps", {
          eventId: createdEvent._id,
          seatMapData,
          name: `${createdEvent.title}座位图`,
        });

        if (seatRes.data.success) {
          alert("演出已创建成功");
          // 重置表单或跳转
          setFormData({
            title: "",
            description: "",
            address: "",
            price: 0,
            canRefund: false,
            promotions: [],
          });
          setDates([{ startTime: null, endTime: null }]);
          setSeatMapData({});
        }
      }
    } catch (error: any) {
      alert(`创建失败: ${error.message}`);
    }
  };

  // Google Map API, 可能还要把 lat/lng 存储到 event, 并在后端也存
  const [coords, setCoords] = useState({ lat: -36.8485, lng: 174.7633 });

  return (
    <div style={{ padding: "20px" }}>
      <h1>创建演出</h1>

      {/* 标题 */}
      <div style={{ marginBottom: "10px" }}>
        <label>标题：</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{ width: "300px", marginLeft: "8px" }}
        />
      </div>

      {/* 简介 */}
      <div style={{ marginBottom: "10px" }}>
        <label>简介：</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ width: "300px", height: "80px", marginLeft: "8px" }}
        />
      </div>

      {/* 演出地址 */}
      <div style={{ marginBottom: "10px" }}>
        <label>地址：</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          style={{ width: "300px", marginLeft: "8px" }}
        />
        <MapSelector
          value={coords}
          onChange={(newCoords) => {
            setCoords(newCoords);
            // 这里可以调用 Geocoding API 反查地址, 并 setFormData({ address: "xxx" })
          }}
        />
      </div>

      {/* 票价 */}
      <div style={{ marginBottom: "10px" }}>
        <label>票价：</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          style={{ width: "100px", marginLeft: "8px" }}
        />
      </div>

      {/* 是否支持退票 */}
      <div style={{ marginBottom: "10px" }}>
        <label>是否支持退票：</label>
        <input
          type="checkbox"
          checked={formData.canRefund}
          onChange={handleCheckbox}
          style={{ marginLeft: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <PromotionsEditor
          promotions={formData.promotions || []}
          onChange={(list) => setFormData((prev: any) => ({ ...prev, promotions: list }))}
        />
      </div>

      <hr />

      {/* 多日期场次 */}
      <h2>演出场次设置</h2>
      {dates.map((range, idx) => (
        <div key={idx} style={{ marginBottom: "10px" }}>
          <label>开始时间：</label>
          <span style={{ marginRight: "8px" }}>
            <DatePicker
              selected={range.startTime}
              onChange={(date) => {
                const newDates = [...dates];
                newDates[idx].startTime = date;
                setDates(newDates);
              }}
              selectsStart
              startDate={range.startTime}
              endDate={range.endTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="选择开始时间"
            />
          </span>

          <label style={{ marginLeft: "10px" }}>结束时间：</label>
          <span style={{ marginRight: "8px" }}>
            <DatePicker
              selected={range.endTime}
              onChange={(date) => {
                const newDates = [...dates];
                newDates[idx].endTime = date;
                setDates(newDates);
              }}
              selectsEnd
              startDate={range.startTime}
              endDate={range.endTime}
              minDate={range.startTime || undefined}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="选择结束时间"
            />
          </span>

          {/* 删除按钮 */}
          {idx > 0 && (
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleRemoveDateRange(idx)}
            >
              删除
            </button>
          )}
        </div>
      ))}

      {/* 添加更多场次 */}
      <button onClick={handleAddDateRange}>+ 添加更多场次</button>

      <hr />

      {/* 座位图编辑器 */}
      <h2>座位图编辑</h2>
      <SeatMapEditor onChange={(data) => setSeatMapData(data)} />

      <hr />

      {/* 提交按钮 */}
      <button onClick={handleCreateEvent}>提交</button>
    </div>
  );
}

export default EventCreatePage;
