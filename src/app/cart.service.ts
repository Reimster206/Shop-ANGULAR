import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from './models/cart-item.model';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private discountCodes = {
    'DISCOUNT10': 0.1,
    'DISCOUNT20': 0.2,
    'SPECIAL30': 0.3
  };
  private appliedDiscountCode: string | null = null;

  constructor() { }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    
    this.cartSubject.next([...this.cartItems]);
    this.applyQuantityDiscounts();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartSubject.next([...this.cartItems]);
    this.applyQuantityDiscounts();
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next([...this.cartItems]);
      this.applyQuantityDiscounts();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    this.appliedDiscountCode = null;
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getDiscountedTotal(): number {
    let total = this.getTotal();
    
    // Apply quantity discounts
    if (this.cartItems.length >= 3) {
      total *= 0.9; // 10% off for 3 or more items
    } else if (this.cartItems.length >= 2) {
      total *= 0.95; // 5% off for 2 items
    }
    
    // Apply discount code if exists
    if (this.appliedDiscountCode) {
      const discount = this.discountCodes[this.appliedDiscountCode as keyof typeof this.discountCodes];
      total *= (1 - discount);
    }
    
    return parseFloat(total.toFixed(2));
  }

  applyDiscountCode(code: string): boolean {
    if (this.discountCodes[code as keyof typeof this.discountCodes]) {
      this.appliedDiscountCode = code;
      this.cartSubject.next([...this.cartItems]);
      return true;
    }
    return false;
  }

  getAppliedDiscountCode(): string | null {
    return this.appliedDiscountCode;
  }

  private applyQuantityDiscounts(): void {
    // Quantity discounts are applied in getDiscountedTotal()
  }

  generateReceipt(): any {
    return {
      items: [...this.cartItems],
      subtotal: this.getTotal(),
      total: this.getDiscountedTotal(),
      discountCode: this.appliedDiscountCode,
      date: new Date(),
      receiptId: Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    };
  }
}