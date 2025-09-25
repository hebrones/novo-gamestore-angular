import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/env';

@Component({
  standalone: true,
  selector: 'app-user-new',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Novo Usuário</h2>
    <form (ngSubmit)="submit()">
      <label>Nome<br><input [(ngModel)]="name" name="name" required></label><br>
      <label>Email<br><input [(ngModel)]="email" name="email" required></label><br>
      <label>Senha<br><input type="password" [(ngModel)]="password" name="password" required></label><br>
      <label>Papel<br>
        <select [(ngModel)]="role" name="role">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </label><br><br>
      <button type="submit">Criar</button>
    </form>
  `
})
export class UserNewPage {
  name=''; email=''; password=''; role:'user'|'admin'='user';
  private http = inject(HttpClient);
  submit(){ this.http.post(`${environment.apiBaseUrl}/auth/register`, { name:this.name, email:this.email, password:this.password, role:this.role }).subscribe(); }
}
