import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileImage, Calendar, MessageSquare } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface DashboardData {
  totalRegistrations: number;
  totalMessages: number;
  latestRegistrations: Registration[];
}

// Dashboard widget component
const DashboardWidget = ({ title, value, icon, color }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-600';
      case 'amber':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRegistrations: 0,
    totalMessages: 0,
    latestRegistrations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total registrations
        const registrationsResponse = await fetch('http://localhost:5001/api/registrations');
        const registrationsData = await registrationsResponse.json();
        
        // Fetch total messages
        const messagesResponse = await fetch('http://localhost:5001/api/messages');
        const messagesData = await messagesResponse.json();

        // Get latest 5 registrations
        const latestRegistrations = registrationsData
          .sort((a: Registration, b: Registration) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 9);

        setDashboardData({
          totalRegistrations: registrationsData.length,
          totalMessages: messagesData.length,
          latestRegistrations
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateDaysToEvent = () => {
    const eventDate = new Date('2025-04-10');
    const today = new Date();
    return differenceInDays(eventDate, today);
  };

  const daysToEvent = calculateDaysToEvent();

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Registrations"
          value={dashboardData.totalRegistrations}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        <DashboardWidget
          title="Total Messages"
          value={dashboardData.totalMessages}
          icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
        <DashboardWidget
          title="Panelists"
          value="4"
          icon={<FileImage className="h-6 w-6 text-emerald-500" />}
          color="emerald"
        />
        <DashboardWidget
          title="Days to Event"
          value={daysToEvent}
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
          color="amber"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.latestRegistrations.map((registration) => (
                <div key={registration._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div>
                    <p className="font-medium">{registration.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      Registered {format(new Date(registration.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Latest Posters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Mock poster thumbnails */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
                  <img 
                    src="/images/poster.jpeg" 
                    alt={`Poster ${i}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-xs text-white truncate">Research Poster {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
