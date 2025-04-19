import { OrderItem } from "../order-item/order-item.module";

export interface Order {
  id: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
  totalAmount: number;
  userId: string;
  dateCreation: string;
  orderItems: OrderItem[];
}