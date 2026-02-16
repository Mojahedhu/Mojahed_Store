import type { User } from "../users/usersTypes";

export type OrderItem = {
  _id?: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product?: string;
};

export type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  product?: string;
};

export type CreateOrderDTO = {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};
export type OrderDTO = {
  _id: string | undefined;
  user: User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isDelivered?: boolean;
  deliveredAt?: string;
  paidAt: number;
  isPaid: boolean;
  createdAt: string;
};

export type SalesByDate = {
  _id: string;
  totalSales: string;
};

export type CapturedResponse = {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  purchase_units: {
    amount_value: string;
    payments: {
      captures: {
        id: string;
        status: string;
        update_time: string;
        amount: {
          value: string;
          currency_code: string;
        };
        links: {
          href: string;
          rel: string;
          method: string;
        }[];
      }[];
    };
  }[];
  payer: {
    email_address: string;
  };
};
