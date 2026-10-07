import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import FeedManagement from './pages/FeedManagement';
import FeedSales from './pages/FeedSales';
import Breeding from './pages/Breeding';
import Vaccine from './pages/Vaccine';
import Pens from './pages/Pens';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bypassLogin, setBypassLogin] = useState(false);
  
  // --- Data Loading State ---
  const [dataLoaded, setDataLoaded] = useState(false);

  // --- Shared Global State ---
  const [feedStock, setFeedStock] = useState([
    { id: 1, name: 'เบอร์ 1', stock: 50 },
    { id: 2, name: 'เบอร์ 2', stock: 120 },
    { id: 3, name: 'เบอร์ 3', stock: 80 },
    { id: 4, name: 'เบอร์ 4', stock: 45 },
    { id: 5, name: 'เบอร์ 5', stock: 0 },
    { id: 6, name: 'เบอร์ 6', stock: 0 },
    { id: 7, name: 'เบอร์ 7', stock: 0 },
  ]);

  const [feedRecords, setFeedRecords] = useState([]);
  const [pens, setPens] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [vaccineList, setVaccineList] = useState([
    'อหิวาต์สุกร (CSF)',
    'ปากและเท้าเปื่อย (FMD)',
    'โรคพีอาร์อาร์เอส (PRRS)',
    'เซอร์โคไวรัส (PCV2)',
    'ไมโคพลาสมา'
  ]);
  const [vaccineSchedules, setVaccineSchedules] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [breeders, setBreeders] = useState([]);

  // ตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // โหลดและซิงค์ข้อมูลจาก Firestore (Realtime)
  useEffect(() => {
    // โหลดข้อมูลถ้าล็อกอินหรือกด bypass
    if (user || bypassLogin) {
      const docRef = doc(db, "farmData", "main");
      
      const unsubscribeSync = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.feedStock) setFeedStock(data.feedStock);
          if (data.feedRecords) setFeedRecords(data.feedRecords);
          if (data.pens) setPens(data.pens);
          if (data.breedingRecords) setBreedingRecords(data.breedingRecords);
          if (data.vaccineList) setVaccineList(data.vaccineList);
          if (data.vaccineSchedules) setVaccineSchedules(data.vaccineSchedules);
          if (data.salesRecords) setSalesRecords(data.salesRecords);
          if (data.breeders) setBreeders(data.breeders);
        }
        setDataLoaded(true);
      }, (error) => {
        console.error("Error fetching Firestore: ", error);
        // ถ้า error ก็ให้ไปต่อด้วยข้อมูลเริ่มต้น
        setDataLoaded(true);
      });

      return () => unsubscribeSync();
    }
  }, [user, bypassLogin]);

  // ฟังก์ชันช่วยอัปเดตไป Firestore
  const updateFirestore = async (key, value) => {
    try {
      const docRef = doc(db, "farmData", "main");
      await setDoc(docRef, { [key]: value }, { merge: true });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  // Wrapper Functions เพื่อให้เซฟลง Firebase พร้อมกับ State
  const handleSetFeedStock = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(feedStock) : newVal;
    setFeedStock(val);
    updateFirestore('feedStock', val);
  };

  const handleSetFeedRecords = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(feedRecords) : newVal;
    setFeedRecords(val);
    updateFirestore('feedRecords', val);
  };

  const handleSetPens = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(pens) : newVal;
    setPens(val);
    updateFirestore('pens', val);
  };

  const handleSetBreedingRecords = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(breedingRecords) : newVal;
    setBreedingRecords(val);
    updateFirestore('breedingRecords', val);
  };

  const handleSetVaccineList = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(vaccineList) : newVal;
    setVaccineList(val);
    updateFirestore('vaccineList', val);
  };

  const handleSetVaccineSchedules = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(vaccineSchedules) : newVal;
    setVaccineSchedules(val);
    updateFirestore('vaccineSchedules', val);
  };

  const handleSetSalesRecords = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(salesRecords) : newVal;
    setSalesRecords(val);
    updateFirestore('salesRecords', val);
  };

  const handleSetBreeders = (newVal) => {
    const val = typeof newVal === 'function' ? newVal(breeders) : newVal;
    setBreeders(val);
    updateFirestore('breeders', val);
  };

  const handleLogout = async () => {
    try {
      if (bypassLogin) {
        setBypassLogin(false);
        return;
      }
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPage = () => {
    if (!dataLoaded) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>กำลังโหลดฐานข้อมูล...</div>;

    switch(activePage) {
      case 'dashboard': 
        return <Dashboard feedStock={feedStock} pens={pens} />;
      case 'pens':
        return <Pens 
                 pens={pens} setPens={handleSetPens} 
                 feedRecords={feedRecords} 
                 breeders={breeders} setBreeders={handleSetBreeders}
               />;
      case 'feed': 
        return <FeedManagement 
                 feedStock={feedStock} setFeedStock={handleSetFeedStock} 
                 feedRecords={feedRecords} setFeedRecords={handleSetFeedRecords} 
                 pens={pens} 
               />;
      case 'sales':
        return <FeedSales
                 feedStock={feedStock} setFeedStock={handleSetFeedStock}
                 salesRecords={salesRecords} setSalesRecords={handleSetSalesRecords}
                 feedRecords={feedRecords} setFeedRecords={handleSetFeedRecords}
               />;
      case 'breeding': 
        return <Breeding records={breedingRecords} setRecords={handleSetBreedingRecords} />;
      case 'vaccine': 
        return <Vaccine 
                 vaccineList={vaccineList} setVaccineList={handleSetVaccineList}
                 schedules={vaccineSchedules} setSchedules={handleSetVaccineSchedules}
               />;
      default: 
        return <Dashboard feedStock={feedStock} pens={pens} />;
    }
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>กำลังโหลด...</div>;
  }

  if (!user && !bypassLogin) {
    return <Login onBypass={() => setBypassLogin(true)} />;
  }

  return (
    <>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="main-content">
        {renderPage()}
      </main>
    </>
  );
}

export default App;
