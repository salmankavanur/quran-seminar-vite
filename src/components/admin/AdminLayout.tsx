
import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Fixed position sidebar */}
        <div className="fixed h-screen">
          <AdminSidebar />
        </div>
        
        {/* Main content with left margin to accommodate fixed sidebar */}
        <div className="flex-1 ml-64">
          <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-seminar-blue dark:hover:text-seminar-gold"
              >
                Back to Website
              </button>
            </div>
          </header>
          
          <main className="p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
