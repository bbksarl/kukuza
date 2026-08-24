import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

const DashboardLayout = ({ children, activePath }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activePath={activePath} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`md:ml-[116px] transition-all duration-300 ${isSidebarOpen ? 'md:opacity-100 opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Header 
          notificationCount={1} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="shop-dashboard-main min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
