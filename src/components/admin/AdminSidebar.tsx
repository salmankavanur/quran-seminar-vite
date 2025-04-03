
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Image, Settings, FileText, MessageSquare, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminSidebar: React.FC = () => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Contestants', path: '/admin/contestants', icon: <Users className="h-5 w-5" /> },
    { name: 'Registrations', path: '/admin/registrations', icon: <FileText className="h-5 w-5" /> },
    { name: 'Panelist', path: '/admin/posters', icon: <Image className="h-5 w-5" /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
    });
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-seminar-blue dark:text-seminar-gold">Seminar Admin</h2>
      </div>
      
      <ScrollArea className="flex-1 overflow-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-seminar-blue/10 text-seminar-blue dark:bg-seminar-gold/10 dark:text-seminar-gold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                  end={item.path === '/admin'}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Seminar Admin Panel © 2024
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
