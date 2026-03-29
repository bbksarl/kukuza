import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X } from 'lucide-react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

const DashboardLayout = ({ children, activePath }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--color-background)">
      <Sidebar activePath={activePath} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`md:ml-24 transition-all duration-300 ${isSidebarOpen ? 'md:opacity-100 opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Header 
          notificationCount={1} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="p-4 md:p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
