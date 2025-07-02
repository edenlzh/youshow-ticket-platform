function PromotionsEditor({ promotions, onChange }: {
    promotions: { code: string; discountRate: number }[];
    onChange: (list: { code: string; discountRate: number }[]) => void;
  }) {
    const handleAdd = () => {
      onChange([...promotions, { code: "", discountRate: 0.1 }]);
    };
    const handleRemove = (index: number) => {
      onChange(promotions.filter((_, i) => i !== index));
    };
  
    const handleChangeField = (index: number, field: keyof { code: string; discountRate: number }, value: any) => {
      const newArr = [...promotions];
      newArr[index] = { ...newArr[index], [field]: value };
      onChange(newArr);
    };
  
    return (
      <div>
        <h4>折扣码设置</h4>
        {promotions.map((p, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <input
              placeholder="Code"
              value={p.code}
              onChange={(e) => handleChangeField(idx, "code", e.target.value)}
              style={{ width: 100 }}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Discount (0~1)"
              value={p.discountRate}
              onChange={(e) => handleChangeField(idx, "discountRate", parseFloat(e.target.value))}
              style={{ width: 70, marginLeft: 5 }}
            />
            <button onClick={() => handleRemove(idx)}>删除</button>
          </div>
        ))}
        <button onClick={handleAdd}>添加折扣码</button>
      </div>
    );
}

export default PromotionsEditor