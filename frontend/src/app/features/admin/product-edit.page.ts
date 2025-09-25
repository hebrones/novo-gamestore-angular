import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';

@Component({
  standalone: true,
  selector: 'app-product-edit',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Editar Produto</h2>
    <form *ngIf="prod" (ngSubmit)="submit()">
      <label>Título<br><input [(ngModel)]="prod.title" name="title" required></label><br>
      <label>Descrição<br><textarea [(ngModel)]="prod.description" name="description" required></textarea></label><br>
      <label>Preço<br><input type="number" [(ngModel)]="prod.price" name="price" required></label><br>
      <label>Estoque<br><input type="number" [(ngModel)]="prod.stock" name="stock" required></label><br>
      <label>Imagem<br><input type="file" (change)="onFile($event)"></label><br>
      <img *ngIf="preview || prod.imageUrl" [src]="preview || (api()+prod.imageUrl)" width="200"><br><br>
      <button type="submit">Salvar</button>
    </form>
  `
})
export class ProductEditPage {
  private svc = inject(ProductsService);
  private ar = inject(ActivatedRoute);
  private router = inject(Router);
  prod?: Product; preview: string|ArrayBuffer|null = null; file?: File;
  api = () => this.svc.base();
  constructor(){ const id = this.ar.snapshot.paramMap.get('id')!; this.svc.get(id).subscribe(p => this.prod = p); }
  onFile(e:any){ const f=e.target.files?.[0]; if (f){ this.file=f; const r=new FileReader(); r.onload=()=> this.preview=r.result; r.readAsDataURL(f);} }
  submit(){
    if (!this.prod) return;
    const save = (imageUrl?:string) => { const payload:any={...this.prod}; if(imageUrl) payload.imageUrl=imageUrl; this.svc.update(this.prod!.id,payload).subscribe(()=> this.router.navigateByUrl('/catalog')); };
    if (this.file) this.svc.upload(this.file).subscribe(res => save(res.imageUrl)); else save();
  }
}
