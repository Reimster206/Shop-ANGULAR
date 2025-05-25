import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngAfterViewInit(): void {
    this.generateBarcode();
  }

  generateBarcode(): void {
    try {
      const canvas = document.getElementById('barcode') as HTMLCanvasElement;
      JsBarcode(canvas, this.data.receiptId, {
        format: 'CODE128',
        lineColor: '#000',
        width: 2,
        height: 50,
        displayValue: true,
        margin: 10,
        fontSize: 16
      });
    } catch (error) {
      console.error('Błąd generowania kodu kreskowego:', error);
    }
  }

  printReceipt(): void {
    window.print();
  }
}