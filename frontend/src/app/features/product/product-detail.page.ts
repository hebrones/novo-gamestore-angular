import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../core/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <a routerLink="/catalog" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;">
      ← {{ 'DETAIL.BACK' | translate }}
    </a>

    <ng-container *ngIf="prod; else loading">
      <div style="display:grid;grid-template-columns: 1fr 1fr;gap:24px;align-items:start;">
        <img [src]="api()+prod.imageUrl" alt="{{prod.title}}" style="width:100%;max-height:460px;object-fit:cover;border-radius:12px;">
        <div>
          <h1 style="margin-top:0">{{ prod.title }}</h1>
          <p>{{ prod.description }}</p>
          <p><strong>{{ prod.price | currency:'BRL':'symbol' }}</strong></p>
          <p>{{ 'CATALOG.CREATED_AT' | translate }}: {{ prod.createdAt | date:'short' }}</p>
          <p>{{ 'DETAIL.STOCK' | translate }}: {{ prod.stock }}</p>

          <button mat-raised-button color="primary" (click)="addToCart()">
            🛒 {{ 'CATALOG.ADD' | translate }}
          </button>

          <a *ngIf="auth.isAdmin()" [routerLink]="['/admin/products', prod.id, 'edit']"
             mat-stroked-button color="accent" style="margin-left:8px">
            ✏️ {{ 'CATALOG.EDIT' | translate }}
          </a>
        </div>
      </div>
    </ng-container>

    <ng-template #loading>
      <p>Carregando...</p>
    </ng-template>
  `
})
export class ProductDetailPage {
  private ar = inject(ActivatedRoute);
  private svc = inject(ProductsService);
  private cart = inject(CartService);
  auth = inject(AuthService);

  prod?: Product;
  api = () => this.svc.base();

  constructor() {
    const id = this.ar.snapshot.paramMap.get('id')!;
    this.svc.get(id).subscribe(p => this.prod = p);
  }

  addToCart() { if (this.prod) this.cart.add(this.prod); }
}