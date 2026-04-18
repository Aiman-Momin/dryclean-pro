/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { Auth as AuthUI } from './components/Auth';
import { Order, OrderStatus } from './types';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { auth, db } from './firebase';
import { AuthService } from './lib/auth-service';
import { OrderService } from './services/orderService';
import { User, getRedirectResult } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const authService = useMemo(() => new AuthService(auth), []);
  const orderService = useMemo(() => new OrderService(db), []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [authService]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setAuthError(null);
        }
      })
      .catch((error: unknown) => {
        const err = error as { code?: string; message?: string };
        console.warn('Google redirect result error:', err.code, err.message);
        setAuthError(
          `Google redirect sign-in failed. ${err.message ?? 'Please check Firebase Auth and authorized domains.'}`
        );
      });
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = orderService.subscribeToOrders((newOrders) => {
        setOrders(newOrders);
      });
      return () => unsubscribe();
    }
  }, [user, orderService]);

  const handleLogin = async () => {
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await authService.login();
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Google sign-in failed:', err.code, err.message);
      setAuthError(
        `Google sign-in failed${err.code ? ` (${err.code})` : ''}. ${
          err.message ?? 'Please allow popups and make sure Google Auth is enabled for your Firebase project.'
        }`
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateOrder = async (orderData: any) => {
    await orderService.createOrder(orderData);
    setActiveTab('orders');
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setOrders([]);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthUI
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        errorMessage={authError}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        orders={orders}
      >
        {activeTab === 'dashboard' && <Dashboard orders={orders} />}
        {activeTab === 'orders' && (
          <OrderList orders={orders} onUpdateStatus={handleUpdateStatus} />
        )}
        {activeTab === 'create' && (
          <OrderForm onSubmit={handleCreateOrder} />
        )}
      </Layout>
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}
