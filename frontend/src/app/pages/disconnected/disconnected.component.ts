import { Component, computed, effect, inject, OnInit } from '@angular/core';
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
export class DisconnectedComponent implements OnInit {
  // private conectionStatus = inject(CredetialConnectionService);

  constructor(
    private router: Router,
    private readonly layoutService: LayoutService,
    private readonly conectionStatus: CredetialConnectionService,
  ) {
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

  ngOnInit(): void {}

  navigateToLogin() {
    // this.router.navigate(['/login']);
    this.layoutService.openLayoutModal();
  }
}
