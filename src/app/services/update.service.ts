import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public check() {
    if (!this.updates.isEnabled) {
      console.warn('Service Workers not enabled / supported');
      return;
    }

    this.updates.available.subscribe(() => {
      this.snackBar.open('Update verfügbar', 'Aktualisieren').onAction().subscribe(() => {
        this.updates.activateUpdate().then(() => {
          // Reload the page to display newly activated version
          document.location.reload();
        }).catch(() => {
          this.snackBar.open('Neue Version konnte nicht aktiviert werden', 'Ok');
        });
      });
    });
  }
  constructor(private readonly updates: SwUpdate, private readonly snackBar: MatSnackBar) {
  }
}
