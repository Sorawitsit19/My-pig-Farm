import React, { useState } from 'react';

const Vaccine = ({ vaccineList, setVaccineList, schedules, setSchedules, pens = [] }) => {

  const [formData, setFormData] = useState({
    pen: '',
    pigCount: '',
    vaccineName: '',
    customVaccine: '',
    scheduledDate: ''
  });

  const handlePenChange = (e) => {
    const selectedPenName = e.target.value;
    const selectedPen = pens.find(p => p.name === selectedPenName);
    
    setFormData({
      ...formData,
      pen: selectedPenName,
      pigCount: selectedPen ? selectedPen.pigCount : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalVaccineName = formData.vaccineName;

    // ถ้าเลือกเพิ่มวัคซีนใหม่
    if (finalVaccineName === 'custom') {
      if (!formData.customVaccine) {
        alert('กรุณาระบุชื่อวัคซีนใหม่');
        return;
      }
      finalVaccineName = formData.customVaccine;
      
      // บันทึกเข้าลิสต์เพื่อใช้ครั้งต่อไปถ้ายังไม่มี
      if (!vaccineList.includes(finalVaccineName)) {
        setVaccineList([...vaccineList, finalVaccineName]);
      }
    }

    if (!formData.pen || !finalVaccineName || !formData.scheduledDate || !formData.pigCount) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newSchedule = {
      id: Date.now(),
      pen: formData.pen,
      pigCount: parseInt(formData.pigCount),
      vaccineName: finalVaccineName,
      scheduledDate: formData.scheduledDate,
      status: 'pending'
    };

    setSchedules([...schedules, newSchedule]);
    alert('บันทึกกำหนดการวัคซีนเรียบร้อย');
    setFormData({ pen: '', pigCount: '', vaccineName: '', customVaccine: '', scheduledDate: '' });
  };

  const markCompleted = (id) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, status: 'completed' } : s
    ));
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm('คุณต้องการลบกำหนดการทำวัคซีนนี้ใช่หรือไม่?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const handleChangeDate = (id, newDate) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, scheduledDate: newDate } : s
    ));
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">ตารางการทำวัคซีน</h1>
        <p className="page-subtitle">จัดการกำหนดการฉีดวัคซีน เพิ่มชนิดวัคซีนเองได้ และระบุจำนวนหมูที่ต้องฉีด</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{gridColumn: 'span 1', height: 'fit-content'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>เพิ่มกำหนดการ</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>คอกสุกร</label>
              <select 
                className="form-select"
                value={formData.pen}
                onChange={handlePenChange}
              >
                <option value="">-- เลือกคอกสุกร --</option>
                {pens.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>จำนวนหมูที่ฉีด (ตัว)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0"
                min="1"
                value={formData.pigCount}
                onChange={e => setFormData({...formData, pigCount: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>ชื่อวัคซีน</label>
              <select 
                className="form-select"
                value={formData.vaccineName}
                onChange={e => setFormData({...formData, vaccineName: e.target.value})}
              >
                <option value="">-- เลือกวัคซีน --</option>
                {vaccineList.map((v, index) => (
                  <option key={index} value={v}>{v}</option>
                ))}
                <option value="custom" style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>+ เพิ่มชนิดวัคซีนใหม่...</option>
              </select>
              
              {formData.vaccineName === 'custom' && (
                <input 
                  type="text" 
                  className="form-input" 
                  style={{marginTop: '0.5rem'}}
                  placeholder="ระบุชื่อวัคซีนใหม่ที่นี่"
                  value={formData.customVaccine}
                  onChange={e => setFormData({...formData, customVaccine: e.target.value})}
                />
              )}
            </div>

            <div className="form-group">
              <label>กำหนดฉีดวันที่</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.scheduledDate}
                onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem', background: 'var(--accent-red)'}}>
              เพิ่มลงตาราง
            </button>
          </form>
        </div>

        <div className="glass-card" style={{gridColumn: 'span 2'}}>
          <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>ตารางและประวัติการทำวัคซีน</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>คอกสุกร</th>
                <th>จำนวน (ตัว)</th>
                <th>ชื่อวัคซีน</th>
                <th>กำหนดฉีด</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {schedules.sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)).map(schedule => (
                <tr key={schedule.id}>
                  <td style={{fontWeight: 500}}>{schedule.pen}</td>
                  <td>{schedule.pigCount}</td>
                  <td>{schedule.vaccineName}</td>
                  <td>
                    <input 
                      type="date" 
                      value={schedule.scheduledDate} 
                      onChange={(e) => handleChangeDate(schedule.id, e.target.value)}
                      style={{padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem', background: schedule.status === 'completed' ? '#f0f0f0' : 'white'}}
                      disabled={schedule.status === 'completed'}
                    />
                  </td>
                  <td>
                    {schedule.status === 'completed' ? (
                      <span style={{color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        ฉีดแล้ว
                      </span>
                    ) : (
                      <span style={{color: 'var(--accent-red)', fontWeight: 600}}>
                        รอดำเนินการ
                      </span>
                    )}
                  </td>
                  <td style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {schedule.status === 'pending' && (
                      <button 
                        onClick={() => markCompleted(schedule.id)}
                        className="btn-primary" 
                        style={{padding: '6px 12px', fontSize: '0.8rem', background: 'var(--accent-green)'}}
                      >
                        ยืนยันฉีด
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteSchedule(schedule.id)}
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
    </div>
  );
};

export default Vaccine;
