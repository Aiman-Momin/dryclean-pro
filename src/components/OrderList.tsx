/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/src/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Clock, CheckCircle2, Package, Truck } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const statusConfig = {
  [OrderStatus.RECEIVED]: { color: 'bg-[#E5E5DE] text-[#5A5A40]', icon: Package },
  [OrderStatus.PROCESSING]: { color: 'bg-[#F2E8CF] text-[#856404]', icon: Clock },
  [OrderStatus.READY]: { color: 'bg-[#A7C957] text-white', icon: CheckCircle2 },
  [OrderStatus.DELIVERED]: { color: 'bg-[#5A5A40] text-white', icon: Truck },
};

export function OrderList({ orders, onUpdateStatus }: OrderListProps) {
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((order) => {
    const matchesName = !nameFilter || order.customerName.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesPhone = !phoneFilter || order.phoneNumber.includes(phoneFilter);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesName && matchesPhone && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-heading text-primary">Active Orders</h2>
          <div className="text-xs text-muted-foreground bg-accent-light px-3 py-1 rounded-full border border-border">
            Total: {filteredOrders.length}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Customer Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-9 rounded-md border-border bg-white text-sm h-10"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Phone Number</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by phone..."
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className="pl-9 rounded-md border-border bg-white text-sm h-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Order Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full rounded-md border-border bg-white text-sm h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4">ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4">Customer</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4">Garments</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4">Total</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold py-4 text-right">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground italic">
                  No orders found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                return (
                  <TableRow key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold text-primary">
                      #{order.id.slice(0, 4).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-heading text-base text-foreground">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.phoneNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {order.garments.map(g => `${g.quantity}x ${g.name}`).join(', ')}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig[order.status].color}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(val) => onUpdateStatus(order.id, val as OrderStatus)}
                      >
                        <SelectTrigger className="h-8 w-[120px] ml-auto rounded-md border-border bg-white text-[11px] uppercase font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(OrderStatus).map((status) => (
                            <SelectItem key={status} value={status} className="text-[11px] uppercase">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
