
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NavbarUserMenu = () => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">Log in</Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!currentUser?.name) return 'U';
    return currentUser.name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 flex items-center justify-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-seminar-gold text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{currentUser?.name}</span>
            <span className="text-xs text-muted-foreground">{currentUser?.email}</span>
            {isAdmin && (
              <Badge variant="outline" className="mt-1 bg-seminar-gold/10 text-seminar-gold border-seminar-gold/20 w-fit">
                Admin
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer flex w-full items-center">
              <Settings className="mr-2 h-4 w-4" /> Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;
