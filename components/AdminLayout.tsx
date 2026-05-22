import React from 'react';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { ModulesManagement } from './admin/ModulesManagement';
import { ClientsManagement } from './admin/ClientsManagement';
import { SalesManagement } from './admin/SalesManagement';
import { ServicesManagement } from './admin/ServicesManagement';
import { ProjectManagement } from './admin/ProjectManagement';
import { AffiliatesManagement } from './admin/AffiliatesManagement';
import { SupportManagement } from './admin/SupportManagement';
import { SettingsManagement } from './admin/SettingsManagement';
import { LiveManagement } from './admin/LiveManagement';
import { UsersManagement } from './admin/UsersManagement';
import { Button } from './ui/button';

interface AdminLayoutProps {
  adminSection: string;
  onSectionChange: (section: string) => void;
  onBackToUser: () => void;
  isMobile?: boolean;
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
}

export function AdminLayout({ 
  adminSection, 
  onSectionChange, 
  onBackToUser,
  isMobile = false,
  breakpoint = 'desktop'
}: AdminLayoutProps) {
  const renderAdminContent = () => {
    switch (adminSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'modules':
        return <ModulesManagement />;
      case 'clients':
        return <ClientsManagement />;
      case 'users':
        return <UsersManagement isMobile={isMobile} />;
      case 'sales':
        return <SalesManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'projects':
        return <ProjectManagement />;
      case 'affiliates':
        return <AffiliatesManagement />;
      case 'support':
        return <SupportManagement />;
      case 'settings':
        return <SettingsManagement />;
      case 'lives':
        return <LiveManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark flex font-inter">
      {/* Admin Sidebar */}
      {!isMobile && (
        <AdminSidebar 
          activeSection={adminSection}
          onSectionChange={onSectionChange}
          onBackToUser={onBackToUser}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        {isMobile && (
          <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-white font-bebas tracking-widest uppercase">Admin</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBackToUser}
              className="border-gray-800 text-gray-400 text-[10px] uppercase font-bold"
            >
              Exit
            </Button>
          </div>
        )}
        
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8'}`}>
          {renderAdminContent()}
        </main>
      </div>
    </div>
  );
}