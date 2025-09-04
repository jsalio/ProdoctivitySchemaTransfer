import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/ui/layout.service';

@Component({
  selector: 'app-disconnected',
  standalone: true,
  imports: [],
  templateUrl: './disconnected.component.html',
  styleUrl: './disconnected.component.css',
})
export class DisconnectedComponent {
  constructor(
    private router: Router,
    private readonly layoutService: LayoutService,
  ) {}

  navigateToLogin() {
    // this.router.navigate(['/login']);
    this.layoutService.openLayoutModal();
  }
}
