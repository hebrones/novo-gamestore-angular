import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.page').then(m => m.CatalogPage) },
  { path: 'product/:id', loadComponent: () => import('./features/product/product-detail.page').then(m => m.ProductDetailPage) },
  { path: 'cart', canActivate: [AuthGuard], loadComponent: () => import('./features/cart/cart.page').then(m => m.CartPage) },
  { path: 'address', canActivate: [AuthGuard], loadComponent: () => import('./features/address/address.page').then(m => m.AddressPage) },
  { path: 'payment', canActivate: [AuthGuard], loadComponent: () => import('./features/payment/payment.page').then(m => m.PaymentPage) },
  { path: 'order-summary', canActivate: [AuthGuard], loadComponent: () => import('./features/order-summary/order-summary.page').then(m => m.OrderSummaryPage) },
  { path: 'checkout', canActivate: [AuthGuard], redirectTo: 'address' }, // Redirect old checkout to new flow
  { path: 'login', loadComponent: () => import('./features/auth/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./features/auth/register.page').then(m => m.RegisterPage) },
  { path: 'admin/products/new', canActivate: [AdminGuard], loadComponent: () => import('./features/admin/product-new.page').then(m => m.ProductNewPage) },
  { path: 'admin/products/:id/edit', canActivate: [AdminGuard], loadComponent: () => import('./features/admin/product-edit.page').then(m => m.ProductEditPage) },
  { path: 'admin/users/new', canActivate: [AdminGuard], loadComponent: () => import('./features/admin/user-new.page').then(m => m.UserNewPage) },
  { path: '**', loadComponent: () => import('./shared/not-found.component').then(m => m.NotFoundComponent) }
];
