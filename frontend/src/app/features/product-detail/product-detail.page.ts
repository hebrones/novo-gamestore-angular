import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <button mat-icon-button (click)="goBack()" class="back-btn">
        <mat-icon>arrow_back</mat-icon>
      </button>

      <div class="product-detail" *ngIf="product()">
        <div class="product-image">
          <img [src]="api() + product()!.imageUrl" [alt]="product()!.title" />
        </div>
        
        <div class="product-info">
          <h1>{{ product()!.title }}</h1>
          <p class="description">{{ product()!.description }}</p>
          
          <div class="price-section">
            <span class="price">{{ product()!.price | currency:'BRL':'symbol' }}</span>
            <span class="stock" *ngIf="product()!.stock > 0">
              {{ product()!.stock }} em estoque
            </span>
            <span class="out-of-stock" *ngIf="product()!.stock === 0">
              Fora de estoque
            </span>
          </div>

          <div class="product-meta">
            <p><strong>Categoria:</strong> Jogo</p>
            <p><strong>Lançamento:</strong> {{ product()!.createdAt | date:'dd/MM/yyyy' }}</p>
          </div>

          <div class="actions">
            <button 
              mat-raised-button 
              color="primary" 
              (click)="addToCart(product()!)"
              [disabled]="product()!.stock === 0"
              class="add-to-cart-btn">
              <mat-icon>add_shopping_cart</mat-icon>
              {{ product()!.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível' }}
            </button>
            
            <button 
              mat-stroked-button 
              color="accent" 
              routerLink="/catalog"
              class="continue-shopping-btn">
              <mat-icon>store</mat-icon>
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="!product()">
        <p>Carregando produto...</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .back-btn {
      margin-bottom: 20px;
      color: #666;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: start;
    }

    .product-image {
      position: sticky;
      top: 20px;
    }

    .product-image img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .product-image img:hover {
      transform: scale(1.02);
    }

    .product-info {
      padding: 20px 0;
    }

    .product-info h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #333;
      line-height: 1.2;
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #666;
      margin-bottom: 30px;
    }

    .price-section {
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 12px;
      border-left: 4px solid #10b981;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #10b981;
      display: block;
      margin-bottom: 8px;
    }

    .stock {
      color: #059669;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .out-of-stock {
      color: #dc2626;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .product-meta {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .product-meta p {
      margin: 8px 0;
      color: #666;
    }

    .actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .add-to-cart-btn {
      flex: 1;
      min-width: 200px;
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
    }

    .continue-shopping-btn {
      flex: 1;
      min-width: 200px;
      height: 48px;
      font-size: 1rem;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .product-info h1 {
        font-size: 2rem;
      }

      .actions {
        flex-direction: column;
      }

      .add-to-cart-btn,
      .continue-shopping-btn {
        width: 100%;
      }
    }
  `]
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  product = signal<any>(null);
  api = () => this.productsService.base();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  private loadProduct(id: number) {
    this.productsService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: () => {
        this.snackBar.open('Produto não encontrado', 'OK', { duration: 3000 });
        this.router.navigate(['/catalog']);
      }
    });
  }

  addToCart(product: any) {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Faça login para usar o carrinho', 'OK', { duration: 1500 });
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.add(product);
    this.snackBar.open('Produto adicionado ao carrinho!', 'OK', { duration: 1200 });
  }

  goBack() {
    this.router.navigate(['/catalog']);
  }
}