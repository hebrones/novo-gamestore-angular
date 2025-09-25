import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './env';
import { tap } from 'rxjs/operators';

export interface User { id:string; name:string; email:string; role:'admin'|'user'; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSig = signal<User|null>(null);
  user = computed(() => this.userSig());
  isLoggedIn = computed(() => !!this.userSig());
  isAdmin = computed(() => this.userSig()?.role === 'admin');
  private tokenKey = 'app_token';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.http.get<User>(`${environment.apiBaseUrl}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
        next: (u)=> this.userSig.set(u), error: ()=> localStorage.removeItem(this.tokenKey)
      });
    }
  }
  login(email:string, password:string){
    return this.http.post<{token:string,user:User}>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap(res => { localStorage.setItem(this.tokenKey, res.token); this.userSig.set(res.user); }));
  }
  register(name:string, email:string, password:string){
    return this.http.post<User>(`${environment.apiBaseUrl}/auth/register`, { name, email, password });
  }
  logout(){ localStorage.removeItem(this.tokenKey); this.userSig.set(null); }
  get token(){ return localStorage.getItem(this.tokenKey); }
}
