import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService, PaymentData } from '../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-payment',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule
  ],
  template: `
    <div class="payment-container">
      <div class="payment-header">
        <button mat-icon-button (click)="goBack()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Pagamento</h2>
      </div>

      <!-- Resumo do Endereço -->
      <div class="address-summary" *ngIf="orderService.order.address">
        <h3>Endereço de Entrega</h3>
        <div class="address-info">
          <p><strong>{{ orderService.order.address.fullName }}</strong></p>
          <p>{{ orderService.order.address.street }}, {{ orderService.order.address.number }}</p>
          <p *ngIf="orderService.order.address.complement">{{ orderService.order.address.complement }}</p>
          <p>{{ orderService.order.address.neighborhood }} - {{ orderService.order.address.city }}/{{ orderService.order.address.state }}</p>
          <p>CEP: {{ orderService.order.address.zipCode }}</p>
          <p>Tel: {{ orderService.order.address.phone }}</p>
        </div>
      </div>

      <!-- Formulário de Pagamento -->
      <div class="payment-form">
        <h3>Dados do Cartão de Crédito</h3>
        <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome no Cartão</mat-label>
              <input matInput formControlName="cardName" placeholder="Digite o nome como está no cartão">
              <mat-error *ngIf="paymentForm.get('cardName')?.hasError('required')">
                Nome no cartão é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Número do Cartão</mat-label>
              <input matInput formControlName="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" (input)="formatCardNumber($event)">
              <mat-error *ngIf="paymentForm.get('cardNumber')?.hasError('required')">
                Número do cartão é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Validade</mat-label>
              <input matInput formControlName="expiryDate" placeholder="MM/AA" maxlength="5" (input)="formatExpiryDate($event)">
              <mat-error *ngIf="paymentForm.get('expiryDate')?.hasError('required')">
                Validade é obrigatória
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>CVV</mat-label>
              <input matInput formControlName="cvv" placeholder="123" maxlength="4" type="password">
              <mat-error *ngIf="paymentForm.get('cvv')?.hasError('required')">
                CVV é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>CPF do Portador</mat-label>
              <input matInput formControlName="cpf" placeholder="000.000.000-00" maxlength="14" (input)="formatCPF($event)">
              <mat-error *ngIf="paymentForm.get('cpf')?.hasError('required')">
                CPF é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Parcelas</mat-label>
              <mat-select formControlName="installments">
                <mat-option value="1">1x de {{ orderService.order.total | currency:'BRL':'symbol' }} (à vista)</mat-option>
                <mat-option value="2">2x de {{ (orderService.order.total / 2) | currency:'BRL':'symbol' }}</mat-option>
                <mat-option value="3">3x de {{ (orderService.order.total / 3) | currency:'BRL':'symbol' }}</mat-option>
                <mat-option value="6">6x de {{ (orderService.order.total / 6) | currency:'BRL':'symbol' }}</mat-option>
                <mat-option value="12">12x de {{ (orderService.order.total / 12) | currency:'BRL':'symbol' }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="goBack()" class="cancel-btn">
              Voltar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="paymentForm.invalid" class="pay-btn">
              <mat-icon>payment</mat-icon>
              Finalizar Pagamento
            </button>
          </div>
        </form>
      </div>

      <!-- Resumo do Pedido -->
      <div class="order-summary">
        <h3>Resumo do Pedido</h3>
        <div class="summary-items">
          <div class="summary-item" *ngFor="let item of orderService.order.items">
            <span>{{ item.product.title }} x{{ item.quantity }}</span>
            <span>{{ (item.product.price * item.quantity) | currency:'BRL':'symbol' }}</span>
          </div>
        </div>
        <div class="summary-total">
          <strong>Total: {{ orderService.order.total | currency:'BRL':'symbol' }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
    }

    .payment-header {
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

    .payment-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .address-summary {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .address-summary h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: #10b981;
    }

    .address-info p {
      margin: 4px 0;
      line-height: 1.4;
    }

    .payment-form {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .payment-form h3 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
      color: white;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .flex-1 {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .cancel-btn {
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .pay-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 24px;
    }

    .pay-btn:disabled {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.3);
    }

    .order-summary {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }

    .order-summary h3 {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .summary-items {
      margin-bottom: 16px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .summary-total {
      padding-top: 16px;
      border-top: 2px solid rgba(16, 185, 129, 0.3);
      font-size: 18px;
    }

    /* Material Form Field Styling */
    ::ng-deep .mat-mdc-form-field {
      --mdc-filled-text-field-label-text-color: rgba(255, 255, 255, 0.7);
      --mdc-filled-text-field-input-text-color: white;
      --mdc-outlined-text-field-label-text-color: rgba(255, 255, 255, 0.7);
      --mdc-outlined-text-field-input-text-color: white;
      --mdc-outlined-text-field-outline-color: rgba(255, 255, 255, 0.3);
      --mdc-outlined-text-field-hover-outline-color: rgba(255, 255, 255, 0.5);
      --mdc-outlined-text-field-focus-outline-color: #10b981;
    }

    ::ng-deep .mat-mdc-input-element::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    ::ng-deep .mat-mdc-select-value {
      color: white;
    }

    ::ng-deep .mat-mdc-select-arrow {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .payment-container {
        padding: 16px;
      }

      .payment-form {
        padding: 20px;
      }

      .form-row {
        flex-direction: column;
        gap: 8px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PaymentPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  orderService = inject(OrderService);

  paymentForm: FormGroup = this.fb.group({
    cardName: ['', [Validators.required]],
    cardNumber: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    installments: [1, [Validators.required]]
  });

  constructor() {
    // Verificar se tem endereço
    if (!this.orderService.order.address) {
      this.router.navigateByUrl('/address');
      return;
    }

    // Carregar dados existentes se houver
    const existingPayment = this.orderService.order.payment;
    if (existingPayment) {
      this.paymentForm.patchValue(existingPayment);
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    this.paymentForm.get('cardNumber')?.setValue(formattedValue);
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.get('expiryDate')?.setValue(value);
  }

  formatCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.paymentForm.get('cpf')?.setValue(value);
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const payment: PaymentData = this.paymentForm.value;
      this.orderService.setPayment(payment);
      this.snack.open('Dados de pagamento salvos!', 'OK', { duration: 1500 });
      this.router.navigateByUrl('/order-summary');
    }
  }

  goBack() {
    this.router.navigateByUrl('/address');
  }
}
