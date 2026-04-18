/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Order } from '@/src/types';

interface UserProfileProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  orders: Order[];
}

export function UserProfile({ user, isOpen, onClose, onLogout, orders }: UserProfileProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        {user ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Name
              </p>
              <p className="text-lg font-semibold text-primary">
                {user.displayName || 'Not set'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Email
              </p>
              <p className="text-sm text-foreground break-all">{user.email || 'Not available'}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                User ID
              </p>
              <p className="text-xs text-muted-foreground font-mono break-all">{user.uid}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Total Orders
              </p>
              <p className="text-2xl font-heading text-primary">{totalOrders}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-heading text-primary">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-destructive text-white hover:bg-destructive/90 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No user data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
