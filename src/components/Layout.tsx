
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold ml-2">RoadWise Manager</h1>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
