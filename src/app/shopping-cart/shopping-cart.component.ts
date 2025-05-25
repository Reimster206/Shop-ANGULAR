import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { CartItem } from './../models/cart-item.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReceiptComponent } from '../receipt/receipt.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  cartItems: CartItem[] = [];
  discountCode = '';
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total', 'actions'];

  constructor(
    private cartService: CartService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getTotal(): number {
    return this.cartService.getDiscountedTotal();
  }

  getDiscount(): number {
    return this.getSubtotal() - this.getTotal();
  }

  applyDiscount(): void {
    if (this.discountCode) {
      const success = this.cartService.applyDiscountCode(this.discountCode);
      if (!success) {
        alert('Nieprawidłowy kod rabatowy');
      }
      this.discountCode = '';
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  updateQuantity(item: CartItem, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    if (quantity > 0) {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  checkout(): void {
    const receipt = this.cartService.generateReceipt();
    const dialogRef = this.dialog.open(ReceiptComponent, {
      width: '500px',
      data: receipt
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cartService.clearCart();
    });
  }
}