import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/ui/layout.service';
import { CredetialConnectionService } from '../../services/ui/credetial-connection.service';

@Component({
  selector: 'app-disconnected',
  standalone: true,
  imports: [],
  templateUrl: './disconnected.component.html',
  styleUrl: './disconnected.component.css',
})
export class DisconnectedComponent {
  private router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  private readonly conectionStatus = inject(CredetialConnectionService);

  constructor() {
    effect(() => {
      if (this.conectionStatus.connectedToCloud()) {
        console.log('Redirec to normal path');
        this.router.navigate(['/']);
      }
    });
  }

  isConnected = computed(() => {
    return this.conectionStatus.connectedToCloud();
  });

  navigateToLogin() {
    this.layoutService.openLayoutModal();
  }
}
