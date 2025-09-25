import { Injectable, signal } from '@angular/core';

export interface DeliveryAddress {
  fullName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cpf: string;
  installments: number;
}

export interface OrderData {
  address?: DeliveryAddress;
  payment?: PaymentData;
  items: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderData = signal<OrderData>({
    items: [],
    total: 0
  });

  get order() {
    return this.orderData();
  }

  setAddress(address: DeliveryAddress) {
    this.orderData.update(order => ({
      ...order,
      address
    }));
  }

  setPayment(payment: PaymentData) {
    this.orderData.update(order => ({
      ...order,
      payment
    }));
  }

  setItems(items: any[], total: number) {
    this.orderData.update(order => ({
      ...order,
      items,
      total
    }));
  }

  clearOrder() {
    this.orderData.set({
      items: [],
      total: 0
    });
  }

  isAddressComplete(): boolean {
    const address = this.orderData().address;
    return !!(address?.fullName && address?.street && address?.number && 
             address?.neighborhood && address?.city && address?.state && 
             address?.zipCode && address?.phone);
  }

  isPaymentComplete(): boolean {
    const payment = this.orderData().payment;
    return !!(payment?.cardName && payment?.cardNumber && 
             payment?.expiryDate && payment?.cvv);
  }
}