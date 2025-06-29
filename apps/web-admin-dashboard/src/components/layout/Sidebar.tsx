import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Store, 
  UserCheck, 
  Tags, 
  MessageSquare, 
  Bell, 
  FileText, 
  Gift,
  Star,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  permissions?: string[];
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/products', icon: Package },
      { name: 'Add Product', href: '/products/create', icon: Package },
      { name: 'Categories', href: '/categories', icon: Tags },
    ],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    badge: 5,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Store,
    permissions: ['inventory_management'],
  },
  {
    name: 'Branches',
    href: '/branches',
    icon: Store,
    permissions: ['branch_management'],
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: UserCheck,
    permissions: ['staff_management'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    name: 'Marketing',
    href: '#',
    icon: Gift,
    children: [
      { name: 'Coupons', href: '/coupons', icon: Gift },
      { name: 'Reviews', href: '/reviews', icon: Star },
    ],
  },
  {
    name: 'Support',
    href: '/support',
    icon: HelpCircle,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: 3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    permissions: ['settings_management'],
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { permissions, userData } = useSelector((state: RootState) => state.auth);

  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (permissions.includes('super_admin')) return true;
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const filteredNavigation = navigation.filter(item => hasPermission(item.permissions));

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="Adam Perfumes" />
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Admin
              </span>
            </div>
          )}
          
          <button
            onClick={() => dispatch(toggleSidebarCollapsed())}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                // Navigation group
                <div className="space-y-1">
                  {!sidebarCollapsed && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {item.name}
                    </div>
                  )}
                  {item.children.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      className={({ isActive }) => cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                        sidebarCollapsed && 'justify-center'
                      )}
                      title={sidebarCollapsed ? child.name : undefined}
                    >
                      <child.icon className={cn(
                        'flex-shrink-0 h-5 w-5',
                        sidebarCollapsed ? '' : 'mr-3'
                      )} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{child.name}</span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ) : (
                // Single navigation item
                <NavLink
                  to={item.href}
                  className={({ isActive }) => cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                    sidebarCollapsed && 'justify-center'
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn(
                    'flex-shrink-0 h-5 w-5',
                    sidebarCollapsed ? '' : 'mr-3'
                  )} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && item.badge && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User info */}
        {!sidebarCollapsed && userData && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={userData.profilePicture || '/default-avatar.png'}
                  alt={`${userData.firstName} ${userData.lastName}`}
                />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData.role.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;