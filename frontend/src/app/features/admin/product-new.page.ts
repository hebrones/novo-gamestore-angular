import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-new',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Novo Produto</h2>
    <form (ngSubmit)="submit()">
      <label>Título<br><input [(ngModel)]="title" name="title" required></label><br>
      <label>Descrição<br><textarea [(ngModel)]="description" name="description" required></textarea></label><br>
      <label>Preço<br><input type="number" [(ngModel)]="price" name="price" required></label><br>
      <label>Estoque<br><input type="number" [(ngModel)]="stock" name="stock" required></label><br>
      <label>Imagem<br><input type="file" (change)="onFile($event)"></label><br>
      <img *ngIf="preview" [src]="preview" width="200"><br><br>
      <button type="submit">Criar</button>
    </form>
  `
})
export class ProductNewPage {
  private svc = inject(ProductsService);
  private router = inject(Router);
  title=''; description=''; price=0; stock=0; file?: File; preview: string|ArrayBuffer | null = null;

  onFile(e: any){ const f = e.target.files?.[0]; if (f){ this.file = f; const r = new FileReader(); r.onload = ()=> this.preview = r.result; r.readAsDataURL(f); } }
  submit(){
    const create = (imageUrl: string) => this.svc.create({ title:this.title, description:this.description, price:this.price, stock:this.stock, imageUrl }).subscribe(()=> this.router.navigateByUrl('/catalog'));
    if (this.file) this.svc.upload(this.file).subscribe(res => create(res.imageUrl));
    else create('');
  }
}
