import React, { useState } from 'react';
import './FeedSales.css';

const FeedSales = ({ feedStock, setFeedStock, salesRecords, setSalesRecords, feedRecords, setFeedRecords }) => {
  const [sellData, setSellData] = useState({
    feedType: 'เบอร์ 1',
    amount: ''
  });

  // ฟังก์ชันแก้ไขราคา
  const handleEditPrice = (id, newPrice) => {
    setFeedStock(feedStock.map(feed => 
      feed.id === id ? { ...feed, price: parseInt(newPrice) || 0 } : feed
    ));
  };

  // ดึงราคาปัจจุบันของเบอร์อาหารที่เลือก
  const getPricePerSack = (feedName) => {
    const feed = feedStock.find(f => f.name === feedName);
    return feed?.price || 0;
  };

  // คำนวณราคาย่อยตอนกำลังกรอก
  const currentSubtotal = (parseInt(sellData.amount) || 0) * getPricePerSack(sellData.feedType);

  // ฟังก์ชันขายอาหาร
  const handleSell = (e) => {
    e.preventDefault();
    if (!sellData.amount) return;

    const amountNum = parseInt(sellData.amount);
    const feed = feedStock.find(f => f.name === sellData.feedType);
    
    if (!feed || feed.stock < amountNum) {
      alert('จำนวนอาหารในสต็อกไม่เพียงพอที่จะขาย!');
      return;
    }

    const pricePerSack = feed.price || 0;
    const totalPrice = amountNum * pricePerSack;

    // ลดสต็อก
    setFeedStock(feedStock.map(f => 
      f.name === sellData.feedType ? { ...f, stock: f.stock - amountNum } : f
    ));

    // เพิ่มประวัติในหน้าขาย
    const newSale = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      feedType: sellData.feedType,
      amount: amountNum,
      pricePerSack: pricePerSack,
      totalPrice: totalPrice
    };
    setSalesRecords([newSale, ...salesRecords]);

    // เพิ่มประวัติในหน้ารวม (FeedManagement) ด้วย
    const newFeedRecord = {
      id: Date.now() + 1, // ป้องกัน ID ซ้ำ
      date: new Date().toISOString().split('T')[0],
      type: 'ขายออก',
      pen: 'ลูกค้า (ขาย)',
      feedType: sellData.feedType,
      amount: amountNum
    };
    setFeedRecords([newFeedRecord, ...feedRecords]);

    alert(`ขายอาหารสำเร็จ!\nยอดรับเงิน: ${totalPrice.toLocaleString()} บาท`);
    setSellData({ ...sellData, amount: '' });
  };

  // ล้างยอดขายทั้งหมด
  const handleClearSales = () => {
    if (window.confirm('คุณต้องการล้างประวัติการขาย และรีเซ็ตยอดเงินรวมเป็น 0 ใช่หรือไม่?')) {
      setSalesRecords([]);
    }
  };

  // คำนวณยอดรวมทั้งหมด
  const totalRevenue = salesRecords.reduce((sum, record) => sum + record.totalPrice, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">ระบบขายอาหาร</h1>
        <p className="page-subtitle">ตั้งราคาขาย คำนวณยอดเงิน และดูสรุปรายได้จากการขายอาหาร</p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* ตั้งราคาและดูสต็อก */}
          <div className="glass-card">
            <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>รายการอาหารและราคาขาย</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {feedStock.map(feed => (
                <div key={feed.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px'}}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span style={{fontWeight: 600, color: 'var(--primary-color)'}}>{feed.name}</span>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                      คงเหลือ <strong style={{color: 'var(--text-primary)'}}>{feed.stock}</strong> กระสอบ
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '0.875rem'}}>ราคา/กระสอบ:</span>
                    <input 
                      type="number" 
                      value={feed.price || ''}
                      onChange={(e) => handleEditPrice(feed.id, e.target.value)}
                      style={{width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'right'}}
                      placeholder="0"
                    />
                    <span style={{fontSize: '0.875rem'}}>฿</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ทำรายการขาย */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* สรุปยอดขายรวม */}
          <div className="glass-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)'}}>
            <h3 style={{fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>ยอดรวมรายได้จากการขาย</h3>
            <div style={{fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem', textShadow: '0 2px 10px rgba(79,70,229,0.2)'}}>
              ฿{totalRevenue.toLocaleString()}
            </div>
            <button 
              onClick={handleClearSales}
              style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600}}
            >
              ล้างยอดรวม (รีเซ็ตเป็น 0)
            </button>
          </div>

          {/* ฟอร์มขาย */}
          <div className="glass-card" style={{height: 'fit-content'}}>
            <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-green)'}}>ทำรายการขาย</h2>
            <form onSubmit={handleSell}>
              <div className="form-group">
                <label>เลือกอาหารที่ต้องการขาย</label>
                <select 
                  className="form-select"
                  value={sellData.feedType}
                  onChange={e => setSellData({...sellData, feedType: e.target.value})}
                >
                  {feedStock.map(feed => (
                    <option key={feed.id} value={feed.name}>{feed.name} (คงเหลือ {feed.stock})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>จำนวนที่ขาย (กระสอบ)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  min="1"
                  value={sellData.amount}
                  onChange={e => setSellData({...sellData, amount: e.target.value})}
                />
              </div>

              {sellData.amount && (
                <div style={{padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', marginBottom: '1rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{color: 'var(--text-secondary)'}}>ราคาต่อกระสอบ:</span>
                    <span>{getPricePerSack(sellData.feedType).toLocaleString()} บาท</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)'}}>
                    <span>ยอดที่ต้องชำระ:</span>
                    <span>{currentSubtotal.toLocaleString()} บาท</span>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem', background: 'var(--accent-green)'}}>
                ยืนยันการขาย
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>ประวัติการขาย</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ชนิดอาหาร</th>
              <th>จำนวน (กระสอบ)</th>
              <th>ราคาต่อหน่วย (บาท)</th>
              <th>ยอดเงินรวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {salesRecords.length === 0 ? (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>ยังไม่มีประวัติการขาย</td>
              </tr>
            ) : (
              salesRecords.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td style={{fontWeight: 600, color: 'var(--primary-color)'}}>{record.feedType}</td>
                  <td>{record.amount}</td>
                  <td>฿{record.pricePerSack.toLocaleString()}</td>
                  <td style={{fontWeight: 700, color: 'var(--accent-green)'}}>฿{record.totalPrice.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedSales;
