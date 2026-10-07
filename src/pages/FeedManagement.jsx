import React, { useState } from 'react';

const FeedManagement = ({ feedStock, setFeedStock, feedRecords, setFeedRecords, pens }) => {


  const [formData, setFormData] = useState({
    pen: '',
    feedType: 'เบอร์ 1',
    amount: ''
  });

  const [addStockData, setAddStockData] = useState({
    feedType: 'เบอร์ 1',
    amount: ''
  });

  // ฟังก์ชันเบิกอาหาร (ลดสต็อก)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pen || !formData.amount) return;

    const amountNum = parseInt(formData.amount);
    
    // ตรวจสอบสต็อก
    const currentStock = feedStock.find(f => f.name === formData.feedType)?.stock || 0;
    if (currentStock < amountNum) {
      alert('จำนวนอาหารในสต็อกไม่เพียงพอ!');
      return;
    }

    // ลดสต็อก
    setFeedStock(feedStock.map(feed => 
      feed.name === formData.feedType ? { ...feed, stock: feed.stock - amountNum } : feed
    ));

    // เพิ่มประวัติ
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'เบิกใช้',
      pen: formData.pen,
      feedType: formData.feedType,
      amount: amountNum
    };
    
    setFeedRecords([newRecord, ...feedRecords]);
    alert('บันทึกการเบิกอาหารเรียบร้อยแล้ว');
    setFormData({ ...formData, pen: '', amount: '' });
  };

  // ฟังก์ชันรับอาหารเข้าคลัง (เพิ่มสต็อก)
  const handleAddStock = (e) => {
    e.preventDefault();
    if (!addStockData.amount) return;

    const amountNum = parseInt(addStockData.amount);

    // เพิ่มสต็อก
    setFeedStock(feedStock.map(feed => 
      feed.name === addStockData.feedType ? { ...feed, stock: feed.stock + amountNum } : feed
    ));

    // เพิ่มประวัติ
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'รับเข้า',
      pen: '-',
      feedType: addStockData.feedType,
      amount: amountNum
    };
    
    setFeedRecords([newRecord, ...feedRecords]);
    alert('เพิ่มอาหารเข้าคลังเรียบร้อยแล้ว');
    setAddStockData({ ...addStockData, amount: '' });
  };

  // ฟังก์ชันปรับสต็อกแบบด่วน (+/-)
  const handleAdjustStock = (id, amount) => {
    setFeedStock(feedStock.map(f => {
      if (f.id === id) {
        const newStock = Math.max(0, f.stock + amount);
        return { ...f, stock: newStock };
      }
      return f;
    }));
  };

  const handleClearStock = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างสต็อกอาหารเบอร์นี้ให้เป็น 0?')) {
      setFeedStock(feedStock.map(f => f.id === id ? { ...f, stock: 0 } : f));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">จัดการอาหารหมู</h1>
        <p className="page-subtitle">ดูยอดคงเหลือ นำอาหารเข้าคลัง และบันทึกการเบิกใช้อาหารแต่ละคอก</p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* สต็อกอาหารคงเหลือ */}
          <div className="glass-card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>สต็อกอาหารคงเหลือ</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {feedStock.map(feed => (
                <div key={feed.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px'}}>
                  <span style={{fontWeight: 500}}>{feed.name}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <button 
                      onClick={() => handleAdjustStock(feed.id, -1)}
                      style={{width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      -
                    </button>
                    <span style={{background: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.875rem', fontWeight: 600, minWidth: '80px', textAlign: 'center'}}>
                      {feed.stock} กระสอบ
                    </span>
                    <button 
                      onClick={() => handleAdjustStock(feed.id, 1)}
                      style={{width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleClearStock(feed.id)}
                      style={{marginLeft: '4px', padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600}}
                    >
                      ล้าง (0)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* เพิ่มอาหารเข้าคลัง */}
          <div className="glass-card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-green)'}}>+ รับอาหารเข้าคลัง</h2>
            <form onSubmit={handleAddStock}>
              <div className="form-group">
                <label>เบอร์อาหารที่รับเข้า</label>
                <select 
                  className="form-select"
                  value={addStockData.feedType}
                  onChange={e => setAddStockData({...addStockData, feedType: e.target.value})}
                >
                  {feedStock.map(feed => (
                    <option key={feed.id} value={feed.name}>{feed.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>จำนวนที่รับเข้า (กระสอบ)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  min="1"
                  value={addStockData.amount}
                  onChange={e => setAddStockData({...addStockData, amount: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem', background: 'var(--accent-green)'}}>
                ยืนยันการรับเข้า
              </button>
            </form>
          </div>
        </div>

        {/* เบิกอาหารไปใช้ */}
        <div className="glass-card" style={{height: 'fit-content'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-yellow)'}}>- บันทึกการเบิกอาหารให้หมู</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>คอกหมูที่เบิก</label>
              <select 
                className="form-select"
                value={formData.pen}
                onChange={e => setFormData({...formData, pen: e.target.value})}
              >
                <option value="">-- เลือกคอกหมู --</option>
                {pens.map(pen => (
                  <option key={pen.id} value={pen.name}>{pen.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>เบอร์อาหารที่เบิก</label>
              <select 
                className="form-select"
                value={formData.feedType}
                onChange={e => setFormData({...formData, feedType: e.target.value})}
              >
                {feedStock.map(feed => (
                  <option key={feed.id} value={feed.name}>{feed.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>จำนวน (กระสอบ)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0"
                min="1"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem', background: 'var(--accent-yellow)', color: '#000'}}>
              ยืนยันการเบิกอาหาร
            </button>
          </form>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>ประวัติการเข้า-ออกของอาหาร</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ประเภท</th>
              <th>ชนิดอาหาร</th>
              <th>คอกที่เบิก</th>
              <th>จำนวน (กระสอบ)</th>
            </tr>
          </thead>
          <tbody>
            {feedRecords.map(record => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: record.type === 'รับเข้า' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: record.type === 'รับเข้า' ? 'var(--accent-green)' : 'var(--accent-yellow)'
                  }}>
                    {record.type}
                  </span>
                </td>
                <td>{record.feedType}</td>
                <td>{record.pen}</td>
                <td style={{
                  fontWeight: 600, 
                  color: record.type === 'รับเข้า' ? 'var(--accent-green)' : 'var(--accent-yellow)'
                }}>
                  {record.type === 'รับเข้า' ? '+' : '-'}{record.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedManagement;
