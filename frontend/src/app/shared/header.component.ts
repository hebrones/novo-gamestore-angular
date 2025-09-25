import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatBadgeModule, TranslateModule],
  template: `
  <header class="modern-header">
    <div class="header-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <a routerLink="/catalog" class="logo">
          <mat-icon class="logo-icon">gamepad</mat-icon>
          <span class="logo-text">Games Box Brasil</span>
        </a>
      </div>

      <!-- Navigation Section -->
      <nav class="nav-section">
        <a routerLink="/catalog" class="nav-link">
          <mat-icon>store</mat-icon>
          <span>{{ 'HEADER.CATALOG' | translate }}</span>
        </a>
        <a routerLink="/cart" *ngIf="auth.isLoggedIn()" 
           class="nav-link cart-link"
           [matBadge]="getCartItemCount()" 
           matBadgeOverlap="false"
           matBadgeColor="accent">
          <mat-icon>shopping_cart</mat-icon>
          <span>{{ 'HEADER.CART' | translate }}</span>
        </a>
        <a routerLink="/checkout" *ngIf="auth.isLoggedIn()" class="nav-link">
          <mat-icon>payment</mat-icon>
          <span>{{ 'HEADER.CHECKOUT' | translate }}</span>
        </a>
        <a routerLink="/admin/products/new" *ngIf="auth.isAdmin()" class="nav-link admin-link">
          <mat-icon>admin_panel_settings</mat-icon>
          <span>{{ 'HEADER.ADMIN' | translate }}</span>
        </a>
      </nav>

      <!-- Actions Section -->
      <div class="actions-section">
        <button mat-icon-button class="action-btn lang-btn" (click)="toggleLang()">
          <mat-icon>translate</mat-icon>
          <span class="lang-text">{{ currentLang.toUpperCase() }}</span>
        </button>
        
        <div class="auth-buttons" *ngIf="!auth.isLoggedIn()">
          <button mat-raised-button color="primary" routerLink="/login" class="login-btn">
            <mat-icon>login</mat-icon>
            {{ 'HEADER.LOGIN' | translate }}
          </button>
          <button mat-stroked-button routerLink="/register" class="register-btn">
            <mat-icon>person_add</mat-icon>
            Cadastrar
          </button>
        </div>
        
        <button mat-raised-button color="warn" *ngIf="auth.isLoggedIn()" 
                (click)="auth.logout()" class="logout-btn">
          <mat-icon>logout</mat-icon>
          {{ 'HEADER.LOGOUT' | translate }}
        </button>
      </div>
    </div>
  </header>
  `,
  styles: [`
    .modern-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      max-width: 1200px;
      margin: 0 auto;
      gap: 24px;
    }

    .logo-section .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: white;
      font-weight: 700;
      font-size: 24px;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    .logo-icon {
      font-size: 32px;
      color: #ffd700;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .logo-text {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Animações e transições suaves */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes glow {
      0%, 100% {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      50% {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.5);
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      justify-content: center;
      animation: slideIn 0.6s ease-out;
    }

    

    .nav-link:nth-child(1) { animation-delay: 0.1s; }
    .nav-link:nth-child(2) { animation-delay: 0.2s; }
    .nav-link:nth-child(3) { animation-delay: 0.3s; }
    .nav-link:nth-child(4) { animation-delay: 0.4s; }

    .logo-text {
      background: linear-gradient(45deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: glow 3s ease-in-out infinite;
    }

    /* Efeito de ripple ao clicar já incluído na regra principal .nav-link */

    .nav-link::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }

    .nav-link:active::after {
      width: 300px;
      height: 300px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 25px;
      text-decoration: none;
      color: white;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.8s ease-out;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .nav-link:active {
      transform: translateY(-1px) scale(0.98);
      transition: all 0.1s ease;
    }

    .nav-link mat-icon {
      font-size: 20px;
      transition: all 0.3s ease;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .nav-link:hover mat-icon {
      transform: scale(1.1) rotate(5deg);
      color: #ffd700;
    }

    .cart-link {
      position: relative;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.1));
      border-color: rgba(76, 175, 80, 0.4);
    }

    .cart-link:hover {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.2));
      border-color: rgba(76, 175, 80, 0.6);
      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3), 0 0 20px rgba(76, 175, 80, 0.2);
    }

    .admin-link {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.1));
      border-color: rgba(255, 107, 107, 0.4);
      animation: pulse-admin 2s infinite;
    }

    .admin-link:hover {
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(238, 90, 36, 0.2));
      border-color: rgba(255, 107, 107, 0.6);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4), 0 0 20px rgba(255, 107, 107, 0.3);
      animation: none;
    }

    @keyframes pulse-admin {
      0%, 100% {
        box-shadow: 0 0 5px rgba(255, 107, 107, 0.3);
      }
      50% {
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.5), 0 0 25px rgba(255, 107, 107, 0.3);
      }
    }

    /* Link específico com efeito especial */
    .nav-link:nth-child(1) {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(21, 101, 192, 0.05));
      border-color: rgba(33, 150, 243, 0.3);
    }

    .nav-link:nth-child(1):hover {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.25), rgba(21, 101, 192, 0.15));
      border-color: rgba(33, 150, 243, 0.5);
      box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3), 0 0 20px rgba(33, 150, 243, 0.2);
    }

    .actions-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-btn {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border-radius: 20px;
    }

    .lang-text {
      font-size: 12px;
      font-weight: 600;
    }

    .auth-buttons {
      display: flex;
      gap: 8px;
    }

    .login-btn, .register-btn, .logout-btn {
      border-radius: 20px;
      font-weight: 600;
      text-transform: none;
      padding: 8px 20px;
    }

    .login-btn {
      background: linear-gradient(45deg, #4CAF50, #45a049);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .register-btn {
      color: white;
      border-color: rgba(255, 255, 255, 0.5);
    }

    .logout-btn {
      background: linear-gradient(45deg, #f44336, #d32f2f);
      box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-container {
        padding: 8px 16px;
        gap: 12px;
      }

      .nav-section {
        gap: 8px;
      }

      .nav-link span {
        display: none;
      }

      .logo-text {
        display: none;
      }

      .lang-text {
        display: none;
      }

      .auth-buttons {
        flex-direction: column;
        gap: 4px;
      }
    }

    /* Badge Styling */
    ::ng-deep .mat-badge-content {
      background: #ff4444;
      color: white;
      font-weight: 600;
      font-size: 11px;
    }

    /* Button Hover Effects */
    .login-btn:hover, .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .register-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  `]
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  ts = inject(TranslateService);
  currentLang = (localStorage.getItem('lang')||'pt');

  getCartItemCount(): number {
    const items = this.cart.items;
    return items ? items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
    this.ts.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
  }
}
