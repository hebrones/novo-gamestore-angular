import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../core/env';

export interface Product { id:string; title:string; description:string; price:number; stock:number; imageUrl:string; createdAt:string; }

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  base(){ return environment.apiBaseUrl; }
  list(){ return this.http.get<Product[]>(`${this.base()}/products`); }
  get(id:string){ return this.http.get<Product>(`${this.base()}/products/${id}`); }
  getById(id:number){ return this.http.get<Product>(`${this.base()}/products/${id}`); }
  create(dto: Partial<Product>){ return this.http.post<Product>(`${this.base()}/products`, dto); }
  update(id:string, dto: Partial<Product>){ return this.http.put<Product>(`${this.base()}/products/${id}`, dto); }
  delete(id:string){ return this.http.delete(`${this.base()}/products/${id}`); }
  upload(file: File){
    const fd = new FormData(); fd.append('image', file);
    return this.http.post<{imageUrl:string}>(`${this.base()}/products/upload`, fd);
  }
}
