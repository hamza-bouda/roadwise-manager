
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Map as MapIcon, 
  Calendar, 
  Settings as SettingsIcon,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AppSidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      title: 'Tableau de bord',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Signalements',
      path: '/signalements',
      icon: AlertTriangle,
    },
    {
      title: 'Carte',
      path: '/map',
      icon: MapIcon,
    },
    {
      title: 'Maintenance',
      path: '/maintenance',
      icon: Calendar,
    },
    {
      title: 'Paramètres',
      path: '/settings',
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-sidebar-primary w-8 h-8 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold">RoadWise</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
