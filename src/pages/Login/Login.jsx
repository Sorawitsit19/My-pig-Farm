import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Login.css';
const Login = ({ onBypass }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      if (isSignUp) {
        if (err.code === 'auth/email-already-in-use') setError('อีเมลนี้ถูกใช้งานแล้ว');
        else if (err.code === 'auth/weak-password') setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        else setError(`เกิดข้อผิดพลาด: ${err.message}`);
      } else {
        setError(`ไม่สามารถเข้าสู่ระบบได้: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100%',
      padding: '1rem'
    }}>
      <div className="glass-card" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div className="logo-icon" style={{margin: '0 auto 1rem auto', width: 60, height: 60}}>
            <svg style={{width: 36, height: 36}} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
          </div>
          <h1 style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>PiggyFarm ระบบจัดการฟาร์ม</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
            {isSignUp ? 'สร้างบัญชีผู้ใช้งานใหม่' : 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ'}
          </p>
        </div>

        {error && (
          <div style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>อีเมล (Email)</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="admin@farm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน (Password)</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{width: '100%', marginTop: '1rem', background: isSignUp ? 'var(--accent-green)' : 'var(--primary-color)'}}
            disabled={loading}
          >
            {loading ? 'กำลังดำเนินการ...' : (isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ')}
          </button>
        </form>
        
        <div style={{marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem'}}>
          <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>
            {isSignUp ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชีใช่ไหม?'}
          </p>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            style={{
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-color)', 
              fontWeight: 600,
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}
          >
            {isSignUp ? 'กลับไปหน้าเข้าสู่ระบบ' : 'สร้างบัญชีใหม่'}
          </button>
          
          <br/>
          <button 
            onClick={onBypass}
            style={{
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            ทดลองเข้าใช้งานชั่วคราว (ข้ามการล็อกอิน)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
