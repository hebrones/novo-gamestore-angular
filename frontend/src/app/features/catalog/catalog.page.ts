import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../services/cart.service';
import { ConfirmDialog } from '../../shared/confirm.dialog';

@Component({
  standalone: true,
  selector: 'app-catalog',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatBadgeModule, TranslateModule, ConfirmDialog],
  template: `
    <h2>{{ 'CATALOG.TITLE' | translate }}</h2>
    
    <!-- Ícone de carrinho flutuante -->
     <div class="floating-cart" *ngIf="getCartItemCount() > 0" (click)="goToCart()">
       <mat-icon 
         [matBadge]="getCartItemCount()" 
         matBadgeOverlap="false"
         matBadgeColor="accent"
         class="cart-icon">
         shopping_cart
       </mat-icon>
       <span class="cart-text">Ver Carrinho</span>
     </div>
    
    @defer (on viewport; prefetch on idle) {
      <div class="grid">
        <div class="card" *ngFor="let p of products()">
          <img [src]="api()+p.imageUrl" class="card-img" [routerLink]="['/product', p.id]" style="cursor: pointer;" />
          <h3 [routerLink]="['/product', p.id]" style="cursor: pointer; color: #10b981; text-decoration: none;">{{p.title}}</h3>
          <p>{{p.description}}</p>
          <small>{{ 'CATALOG.CREATED_AT' | translate }}: {{ p.createdAt | date:'shortDate' }}</small><br>
          <strong>{{ p.price | currency:'BRL':'symbol' }}</strong>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button mat-raised-button color="primary" (click)="addToCart(p)">
              <mat-icon>add_shopping_cart</mat-icon> {{ 'CATALOG.ADD' | translate }}
            </button>
            <button mat-stroked-button color="accent" *ngIf="isAdmin()" [routerLink]="['/admin/products', p.id, 'edit']">
              <mat-icon>edit</mat-icon> {{ 'CATALOG.EDIT' | translate }}
            </button>
            <button mat-stroked-button color="warn" *ngIf="isAdmin()" (click)="remove(p)">
              X {{ 'CATALOG.DELETE' | translate }}
            </button>
          </div>
        </div>
      </div>
    } @placeholder {
      <div class="grid"><div class="skeleton" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]"></div></div>
    } @loading {
      <p>Loading...</p>
    }
  `,
  styles: [`
    .floating-cart {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 50px;
      padding: 16px 24px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      animation: pulse-cart 2s infinite;
    }

    .floating-cart:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6);
      background: linear-gradient(135deg, #059669, #047857);
    }

    .floating-cart:active {
      transform: translateY(-2px) scale(1.02);
    }

    .cart-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .cart-text {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
    }

    @keyframes pulse-cart {
      0%, 100% {
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
      }
      50% {
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.3);
      }
    }

    /* Badge styling */
    ::ng-deep .mat-badge-content {
      background: #ff4444 !important;
      color: white !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      min-width: 20px !important;
      height: 20px !important;
      line-height: 20px !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .floating-cart {
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
      }
      
      .cart-text {
        display: none;
      }
      
      .cart-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
  `]
})
export class CatalogPage {
  private svc = inject(ProductsService);
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  products = signal<Product[]>([]);
  api = () => this.svc.base();

  constructor(){ this.svc.list().subscribe(p => this.products.set(p)); }
  isAdmin = this.auth.isAdmin;
  
  getCartItemCount(): number {
    const items = this.cart.items;
    return items ? items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
  }
  
  goToCart() {
    if (!this.auth.isLoggedIn()) {
      this.snack.open('Faça login para ver o carrinho', 'OK', { duration: 1500 });
      this.router.navigateByUrl('/login');
      return;
    }
    this.router.navigateByUrl('/cart');
  }
  
  addToCart(p: Product){
    if (!this.auth.isLoggedIn()) {
      this.snack.open('Faça login para usar o carrinho', 'OK', { duration: 1500 });
      this.router.navigateByUrl('/login');
      return;
    }
    this.cart.add(p);
    this.snack.open('Adicionado ao carrinho', 'OK', { duration: 1200 });
  }
  
  remove(p: Product){
    const dlg = this.dialog.open(ConfirmDialog, { data: { title: 'Confirmar', message: 'Tem certeza que deseja remover?' } });
    dlg.afterClosed().subscribe(ok => { if (ok) this.svc.delete(p.id).subscribe(()=> this.products.update(list => list.filter(x => x.id !== p.id))); });
  }
}
