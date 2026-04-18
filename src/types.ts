/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERED = 'DELIVERED',
}

export interface Garment {
  id: string;
  name: string;
  quantity: number;
  pricePerItem: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  garments: Garment[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  estimatedDeliveryDate?: number;
}

export const GARMENT_TYPES = [
  { name: 'Shirt', defaultPrice: 5 },
  { name: 'Pants', defaultPrice: 7 },
  { name: 'Saree', defaultPrice: 15 },
  { name: 'Suit', defaultPrice: 25 },
  { name: 'Dress', defaultPrice: 12 },
  { name: 'Jacket', defaultPrice: 10 },
];
