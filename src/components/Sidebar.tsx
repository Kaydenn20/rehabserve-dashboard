import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Users, 
  Heart, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeSection,
  onSectionChange
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard-overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'dimensions-analysis', label: 'Dimensions Analysis', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'scorecard', label: 'Scorecard', icon: <FileText className="h-5 w-5" /> },
    { id: 'respondent-analysis', label: 'Respondent Analysis', icon: <Users className="h-5 w-5" /> },
    { id: 'health-outcomes', label: 'Health Outcomes', icon: <Heart className="h-5 w-5" /> },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md border-r border-gray-200/60 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200/60 bg-gradient-to-r from-[#CE1126] to-[#FCD106] text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-base tracking-tight">RehabServE with AI</h2>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#CE1126]/10 to-[#FCD106]/10 text-[#CE1126] border-l-4 border-[#CE1126] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#CE1126]'
                }`}
              >
                <span className={`transition-colors ${
                  activeSection === item.id 
                    ? 'text-[#CE1126]' 
                    : 'text-gray-500 group-hover:text-[#CE1126]'
                }`}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left text-sm font-semibold">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="h-4 w-4 text-[#CE1126] animate-in" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile menu button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-lg hover:shadow-xl hover:bg-white transition-all active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-[#CE1126]" />
        </button>
      )}
    </>
  );
};

export default Sidebar;

