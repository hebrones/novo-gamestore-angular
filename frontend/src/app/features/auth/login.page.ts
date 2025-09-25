import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  template: `
    <h2>{{ 'LOGIN.TITLE' | translate }}</h2>
    <form (ngSubmit)="submit()">
      <label>{{ 'FORM.EMAIL' | translate }}<input [(ngModel)]="email" name="email" required/></label>
      <label>{{ 'FORM.PASSWORD' | translate }}<input [(ngModel)]="password" name="password" type="password" required/></label>
      <button type="submit">OK</button>
      <p><a routerLink="/register">Registrar</a></p>
    </form>
  `
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  email=''; password='';
  submit(){ this.auth.login(this.email, this.password).subscribe(() => this.router.navigateByUrl('/catalog')); }
}
