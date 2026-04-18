/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Firestore
} from 'firebase/firestore';
import { Order, OrderStatus } from '@/src/types';

export class OrderService {
  private collectionName = 'orders';

  constructor(private db: Firestore) {}

  async createOrder(orderData: Omit<Order, 'id'>) {
    try {
      const docRef = await addDoc(collection(this.db, this.collectionName), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      const orderRef = doc(this.db, this.collectionName, orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  subscribeToOrders(callback: (orders: Order[]) => void) {
    const q = query(collection(this.db, this.collectionName), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      callback(orders);
    }, (error) => {
      console.error('Error subscribing to orders:', error);
    });
  }
}
