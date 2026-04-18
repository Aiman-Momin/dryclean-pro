/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/src/types';
import { Shirt, DollarSign, Clock3, CheckCircle2, Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardIllustration from '@/src/assets/laundry-dashboard.svg';

interface DashboardProps {
  orders: Order[];
}

export function Dashboard({ orders }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === OrderStatus.RECEIVED || o.status === OrderStatus.PROCESSING).length;
  const readyOrders = orders.filter((o) => o.status === OrderStatus.READY).length;

  const filteredRecentOrders = orders
    .filter((order) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        order.customerName.toLowerCase().includes(search) || order.phoneNumber.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .slice(0, 10);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      tone: 'text-blue-700 bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-600',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Shirt,
      tone: 'text-indigo-700 bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-600',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock3,
      tone: 'text-amber-700 bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Ready for Pickup',
      value: readyOrders,
      icon: CheckCircle2,
      tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-600',
    },
  ];

  const ordersByStatus = Object.values(OrderStatus).map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  return (
    <div className="space-y-8 pb-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em]">
              <Sparkles className="h-4 w-4 text-emerald-200" />
              Operations Snapshot
            </div>
            <h2 className="text-4xl font-bold md:text-5xl">Dashboard</h2>
            <p className="max-w-xl text-sm text-slate-200 md:text-base">
              Track active orders, monitor revenue, and keep the pickup counter running on time with live visibility.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-100">
              <ArrowUpRight className="h-4 w-4 text-emerald-300" />
              Performance refreshes instantly as orders move through stages.
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-secondary/40 p-3 shadow-sm">
          <img src={DashboardIllustration} alt="Laundry dashboard illustration" className="h-full w-full rounded-2xl object-cover" />
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-foreground">Performance</h3>
        <p className="text-sm text-muted-foreground">Today</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className={`rounded-2xl border p-5 shadow-sm ${stat.tone}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Orders by Status</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">Total {totalOrders}</span>
          </div>
          <div className="space-y-5">
            {ordersByStatus.map((item, idx) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.status}</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{item.count}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Use this distribution to balance workload during peak hours.</p>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-foreground">Recent Activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">Search and filter your latest customer orders.</p>
          </div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl border-border bg-white pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border bg-white sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="max-h-72 flex-1 space-y-3 overflow-y-auto pr-1">
            {filteredRecentOrders.map((order, idx) => (
              <div key={order.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{order.customerName}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {filteredRecentOrders.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No matching orders found.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Speed</p>
          <h4 className="mt-2 text-lg font-semibold text-blue-900">Faster Turnaround</h4>
          <p className="mt-1 text-sm text-blue-800/80">Keep intake and processing visible so your team works without delays.</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Care</p>
          <h4 className="mt-2 text-lg font-semibold text-emerald-900">Quality Control</h4>
          <p className="mt-1 text-sm text-emerald-800/80">Track garment status clearly at each stage for fewer customer issues.</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Growth</p>
          <h4 className="mt-2 text-lg font-semibold text-amber-900">Revenue Clarity</h4>
          <p className="mt-1 text-sm text-amber-800/80">Use daily totals to spot trends and improve pricing decisions.</p>
        </div>
      </div>
    </div>
  );
}
