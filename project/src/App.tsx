import React, { useState } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProjectRegistration from './components/ProjectRegistration';
import ProjectQuery from './components/ProjectQuery';
import Layout from './components/Layout';
import Login from './components/Login';
import { List as TabList, GrabIcon as TabIcon } from 'lucide-react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'query'>('register');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <ProjectProvider>
      <Layout title={activeTab === 'register' ? 'Cadastro de Projeto' : 'Consulta de Projeto'}>
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('register')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'register'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200 flex items-center`}
              >
                <TabList className="w-5 h-5 mr-2" />
                Cadastro
              </button>
              <button
                onClick={() => setActiveTab('query')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'query'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200 flex items-center`}
              >
                <TabIcon className="w-5 h-5 mr-2" />
                Consulta
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'register' ? <ProjectRegistration /> : <ProjectQuery />}
        </div>
      </Layout>
    </ProjectProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;