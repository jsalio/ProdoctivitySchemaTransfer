import { Component } from '@angular/core';
import { LayoutComponent } from "./shared/layout/layout.component";
import { LoginComponent } from './pages/login/login.component';
import { ModalComponent } from './shared/modal/modal.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AppSchema';

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
