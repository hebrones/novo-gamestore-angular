import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService, DeliveryAddress } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-address',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatSnackBarModule,
    TranslateModule
  ],
  template: `
    <div class="address-container">
      <div class="address-header">
        <button mat-icon-button (click)="goBack()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Endereço de Entrega</h2>
      </div>

      <div class="address-form">
        <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome Completo</mat-label>
              <input matInput formControlName="fullName" placeholder="Digite seu nome completo">
              <mat-error *ngIf="addressForm.get('fullName')?.hasError('required')">
                Nome é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2">
              <mat-label>Rua/Avenida</mat-label>
              <input matInput formControlName="street" placeholder="Digite o nome da rua">
              <mat-error *ngIf="addressForm.get('street')?.hasError('required')">
                Rua é obrigatória
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Número</mat-label>
              <input matInput formControlName="number" placeholder="123">
              <mat-error *ngIf="addressForm.get('number')?.hasError('required')">
                Número é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Complemento (Opcional)</mat-label>
              <input matInput formControlName="complement" placeholder="Apartamento, bloco, etc.">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Bairro</mat-label>
              <input matInput formControlName="neighborhood" placeholder="Digite o bairro">
              <mat-error *ngIf="addressForm.get('neighborhood')?.hasError('required')">
                Bairro é obrigatório
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>CEP</mat-label>
              <input matInput formControlName="zipCode" placeholder="00000-000" maxlength="9">
              <mat-error *ngIf="addressForm.get('zipCode')?.hasError('required')">
                CEP é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="flex-2">
              <mat-label>Cidade</mat-label>
              <input matInput formControlName="city" placeholder="Digite a cidade">
              <mat-error *ngIf="addressForm.get('city')?.hasError('required')">
                Cidade é obrigatória
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Estado</mat-label>
              <input matInput formControlName="state" placeholder="SP" maxlength="2">
              <mat-error *ngIf="addressForm.get('state')?.hasError('required')">
                Estado é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Telefone</mat-label>
              <input matInput formControlName="phone" placeholder="(11) 99999-9999">
              <mat-error *ngIf="addressForm.get('phone')?.hasError('required')">
                Telefone é obrigatório
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="goBack()" class="cancel-btn">
              Voltar
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="addressForm.invalid" class="continue-btn">
              <mat-icon>arrow_forward</mat-icon>
              Continuar para Pagamento
            </button>
          </div>
        </form>
      </div>

      <!-- Resumo do Pedido -->
      <div class="order-summary">
        <h3>Resumo do Pedido</h3>
        <div class="summary-items">
          <div class="summary-item" *ngFor="let item of cart.items">
            <span>{{ item.product.title }} x{{ item.quantity }}</span>
            <span>{{ (item.product.price * item.quantity) | currency:'BRL':'symbol' }}</span>
          </div>
        </div>
        <div class="summary-total">
          <strong>Total: {{ cart.total | currency:'BRL':'symbol' }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .address-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
    }

    .address-header {
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

    .address-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .address-form {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
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

    .flex-2 {
      flex: 2;
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

    .continue-btn {
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      font-weight: 600;
    }

    .continue-btn:disabled {
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

    /* Responsive */
    @media (max-width: 768px) {
      .address-container {
        padding: 16px;
      }

      .address-form {
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
export class AddressPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private orderService = inject(OrderService);
  cart = inject(CartService);

  addressForm: FormGroup;

  constructor() {
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      complement: [''],
      neighborhood: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });

    // Carregar dados existentes se houver
    const existingAddress = this.orderService.order.address;
    if (existingAddress) {
      this.addressForm.patchValue(existingAddress);
    }

    // Definir itens do carrinho no pedido
    this.orderService.setItems(this.cart.items, this.cart.total);
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const address: DeliveryAddress = this.addressForm.value;
      this.orderService.setAddress(address);
      this.snack.open('Endereço salvo com sucesso!', 'OK', { duration: 1500 });
      this.router.navigateByUrl('/payment');
    }
  }

  goBack() {
    this.router.navigateByUrl('/cart');
  }
}