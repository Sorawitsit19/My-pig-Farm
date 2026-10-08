import React from 'react';
import './Dashboard.css';

const Dashboard = ({ feedStock = [], pens = [], breeders = [], vaccineSchedules = [], breedingRecords = [] }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);

  // เตรียมข้อมูล event สำหรับปฏิทินในเดือนปัจจุบัน
  const eventMap = {};
  
  vaccineSchedules.forEach(v => {
    if (v.status !== 'pending' || !v.scheduledDate) return;
    const date = new Date(v.scheduledDate);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const day = date.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push({ type: 'vaccine', label: `วัคซีน ${v.pen}` });
    }
  });

  breedingRecords.forEach(b => {
    if (b.actualDate || !b.expectedDate) return;
    const date = new Date(b.expectedDate);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      const day = date.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push({ type: 'farrowing', label: `คลอด ${b.motherId}` });
    }
  });

  // คำนวณวัคซีนใน 7 วันข้างหน้า
  const todayAtMidnight = new Date(today.setHours(0,0,0,0));
  const nextWeek = new Date(todayAtMidnight);
  nextWeek.setDate(todayAtMidnight.getDate() + 7);
  
  const vaccinesThisWeek = vaccineSchedules.filter(v => {
    if (v.status !== 'pending' || !v.scheduledDate) return false;
    const vDate = new Date(v.scheduledDate);
    return vDate >= todayAtMidnight && vDate <= nextWeek;
  }).length;

  // คำนวณจำนวนหมูรวมทั้งหมดจากทุกคอก
  const totalPigs = pens.reduce((sum, pen) => sum + pen.pigCount, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">ภาพรวมฟาร์ม (Dashboard)</h1>
        <p className="page-subtitle">ดูสรุปข้อมูลทั้งหมดและปฏิทินกิจกรรมแบบเรียลไทม์</p>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card stat-widget">
          <div className="stat-icon primary">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: 24, height: 24}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>หมูทั้งหมด (ตัว)</h3>
            <p>{totalPigs}</p>
          </div>
        </div>
        
        <div className="glass-card stat-widget" style={{alignItems: 'flex-start'}}>
          <div className="stat-icon yellow">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: 24, height: 24}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div className="stat-content" style={{width: '100%'}}>
            <h3>อาหารคงเหลือ</h3>
            <div className="feed-stock-list">
              {feedStock.length === 0 ? (
                <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>ไม่มีข้อมูล</span>
              ) : (
                feedStock.map(f => (
                  <div key={f.id} style={{fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '2px'}}>
                    <span style={{color: 'var(--text-secondary)'}}>{f.name}</span>
                    <strong style={{color: 'var(--text-primary)'}}>{f.stock} กระสอบ</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-icon green">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: 24, height: 24}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>แม่พันธุ์ (ตัว)</h3>
            <p>{breeders.length}</p>
          </div>
        </div>

        <div className="glass-card stat-widget">
          <div className="stat-icon red">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: 24, height: 24}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>วัคซีนสัปดาห์นี้</h3>
            <p>{vaccinesThisWeek}</p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>ปฏิทินงาน ({today.toLocaleString('th-TH', { month: 'long', year: 'numeric' })})</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <span style={{fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
            <span style={{display: 'inline-block', width: 12, height: 12, background: 'var(--accent-red)', borderRadius: '50%'}}></span> ฉีดวัคซีน
          </span>
          <span style={{fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
            <span style={{display: 'inline-block', width: 12, height: 12, background: 'var(--accent-yellow)', borderRadius: '50%'}}></span> กำหนดคลอด
          </span>
        </div>
        
        <div className="calendar-grid">
          {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map(d => (
            <div key={d} className="calendar-day-header">{d}</div>
          ))}
          {/* ข้ามวันแรกๆ ตามปฏิทินจริง */}
          {Array.from({length: firstDayIndex}).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day" style={{visibility: 'hidden'}}></div>
          ))}
          
          {days.map(day => (
            <div key={day} className={`calendar-day ${day === today.getDate() ? 'active' : ''}`}>
              <span style={{fontWeight: day === today.getDate() ? 'bold' : 'normal'}}>{day}</span>
              {eventMap[day] && eventMap[day].map((evt, idx) => (
                <div key={idx} className={`calendar-event ${evt.type}`} style={{marginTop: idx === 0 ? 'auto' : '2px'}}>
                  {evt.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
