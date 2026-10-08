import React, { useState } from 'react';
import './Pens.css';

const Pens = ({ pens, setPens, feedRecords, breeders = [], setBreeders }) => {
  const [formData, setFormData] = useState({ name: '', pigCount: '' });
  const [breederData, setBreederData] = useState({ id: '', pen: '', status: 'สาว' });

  const handleAddPen = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pigCount) return;
    
    // ตรวจสอบว่าชื่อซ้ำไหม
    if (pens.some(p => p.name === formData.name)) {
      alert('มีชื่อคอกนี้อยู่แล้ว');
      return;
    }

    setPens([...pens, {
      id: Date.now(),
      name: formData.name,
      pigCount: parseInt(formData.pigCount)
    }]);
    setFormData({ name: '', pigCount: '' });
    alert('เพิ่มคอกใหม่เรียบร้อยแล้ว');
  };

  const handleDeletePen = (id) => {
    if(window.confirm('คุณต้องการลบคอกนี้ใช่หรือไม่?')) {
      setPens(pens.filter(p => p.id !== id));
    }
  };

  const handleAdjustPigCount = (id, amount) => {
    setPens(pens.map(p => {
      if (p.id === id) {
        return { ...p, pigCount: Math.max(0, p.pigCount + amount) };
      }
      return p;
    }));
  };

  // คำนวณอาหารที่แต่ละคอกกินไป
  const getFeedConsumed = (penName) => {
    // หาประวัติเบิกใช้ของคอกนี้
    const consumed = feedRecords.filter(r => r.type === 'เบิกใช้' && r.pen === penName);
    const summary = {};
    consumed.forEach(r => {
      if (!summary[r.feedType]) summary[r.feedType] = 0;
      summary[r.feedType] += r.amount;
    });
    return summary;
  };

  const totalPigs = pens.reduce((sum, pen) => sum + pen.pigCount, 0);

  // คำนวณอาหารที่กินรวมทั้งหมดทุกคอก แยกตามเบอร์
  const getTotalFeedConsumed = () => {
    const consumed = feedRecords.filter(r => r.type === 'เบิกใช้');
    const summary = {};
    consumed.forEach(r => {
      if (!summary[r.feedType]) summary[r.feedType] = 0;
      summary[r.feedType] += r.amount;
    });
    return summary;
  };
  
  const totalFeedEntries = Object.entries(getTotalFeedConsumed());

  const handleAddBreeder = (e) => {
    e.preventDefault();
    if (!breederData.id) return;
    
    if (breeders.some(b => b.id === breederData.id)) {
      alert('มีรหัส/เบอร์หูแม่พันธุ์นี้อยู่แล้ว');
      return;
    }

    setBreeders([...breeders, {
      internalId: Date.now(),
      id: breederData.id,
      pen: breederData.pen || '-',
      status: breederData.status
    }]);
    setBreederData({ id: '', pen: '', status: 'สาว' });
    alert('เพิ่มแม่พันธุ์ใหม่เรียบร้อยแล้ว');
  };

  const handleDeleteBreeder = (internalId) => {
    if(window.confirm('คุณต้องการลบแม่พันธุ์นี้ใช่หรือไม่?')) {
      setBreeders(breeders.filter(b => b.internalId !== internalId));
    }
  };
  
  const handleUpdateBreederStatus = (internalId, newStatus) => {
    setBreeders(breeders.map(b => b.internalId === internalId ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">จัดการคอกและแม่พันธุ์</h1>
        <p className="page-subtitle">เพิ่มคอกใหม่ ระบุจำนวนหมู ดูปริมาณอาหารที่กิน และจัดการรายชื่อแม่พันธุ์</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        {/* ฟอร์มเพิ่มคอก */}
        <div className="glass-card" style={{gridColumn: 'span 1', height: 'fit-content'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>เพิ่มคอกใหม่</h2>
          <form onSubmit={handleAddPen}>
            <div className="form-group">
              <label>ชื่อคอก / หมายเลขคอก</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="เช่น คอก 3"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>จำนวนหมูในคอก (ตัว)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0"
                min="1"
                value={formData.pigCount}
                onChange={e => setFormData({...formData, pigCount: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem'}}>
              เพิ่มคอก
            </button>
          </form>
          
          <div style={{marginTop: '2rem', padding: '1rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px'}}>
            <h3 style={{fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '0.5rem'}}>สรุปข้อมูลรวม</h3>
            <p>จำนวนคอกทั้งหมด: <strong>{pens.length} คอก</strong></p>
            <p>จำนวนหมูทั้งหมด: <strong>{totalPigs} ตัว</strong></p>
            
            <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(79, 70, 229, 0.2)'}}>
              <p style={{fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>
                ยอดกินอาหารรวมทุกคอก (สะสม)
              </p>
              {totalFeedEntries.length === 0 ? (
                <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>- ยังไม่มีข้อมูลการกิน</p>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  {totalFeedEntries.map(([feedType, amount]) => (
                    <div key={feedType} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                      <span>{feedType}:</span>
                      <strong style={{color: 'var(--primary-color)'}}>{amount} กระสอบ</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ตารางคอกหมู */}
        <div className="glass-card" style={{gridColumn: 'span 2'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>รายชื่อคอกและอาหารที่กินไป</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ชื่อคอก</th>
                <th>จำนวนหมู (ตัว)</th>
                <th>อาหารที่เบิกไปใช้แล้ว (สะสม)</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pens.map(pen => {
                const consumed = getFeedConsumed(pen.name);
                const consumedEntries = Object.entries(consumed);

                return (
                  <tr key={pen.id}>
                    <td style={{fontWeight: 600}}>{pen.name}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <button 
                          onClick={() => handleAdjustPigCount(pen.id, -1)}
                          style={{width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        >
                          -
                        </button>
                        <span style={{fontWeight: 600, minWidth: '30px', textAlign: 'center'}}>{pen.pigCount}</span>
                        <button 
                          onClick={() => handleAdjustPigCount(pen.id, 1)}
                          style={{width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {consumedEntries.length === 0 ? (
                        <span style={{color: 'var(--text-secondary)'}}>ยังไม่มีการเบิกอาหาร</span>
                      ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                          {consumedEntries.map(([feedType, amount]) => (
                            <span key={feedType} style={{fontSize: '0.85rem', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '4px'}}>
                              {feedType}: <strong style={{color: 'var(--accent-yellow)'}}>{amount} กระสอบ</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeletePen(pen.id)}
                        style={{background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', textDecoration: 'underline'}}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ส่วนจัดการแม่พันธุ์ */}
      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{gridColumn: 'span 1', height: 'fit-content'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-green)'}}>เพิ่มแม่พันธุ์</h2>
          <form onSubmit={handleAddBreeder}>
            <div className="form-group">
              <label>รหัสแม่พันธุ์ / เบอร์หู</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="เช่น M-001"
                value={breederData.id}
                onChange={e => setBreederData({...breederData, id: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>คอกที่อยู่ (ถ้ามี)</label>
              <select 
                className="form-select"
                value={breederData.pen}
                onChange={e => setBreederData({...breederData, pen: e.target.value})}
              >
                <option value="">-- ไม่ระบุ --</option>
                {pens.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>สถานะเริ่มต้น</label>
              <select 
                className="form-select"
                value={breederData.status}
                onChange={e => setBreederData({...breederData, status: e.target.value})}
              >
                <option value="สาว">สาว (ยังไม่เคยผสม)</option>
                <option value="ว่าง">ว่าง (รอผสม)</option>
                <option value="ท้อง">ท้อง</option>
                <option value="ให้นม">ให้นมลูก</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '0.5rem', background: 'var(--accent-green)'}}>
              เพิ่มแม่พันธุ์
            </button>
          </form>
        </div>

        <div className="glass-card" style={{gridColumn: 'span 2'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>รายชื่อแม่พันธุ์ ({breeders.length} ตัว)</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>เบอร์หู</th>
                <th>คอกที่อยู่</th>
                <th>สถานะปัจจุบัน</th>
                <th>เปลี่ยนสถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {breeders.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>ยังไม่มีข้อมูลแม่พันธุ์</td></tr>
              ) : (
                breeders.map(b => (
                  <tr key={b.internalId}>
                    <td style={{fontWeight: 600, color: 'var(--primary-color)'}}>{b.id}</td>
                    <td>{b.pen}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                        background: b.status === 'ท้อง' ? 'rgba(245, 158, 11, 0.1)' : b.status === 'สาว' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                        color: b.status === 'ท้อง' ? 'var(--accent-yellow)' : b.status === 'สาว' ? 'var(--accent-green)' : 'var(--text-secondary)'
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-select" 
                        style={{padding: '4px 8px', fontSize: '0.875rem', minWidth: '100px'}}
                        value={b.status}
                        onChange={e => handleUpdateBreederStatus(b.internalId, e.target.value)}
                      >
                        <option value="สาว">สาว</option>
                        <option value="ว่าง">ว่าง</option>
                        <option value="ท้อง">ท้อง</option>
                        <option value="ให้นม">ให้นม</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteBreeder(b.internalId)}
                        style={{background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', textDecoration: 'underline'}}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pens;
