import { Component } from '@angular/core';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'tzzu-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  constructor(update: UpdateService) {
    update.check();
  }
}
