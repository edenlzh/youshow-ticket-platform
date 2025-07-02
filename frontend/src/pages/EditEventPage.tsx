import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import MapSelector from "../components/MapSelector";
import PromotionsEditor from "../components/PromotionsEditor";
// 如果要编辑promotion等字段，需要在这里输入

function EditEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    address: "",
    price: 0,
    canRefund: false,
    dates: [],
    promotions: [],
    // promotion 之类的后面可加
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      if (res.data.success) {
        setFormData(res.data.event);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, canRefund: e.target.checked }));
  };

  const handleSave = async () => {
    try {
      const res = await api.put(`/events/${eventId}`, formData);
      if (res.data.success) {
        alert("演出信息已更新");
        navigate("/merchant"); // 返回商户后台
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("确定要删除该演出吗？")) return;
    try {
      const res = await api.delete(`/events/${eventId}`);
      if (res.data.success) {
        alert("演出已删除");
        navigate("/merchant");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Google Map API, 可能还要把 lat/lng 存储到 event, 并在后端也存
  const [coords, setCoords] = useState({ lat: -36.8485, lng: 174.7633 });

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>编辑演出</h1>
      {/* 基础信息 */}
      <div>
        <label>标题：</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{ width: 300 }}
        />
      </div>
      <div>
        <label>简介：</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ width: 300, height: 100 }}
        />
      </div>
      <div>
        <label>地址：</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <MapSelector
          value={coords}
          onChange={(newCoords) => {
            setCoords(newCoords);
            // 这里可以调用 Geocoding API 反查地址, 并 setFormData({ address: "xxx" })
          }}
        />
      </div>
      <div>
        <label>票价：</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>可退票：</label>
        <input
          type="checkbox"
          checked={formData.canRefund}
          onChange={handleCheckbox}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <PromotionsEditor
          promotions={formData.promotions || []}
          onChange={(list) => setFormData((prev: any) => ({ ...prev, promotions: list }))}
        />
      </div>

      {/* 多场次 dates[] 的编辑，类似创建时 */}
      {/* Promotion 等字段的编辑，后续加 */}

      <button onClick={handleSave}>保存</button>
      <button onClick={handleDelete} style={{ marginLeft: 10 }}>
        删除
      </button>
    </div>
  );
}

export default EditEventPage;
