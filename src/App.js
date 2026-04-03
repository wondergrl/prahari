import React, { useState, useEffect } from 'react';
import Landing    from './pages/Landing';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import ZoneMap    from './pages/ZoneMap';
import Premium    from './pages/Premium';
import Policy     from './pages/Policy';
import Claims     from './pages/Claims';
import Triggers   from './pages/Triggers';
import MLModel    from './pages/MLModel';
import Exclusions from './pages/Exclusions';
import Navbar     from './components/Navbar';
import './index.css';

export default function App() {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem('prahari-theme');
    return s ? s === 'dark' : true;
  });
  const [page,    setPage]   = useState('landing');
  const [worker,  setWorker] = useState(null);

  useEffect(() => {
    localStorage.setItem('prahari-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

  const shared = { navigate, dark, setDark, worker, setWorker };

  const Page = () => {
    switch (page) {
      case 'landing':   return <Landing   {...shared} />;
      case 'register':  return <Register  {...shared} />;
      case 'dashboard': return <Dashboard {...shared} />;
      case 'zone':      return <ZoneMap   {...shared} />;
      case 'premium':   return <Premium   {...shared} />;
      case 'policy':    return <Policy    {...shared} />;
      case 'claims':    return <Claims    {...shared} />;
      case 'triggers':  return <Triggers  {...shared} />;
      case 'ml':        return <MLModel   {...shared} />;
      case 'exclusions':return <Exclusions {...shared} />;
      default:          return <Landing   {...shared} />;
    }
  };

  return (
    <div className="min-h-screen dark:bg-[#0a0d1a] bg-gray-50">
      {page !== 'landing' && (
        <Navbar {...shared} page={page} />
      )}
      <Page />
    </div>
  );
}