import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  template: `
    <h2>{{ 'REGISTER.TITLE' | translate }}</h2>
    <form (ngSubmit)="submit()">
      <label>{{ 'FORM.NAME' | translate }}<input [(ngModel)]="name" name="name" required/></label>
      <label>{{ 'FORM.EMAIL' | translate }}<input [(ngModel)]="email" name="email" required/></label>
      <label>{{ 'FORM.PASSWORD' | translate }}<input [(ngModel)]="password" name="password" type="password" required/></label>
      <button type="submit">OK</button>
      <p><a routerLink="/login">Já tem conta? Faça login</a></p>
    </form>
  `
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  name=''; email=''; password='';
  submit(){ this.auth.register(this.name,this.email,this.password).subscribe(() => this.router.navigateByUrl('/login')); }
}
