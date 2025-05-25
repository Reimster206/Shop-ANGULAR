import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { Product } from './../models/product.model';
import { CartService } from '../cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOptions = [
    { value: 'price-asc', label: 'Cena rosnąco' },
    { value: 'price-desc', label: 'Cena malejąco' },
    { value: 'name-asc', label: 'Nazwa A-Z' },
    { value: 'name-desc', label: 'Nazwa Z-A' }
  ];
  selectedSort = 'price-asc';
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.sortProducts();
    });
  }

  sortProducts(): void {
    const [key, direction] = this.selectedSort.split('-');
    
    this.filteredProducts.sort((a, b) => {
      // @ts-ignore
      const valueA = a[key];
      // @ts-ignore
      const valueB = b[key];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return direction === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
    });
  }

  onSortChange(): void {
    this.sortProducts();
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.sortProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}