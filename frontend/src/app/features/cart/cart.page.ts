import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../core/env';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, TranslateModule, AsyncPipe],
  template: `
    <h2>{{ 'CART.TITLE' | translate }}</h2>
    <div class="cart-item" *ngFor="let i of (cart.items$ | async)!">
      <img [src]="environment.apiBaseUrl + i.product.imageUrl" width="80">
      <div>
        <strong>{{ i.product.title }}</strong>
        <div>{{ i.product.price | currency:'BRL':'symbol' }} x {{ i.quantity }}</div>
      </div>
      <button (click)="cart.remove(i.product)">X</button>
    </div>
    <div class="cart-total">
      <strong>{{ 'CART.TOTAL' | translate }}:</strong> {{ cart.total | currency:'BRL':'symbol' }}
    </div>
    <div style="text-align:center">
      <a class="checkout-btn" [routerLink]="['/address']">{{ 'CART.CHECKOUT' | translate }}</a>
    </div>
  `
})
export class CartPage {
  cart = inject(CartService);
  environment = environment;
}
