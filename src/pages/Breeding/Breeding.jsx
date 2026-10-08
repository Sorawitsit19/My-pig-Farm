import React, { useState } from 'react';
import './Breeding.css';

const Breeding = ({ records, setRecords }) => {

  const [formData, setFormData] = useState({
    motherId: '',
    matingDate: ''
  });

  const calculateExpectedFarrowing = (dateString) => {
    // หมูตั้งท้องประมาณ 114 วัน (3 เดือน 3 สัปดาห์ 3 วัน)
    const mating = new Date(dateString);
    mating.setDate(mating.getDate() + 114);
    return mating.toISOString().split('T')[0];
  };

  const calculateDaysLeft = (expectedDateStr) => {
    const expected = new Date(expectedDateStr);
    const today = new Date();
    const diffTime = expected - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.motherId || !formData.matingDate) return;

    // หาประวัติที่ยังไม่คลอดของแม่พันธุ์ตัวนี้
    const activeRecordIndex = records.findIndex(r => r.motherId === formData.motherId && !r.actualDate);

    if (activeRecordIndex !== -1) {
      const oldRecord = records[activeRecordIndex];
      const oldDate = new Date(oldRecord.matingDate);
      const newDate = new Date(formData.matingDate);
      const diffTime = newDate - oldDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // ถ้าเป็นอดีต (ใส่วันที่ผิด)
      if (diffDays < 0) {
        alert('วันที่ผสมซ้ำต้องไม่ก่อนวันที่ผสมครั้งแรกครับ');
        return;
      }

      if (diffDays <= 7) {
        alert('พบการผสมซ้ำภายใน 7 วัน! ระบบจะคำนวณวันคลอดใหม่ โดยเริ่มนับจาก "วันถัดไปหลังจากผสมซ้ำ" ไปอีก 114 วัน');
        // วันถัดไปหลังจากผสมซ้ำ
        const nextDayAfterRepeat = new Date(formData.matingDate);
        nextDayAfterRepeat.setDate(nextDayAfterRepeat.getDate() + 1);
        const expectedDate = calculateExpectedFarrowing(nextDayAfterRepeat.toISOString().split('T')[0]);
        
        const updatedRecords = [...records];
        updatedRecords[activeRecordIndex] = {
          ...oldRecord,
          isRepeated: true,
          repeatDate: formData.matingDate,
          expectedDate: expectedDate,
          daysLeft: calculateDaysLeft(expectedDate)
        };
        setRecords(updatedRecords);
        setFormData({ motherId: '', matingDate: '' });
        return;
      } else {
        alert('พบการผสมซ้ำเกิน 7 วัน! ระบบจะ "เริ่มนับวันคลอดใหม่จากวันนี้"');
        const expectedDate = calculateExpectedFarrowing(formData.matingDate);
        const updatedRecords = [...records];
        updatedRecords[activeRecordIndex] = {
          ...oldRecord,
          matingDate: formData.matingDate,
          expectedDate: expectedDate,
          daysLeft: calculateDaysLeft(expectedDate),
          isRepeated: false,
          repeatDate: null
        };
        setRecords(updatedRecords);
        setFormData({ motherId: '', matingDate: '' });
        return;
      }
    }

    // กรณีเป็นแม่พันธุ์ใหม่ หรือแม่พันธุ์เดิมที่คลอดไปแล้ว
    const expectedDate = calculateExpectedFarrowing(formData.matingDate);
    const daysLeft = calculateDaysLeft(expectedDate);

    const newRecord = {
      id: Date.now(),
      motherId: formData.motherId,
      matingDate: formData.matingDate,
      expectedDate: expectedDate,
      daysLeft: daysLeft,
      actualDate: null,
      isRepeated: false
    };

    setRecords([...records, newRecord]);
    alert('บันทึกข้อมูลการผสมพันธุ์เรียบร้อย');
    setFormData({ motherId: '', matingDate: '' });
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('คุณต้องการลบกำหนดการนี้ใช่หรือไม่?')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">ระบบสืบพันธุ์และการคลอด</h1>
        <p className="page-subtitle">บันทึกวันผสมพันธุ์ คำนวณวันคลอดอัตโนมัติ (114 วัน)</p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>เพิ่มข้อมูลการผสมพันธุ์</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>รหัสแม่พันธุ์ / เบอร์หู</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="เช่น M-005"
                value={formData.motherId}
                onChange={e => setFormData({...formData, motherId: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>วันที่ผสมพันธุ์</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.matingDate}
                onChange={e => setFormData({...formData, matingDate: e.target.value})}
              />
            </div>
            {formData.matingDate && (
              <div style={{padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '1rem', color: 'var(--accent-green)'}}>
                <strong>ประมาณการวันคลอด: </strong> 
                {calculateExpectedFarrowing(formData.matingDate)}
              </div>
            )}
            <button type="submit" className="btn-primary" style={{width: '100%'}}>
              บันทึกข้อมูล
            </button>
          </form>
        </div>

        <div className="glass-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <div className="stat-icon green" style={{width: 80, height: 80, marginBottom: '1rem'}}>
             <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: 40, height: 40}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
             </svg>
          </div>
          <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>ความรู้ทั่วไป</h3>
          <p style={{color: 'var(--text-secondary)'}}>
            ระยะเวลาอุ้มท้องของสุกรโดยเฉลี่ยคือ <strong>114 วัน</strong> <br/>
            (จำง่ายๆ ว่า 3 เดือน 3 สัปดาห์ 3 วัน) <br/>
            ระบบจะคำนวณวันคลอดให้อัตโนมัติเมื่อท่านใส่วันที่ผสมพันธุ์
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>ตารางติดตามการคลอด</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>รหัสแม่พันธุ์</th>
              <th>วันที่ผสม</th>
              <th>กำหนดคลอด</th>
              <th>เหลือเวลา (วัน)</th>
              <th>สถานะ / วันที่คลอดจริง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td style={{fontWeight: 600}}>{record.motherId}</td>
                <td>
                  {record.matingDate}
                  {record.isRepeated && record.repeatDate && (
                    <div style={{fontSize: '0.75rem', color: 'var(--accent-red)'}}>
                      (ซ้ำ: {record.repeatDate})
                    </div>
                  )}
                </td>
                <td>{record.expectedDate}</td>
                <td>
                  {record.daysLeft > 0 ? (
                    <span style={{color: record.daysLeft <= 7 ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: record.daysLeft <= 7 ? 700 : 400}}>
                      {record.daysLeft} วัน
                    </span>
                  ) : (
                    <span style={{color: 'var(--accent-green)', fontWeight: 700}}>ถึงกำหนดแล้ว</span>
                  )}
                </td>
                <td>
                  {record.actualDate ? record.actualDate : (
                    <button className="btn-primary" style={{padding: '4px 12px', fontSize: '0.8rem', background: 'white', color: 'var(--primary-color)', border: '1px solid var(--primary-color)'}}>
                      ลงบันทึกคลอดแล้ว
                    </button>
                  )}
                </td>
                <td>
                  <button 
                    onClick={() => handleDeleteRecord(record.id)}
                    style={{background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.875rem'}}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Breeding;
