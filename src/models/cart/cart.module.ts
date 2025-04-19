import { CartItem } from "../cart-item/cart-item.module";

export interface Cart {
  id: number;
  userId: string;
  cartItems: CartItem[];
}
