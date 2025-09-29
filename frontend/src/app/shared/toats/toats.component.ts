import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-toats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toats.component.html',
  styleUrl: './toats.component.css',
})
export class ToatsComponent implements OnInit {
  message = input<string>('');
  duration = input<number>(3000);
  isVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.show();
  }

  show = () => {
    this.isVisible.set(true);
    setTimeout(() => {
      this.close();
    }, this.duration());
  };

  close(): void {
    this.isVisible.set(false);
  }
}
