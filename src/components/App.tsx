import { useState } from 'react';
import { ModuleNavigation } from './components/ModuleNavigation';
import { AdminPanel } from './admin/AdminPanel';
import { modulesMock } from './data/modules'; // mock para testar

function App() {
  const [modules, setModules] = useState(modulesMock);
  const [admin, setAdmin] = useState(false);

  return (
    <div>
      <button 
        className="fixed top-4 right-4 z-50 bg-white text-black px-3 py-1 rounded"
        onClick={() => setAdmin(!admin)}
      >
        {admin ? 'Voltar' : 'Admin'}
      </button>

      {admin 
        ? <AdminPanel modules={modules} onUpdate={setModules} />
        : <ModuleNavigation modules={modules} employee={{ fullName: 'Pedro', jobPosition: 'Instrutor', registrationDate: new Date().toISOString() }} onModuleStart={() => {}} />
      }
    </div>
  );
}

export default App;