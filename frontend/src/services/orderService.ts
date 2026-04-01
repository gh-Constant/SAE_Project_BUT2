import apiClient from './apiClient';
import { EtatCommande } from '@/mocks/commande';

export interface OrderLine {
  id_product: number;
  quantite: number;
  price: number;
  productName?: string | null;
}

export interface Order {
  id: number;
  date_commande: Date;
  date_collect?: Date;
  total_price: number;
  id_user: number;
  id_prestataire: number;
  id_location: number;
  etat_commande: EtatCommande;
  qrToken?: string;
  lignesCommande: OrderLine[];
}

const normalizeOrder = (order: any): Order => ({
  ...order,
  date_commande: new Date(order.date_commande),
  date_collect: order.date_collect ? new Date(order.date_collect) : undefined,
  etat_commande:
    order.etat_commande === 'paid'
      ? EtatCommande.PAID
      : order.etat_commande === 'collected'
        ? EtatCommande.COLLECTED
        : EtatCommande.WAITING,
});

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const response = await apiClient.get('/orders/my');
    return response.data.map(normalizeOrder);
  },

  async payOrder(orderId: number): Promise<{ order: Partial<Order>; qrToken: string }> {
    const response = await apiClient.put(`/orders/${orderId}/pay`);
    return response.data;
  },

  async collectOrder(token: string): Promise<Order> {
    const response = await apiClient.post('/orders/collect', { token });
    return normalizeOrder(response.data);
  }
};
