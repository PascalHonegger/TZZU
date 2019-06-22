import { Component } from '@angular/core';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'tzzu-root',
  template: `
  <mat-toolbar color="primary">
    <span>TZZU / Lektionenplan</span>

    <!-- This fills the remaining space of the current row -->
    <span class="fill-remaining-space"></span>

    <a mat-raised-button color="accent" routerLink="/tzzu">TZZU erstellen</a>
    <a mat-raised-button color="accent" routerLink="/lektionsplan">Lektionsplan erstellen</a>
  </mat-toolbar>
  <router-outlet></router-outlet>
  <footer>
    <span>Proudly presented by <a href="https://sec6.ch/">Section Six</a></span>
    <span class="fill-remaining-space"></span>
    <span>Fragen und Feedback an <a mat-button href="mailto:stan.olsen@tutanota.com"><mat-icon>mail</mat-icon> stan.olsen@tutanota.com</a></span>
  </footer>
  `,
  styles: [
    '.fill-remaining-space { flex: 1 1 auto; }',
    'a + a { margin-left: 10px; }',
    'footer { display: flex; }'
  ]
})
export class AppComponent {
  constructor(update: UpdateService) {
    update.check();
  }
}
