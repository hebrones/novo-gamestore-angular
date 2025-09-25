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
        <button mat-icon-button (click)="goBack()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Resumo do Pedido</h2>
      </div>

      <!-- Resumo dos Produtos -->
      <div class="section products-section">
        <h3><mat-icon>shopping_cart</mat-icon> Produtos</h3>
        <div class="product-list">
          <div class="product-item" *ngFor="let item of orderService.order.items">
            <div class="product-info">
              <img [src]="item.product.image" [alt]="item.product.title" class="product-image">
              <div class="product-details">
                <h4>{{ item.product.title }}</h4>
                <p class="product-price">{{ item.product.price | currency:'BRL':'symbol' }} cada</p>
                <p class="product-quantity">Quantidade: {{ item.quantity }}</p>
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
            <span>Subtotal:</span>
            <span>{{ orderService.order.total | currency:'BRL':'symbol' }}</span>
          </div>
          <div class="total-row">
            <span>Frete:</span>
            <span class="free-shipping">Grátis</span>
          </div>
          <div class="total-row final-total">
            <strong>Total: {{ orderService.order.total | currency:'BRL':'symbol' }}</strong>
          </div>
        </div>
      </div>

      <!-- Endereço de Entrega -->
      <div class="section address-section" *ngIf="orderService.order.address">
        <h3><mat-icon>location_on</mat-icon> Endereço de Entrega</h3>
        <div class="address-card">
          <p><strong>{{ orderService.order.address.fullName }}</strong></p>
          <p>{{ orderService.order.address.street }}, {{ orderService.order.address.number }}</p>
          <p *ngIf="orderService.order.address.complement">{{ orderService.order.address.complement }}</p>
          <p>{{ orderService.order.address.neighborhood }}</p>
          <p>{{ orderService.order.address.city }}/{{ orderService.order.address.state }} - CEP: {{ orderService.order.address.zipCode }}</p>
          <p><mat-icon class="phone-icon">phone</mat-icon> {{ orderService.order.address.phone }}</p>
        </div>
      </div>

      <!-- Dados de Pagamento -->
      <div class="section payment-section" *ngIf="orderService.order.payment">
        <h3><mat-icon>payment</mat-icon> Forma de Pagamento</h3>
        <div class="payment-card">
          <div class="payment-method">
            <mat-icon>credit_card</mat-icon>
            <div class="payment-details">
              <p><strong>Cartão de Crédito</strong></p>
              <p>**** **** **** {{ getLastFourDigits(orderService.order.payment.cardNumber) }}</p>
              <p>{{ orderService.order.payment.cardName }}</p>
              <p>{{ getInstallmentText() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="actions-section">
        <button mat-stroked-button (click)="goBack()" class="edit-btn">
          <mat-icon>edit</mat-icon>
          Editar Pagamento
        </button>
        <button mat-raised-button color="primary" (click)="confirmOrder()" [disabled]="isProcessing" class="confirm-btn">
          <mat-icon *ngIf="!isProcessing">check_circle</mat-icon>
          <mat-icon *ngIf="isProcessing" class="loading-icon">hourglass_empty</mat-icon>
          {{ isProcessing ? 'Processando...' : 'Confirmar Pedido' }}
        </button>
      </div>

      <!-- Informações Adicionais -->
      <div class="info-section">
        <div class="info-item">
          <mat-icon>local_shipping</mat-icon>
          <div>
            <strong>Entrega Grátis</strong>
            <p>Prazo de entrega: 5-7 dias úteis</p>
          </div>
        </div>
        <div class="info-item">
          <mat-icon>security</mat-icon>
          <div>
            <strong>Compra Segura</strong>
            <p>Seus dados estão protegidos</p>
          </div>
        </div>
        <div class="info-item">
          <mat-icon>assignment_return</mat-icon>
          <div>
            <strong>Troca e Devolução</strong>
            <p>30 dias para trocar ou devolver</p>
          </div>
        </div>
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