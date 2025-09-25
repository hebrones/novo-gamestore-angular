import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/env';

@Component({
  standalone: true,
  selector: 'app-order-summary',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatDividerModule,
    TranslateModule
  ],
  template: `
    <div class="order-summary-container">
      <div class="order-header">
        <button mat-raised-button color="primary" (click)="goBack()" class="back-btn">
          ← {{ 'COMMON.BACK' | translate }}
        </button>
        <h2>{{ 'ORDER_SUMMARY.TITLE' | translate }}</h2>
      </div>

      <!-- Resumo dos Produtos -->
      <div class="summary-section">
        <h3>🛒 {{ 'ORDER_SUMMARY.PRODUCTS' | translate }}</h3>
        <div class="product-list">
          <div class="product-item" *ngFor="let item of orderService.order.items">
            <div class="product-info">
              <img [src]="environment.apiBaseUrl + item.product.imageUrl" [alt]="item.product.title" class="product-image">
              <div class="product-details">
                <h4>{{ item.product.title }}</h4>
                <p class="product-price">{{ item.product.price | currency:'BRL':'symbol' }} cada</p>
                <p class="product-quantity">{{ 'ORDER_SUMMARY.QUANTITY' | translate }}: {{ item.quantity }}</p>
              </div>
            </div>
            <div class="product-total">
              {{ (item.product.price * item.quantity) | currency:'BRL':'symbol' }}
            </div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <div class="total-section">
          <div class="total-row">
            <span>{{ 'ORDER_SUMMARY.SUBTOTAL' | translate }}:</span>
            <span>{{ orderService.order.total | currency:'BRL':'symbol' }}</span>
          </div>
          <div class="total-row">
            <span>{{ 'ORDER_SUMMARY.SHIPPING' | translate }}:</span>
            <span class="free-shipping">{{ 'ORDER_SUMMARY.FREE_SHIPPING' | translate }}</span>
          </div>
          <div class="total-row final-total">
            <strong>{{ 'ORDER_SUMMARY.TOTAL' | translate }}: {{ orderService.order.total | currency:'BRL':'symbol' }}</strong>
          </div>
        </div>
      </div>

      <!-- Endereço de Entrega -->
      <div class="section address-section">
        <h3>📍 {{ 'ORDER_SUMMARY.DELIVERY_ADDRESS' | translate }}</h3>
        <div class="address-info">
          <p><strong>{{ orderService.order.address?.street }}, {{ orderService.order.address?.number }}</strong></p>
          <p>{{ orderService.order.address?.neighborhood }}</p>
          <p>{{ orderService.order.address?.city }} - {{ orderService.order.address?.state }}</p>
          <p>CEP: {{ orderService.order.address?.zipCode }}</p>
        </div>
      </div>

      <!-- Forma de Pagamento -->
      <div class="section payment-section">
        <h3>💳 {{ 'ORDER_SUMMARY.PAYMENT_METHOD' | translate }}</h3>
        <div class="payment-info">
          💳
          <span>Cartão de Crédito</span>
          <span *ngIf="orderService.order.payment?.cardNumber">
            **** **** **** {{ orderService.order.payment.cardNumber.slice(-4) }}
          </span>
        </div>
      </div>

      <!-- Botão de Editar -->
      <div class="edit-section">
        <button mat-stroked-button (click)="goBack()" class="edit-btn">
          ✏️ {{ 'ORDER_SUMMARY.EDIT_ORDER' | translate }}
        </button>
      </div>

      <!-- Informações Adicionais -->
      <div class="info-section">
        <div class="info-item">
          <span class="info-icon">🚚</span>
          <span>{{ 'ORDER_SUMMARY.DELIVERY_TIME' | translate }}</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🔒</span>
          <span>{{ 'ORDER_SUMMARY.SECURE_PURCHASE' | translate }}</span>
        </div>
        <div class="info-item">
          <span class="info-icon">📋</span>
          <span>{{ 'ORDER_SUMMARY.RETURN_POLICY' | translate }}</span>
        </div>
      </div>

      <!-- Botão de Finalizar Pedido -->
      <div class="finalize-section">
        <button 
          mat-raised-button 
          color="primary" 
          class="finalize-btn"
          (click)="confirmOrder()"
          [disabled]="isProcessing">
          <span *ngIf="!isProcessing">{{ 'ORDER_SUMMARY.FINALIZE_ORDER' | translate }}</span>
          <span *ngIf="isProcessing">{{ 'ORDER_SUMMARY.PROCESSING' | translate }}...</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .order-summary-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
    }

    .order-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      color: white;
    }

    .back-btn {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .order-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .section h3 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: #10b981;
    }

    /* Produtos */
    .product-list {
      margin-bottom: 20px;
    }

    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .product-item:last-child {
      border-bottom: none;
    }

    .product-info {
      display: flex;
      gap: 16px;
      flex: 1;
    }

    .product-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
    }

    .product-details h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .product-details p {
      margin: 4px 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .product-total {
      font-size: 16px;
      font-weight: 600;
      color: #10b981;
    }

    .total-section {
      margin-top: 20px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }

    .final-total {
      font-size: 20px;
      padding-top: 16px;
      border-top: 2px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
    }

    .free-shipping {
      color: #10b981;
      font-weight: 600;
    }

    /* Endereço */
    .address-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .address-card p {
      margin: 6px 0;
      line-height: 1.4;
    }

    .phone-icon {
      font-size: 16px;
      vertical-align: middle;
      margin-right: 8px;
    }

    /* Pagamento */
    .payment-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .payment-method {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .payment-method mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #10b981;
    }

    .payment-details p {
      margin: 4px 0;
      line-height: 1.4;
    }

    /* Ações */
    .actions-section {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-bottom: 32px;
    }

    .edit-btn {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .confirm-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 32px;
    }

    .confirm-btn:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.3);
    }

    .loading-icon {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Informações */
    .info-section {
      background: rgba(16, 185, 129, 0.1);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      color: white;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item mat-icon {
      color: #10b981;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .info-item strong {
      display: block;
      margin-bottom: 4px;
    }

    .info-item p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .finalize-section {
      margin-top: 32px;
      text-align: center;
      padding: 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .finalize-btn {
      font-size: 18px;
      font-weight: 600;
      padding: 16px 48px;
      border-radius: 12px;
      background: linear-gradient(45deg, #4CAF50, #45a049);
      color: white;
      box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .finalize-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(76, 175, 80, 0.4);
      background: linear-gradient(45deg, #45a049, #4CAF50);
    }

    .finalize-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .order-summary-container {
        padding: 16px;
      }

      .section {
        padding: 20px;
      }

      .product-info {
        flex-direction: column;
        gap: 12px;
      }

      .product-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .actions-section {
        flex-direction: column;
      }

      .payment-method {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class OrderSummaryPage {
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private http = inject(HttpClient);
  private cart = inject(CartService);
  orderService = inject(OrderService);
  environment = environment;

  isProcessing = false;

  constructor() {
    // Verificar se tem todos os dados necessários
    if (!this.orderService.order.address || !this.orderService.order.payment) {
      this.router.navigateByUrl('/cart');
      return;
    }
  }

  getLastFourDigits(cardNumber: string): string {
    return cardNumber.replace(/\s/g, '').slice(-4);
  }

  getInstallmentText(): string {
    const installments = this.orderService.order.payment?.installments || 1;
    const total = this.orderService.order.total;
    
    if (installments === 1) {
      return `1x de ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (à vista)`;
    } else {
      const installmentValue = total / installments;
      return `${installments}x de ${installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    }
  }

  confirmOrder() {
    this.isProcessing = true;
    
    // Preparar dados do pedido
    const orderData = {
      items: this.orderService.order.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      address: this.orderService.order.address,
      payment: this.orderService.order.payment,
      total: this.orderService.order.total
    };

    // Simular processamento do pedido
    this.http.post(`${environment.apiBaseUrl}/checkout`, orderData).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.snack.open('Pedido realizado com sucesso! 🎉', 'OK', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Limpar carrinho e dados do pedido
        this.cart.clear();
        this.orderService.clearOrder();
        
        // Redirecionar para catálogo
        setTimeout(() => {
          this.router.navigateByUrl('/catalog');
        }, 2000);
      },
      error: (error) => {
        this.isProcessing = false;
        this.snack.open('Erro ao processar pedido. Tente novamente.', 'OK', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Erro no pedido:', error);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/payment');
  }
}