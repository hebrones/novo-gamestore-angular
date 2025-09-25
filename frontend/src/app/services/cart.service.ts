import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products.service';

export interface CartItem { product: Product; quantity: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'cart';
  private subject = new BehaviorSubject<CartItem[]>(this.load());
  items$ = this.subject.asObservable();
  get items(){ return this.subject.value; }
  get total(){ return this.items.reduce((s,i)=> s + i.product.price * i.quantity, 0); }

  private load(): CartItem[] { try { return JSON.parse(localStorage.getItem(this.key) || '[]'); } catch { return []; } }
  private save(){ localStorage.setItem(this.key, JSON.stringify(this.items)); }

  add(p: Product){
    const list = [...this.items];
    const idx = list.findIndex(i => i.product.id === p.id);
    if (idx>=0) list[idx] = { product: p, quantity: list[idx].quantity + 1 };
    else list.push({ product: p, quantity: 1 });
    this.subject.next(list); this.save();
  }
  remove(p: Product){ this.subject.next(this.items.filter(i => i.product.id !== p.id)); this.save(); }
  clear(){ this.subject.next([]); this.save(); }
}
