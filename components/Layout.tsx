import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../hooks/useData';
import ErrorBanner from './ErrorBanner';
import { 
    DashboardIcon, 
    PackageIcon, 
    ShoppingCartIcon, 
    ArchiveIcon, 
    MenuIcon, 
    StoreIcon,
    BellIcon,
    SettingsIcon,
    HelpIcon,
    UserIcon,
    ChevronDownIcon,
    DollarSignIcon,
    ChevronsLeftIcon,
    ShoppingBagIcon
} from './Icons';

const navItems = [
  { to: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { to: '/products', icon: ShoppingBagIcon, label: 'Products' },
  { to: '/purchases', icon: ShoppingCartIcon, label: 'Purchases' },
  { to: '/sales', icon: DollarSignIcon, label: 'Sales' },
  { to: '/inventory', icon: ArchiveIcon, label: 'Inventory' },
];

const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/products': 'Product Management',
    '/purchases': 'Purchase Management',
    '/sales': 'Sales Management',
    '/inventory': 'Inventory Management',
};

const Sidebar: React.FC<{ isCollapsed: boolean, onToggle: () => void }> = ({ isCollapsed, onToggle }) => (
  <aside className={`flex-shrink-0 bg-slate-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
    <div className={`h-28 flex flex-col items-center justify-center px-4 border-b border-slate-700 transition-all duration-300 ${isCollapsed ? 'py-4' : ''}`}>
        <div className="bg-white p-2 rounded-lg store-icon">
           <StoreIcon className="h-8 w-8 text-teal-600" />
        </div>
      <h1 className={`text-md font-bold text-white text-center mt-2 uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-8'}`}>Super Fresh Store</h1>
    </div>
    <nav className="flex-1 px-4 py-4 space-y-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 group ${isCollapsed ? 'justify-center' : ''} ${
              isActive
                ? 'bg-teal-400/20 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`
          }
        >
          <Icon className={`h-5 w-5 transition-all duration-300 ease-in-out ${isCollapsed ? '' : 'mr-3'} text-slate-400 group-hover:text-white`} />
          <span className={`transition-all origin-left duration-300 ease-in-out ${isCollapsed ? 'w-0 scale-90 opacity-0' : 'w-auto scale-100 opacity-100'}`}>{label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="px-4 py-4 border-t border-slate-700">
        <button 
            onClick={onToggle} 
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white group"
        >
            <ChevronsLeftIcon className={`h-5 w-5 text-slate-400 group-hover:text-white transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
    </div>
  </aside>
);

const MobileSidebar: React.FC<{ isOpen: boolean, setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => (
    <div className={`fixed inset-0 flex z-40 md:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)}></div>
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsOpen(false)}>
                    <span className="sr-only">Close sidebar</span>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0.0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
             <div className="h-28 flex flex-col items-center justify-center px-4 border-b border-slate-700">
                <div className="bg-white p-2 rounded-lg store-icon">
                   <StoreIcon className="h-8 w-8 text-teal-600" />
                </div>
              <h1 className="text-md font-bold text-white text-center mt-2 uppercase tracking-wider">Super Fresh Store</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 text-base font-medium rounded-md transition-colors duration-150 group ${
                            isActive ? 'bg-teal-400/20 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`
                        }
                    >
                        <Icon className="h-6 w-6 mr-4 text-slate-400 group-hover:text-white" />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
    </div>
);

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const location = useLocation();
    const title = pageTitles[location.pathname] || 'Management';

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                     {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={onMenuClick} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                    {/* Title */}
                    <div className="flex-1 min-w-0 md:pl-0 pl-3">
                         <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
                    </div>
                    {/* Right side icons */}
                    <div className="flex items-center space-x-2 sm:space-x-6">
                        <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none">
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center text-xs text-white ring-2 ring-white">5</span>
                            <BellIcon className="h-6 w-6" />
                            <span className="sr-only">Notifications</span>
                        </button>
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none hidden sm:inline-flex">
                            <SettingsIcon className="h-6 w-6" />
                            <span className="sr-only">Settings</span>
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100">
                                <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-teal-600" />
                                </div>
                                <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin</span>
                                <ChevronDownIcon className="hidden sm:inline h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const Layout: React.FC = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { error } = useData();

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            </div>
            {/* Mobile sidebar */}
            <MobileSidebar isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen} />
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <Header onMenuClick={() => setMobileSidebarOpen(true)} />
                {error && <ErrorBanner message={error} />}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;