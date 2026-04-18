/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GARMENT_TYPES, Garment, OrderStatus } from '@/src/types';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface OrderFormProps {
  onSubmit: (orderData: any) => Promise<void>;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [garments, setGarments] = useState<Garment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addGarment = (type: typeof GARMENT_TYPES[0]) => {
    const newGarment: Garment = {
      id: Math.random().toString(36).substr(2, 9),
      name: type.name,
      quantity: 1,
      pricePerItem: type.defaultPrice,
    };
    setGarments([...garments, newGarment]);
  };

  const removeGarment = (id: string) => {
    setGarments(garments.filter((g) => g.id !== id));
  };

  const updateGarment = (id: string, updates: Partial<Garment>) => {
    setGarments(garments.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const subtotal = garments.reduce((sum, g) => sum + g.quantity * g.pricePerItem, 0);
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || garments.length === 0) {
      toast.error('Please fill in all fields and add at least one garment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName,
        phoneNumber,
        garments,
        totalAmount,
        status: OrderStatus.RECEIVED,
        createdAt: Date.now(),
        estimatedDeliveryDate: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days default
      });
      setCustomerName('');
      setPhoneNumber('');
      setGarments([]);
      toast.success('Order created successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-secondary p-8 rounded-lg shadow-sm border border-border">
      <h3 className="text-2xl font-heading text-primary mb-8">New Order</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="text-[11px] font-bold uppercase tracking-wider text-primary">Customer Name</Label>
          <Input
            id="customerName"
            placeholder="e.g. John Doe"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="bg-white border-border rounded-md h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-[11px] font-bold uppercase tracking-wider text-primary">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="e.g. 555-0100"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-white border-border rounded-md h-12"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-primary">Garments</Label>
            <Select onValueChange={(val) => addGarment(GARMENT_TYPES.find(t => t.name === val)!)}>
              <SelectTrigger className="w-[180px] bg-white border-border rounded-md h-10 text-sm">
                <SelectValue placeholder="Add Garment" />
              </SelectTrigger>
              <SelectContent>
                {GARMENT_TYPES.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name} (${type.defaultPrice})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {garments.map((garment) => (
              <div key={garment.id} className="flex items-center gap-3 p-3 bg-white border border-border rounded-md">
                <div className="flex-1 font-medium text-sm text-foreground">{garment.name}</div>
                <div className="w-16">
                  <Input
                    type="number"
                    min="1"
                    value={garment.quantity}
                    onChange={(e) => updateGarment(garment.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="h-8 text-center"
                  />
                </div>
                <div className="w-20 text-right font-medium text-sm text-primary">
                  ${(garment.quantity * garment.pricePerItem).toFixed(2)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGarment(garment.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-dashed border-primary mt-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground uppercase tracking-wider text-[11px]">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground uppercase tracking-wider text-[11px]">
            <span>Service Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-heading text-primary">Total Due</span>
            <span className="text-2xl font-heading text-primary">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-12 bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-xs rounded-md shadow-sm mt-4"
        >
          {isSubmitting ? 'Processing...' : 'Create Order'}
        </Button>
      </form>
    </div>
  );
}
