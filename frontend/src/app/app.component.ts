import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="header"><app-header></app-header></div>
    <div class="container"><router-outlet></router-outlet></div>
  `
})
export class AppComponent {}
