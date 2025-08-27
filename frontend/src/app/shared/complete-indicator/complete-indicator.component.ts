import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-complete-indicator',
  standalone: true,
  imports: [],
  templateUrl: './complete-indicator.component.html',
  styleUrl: './complete-indicator.component.css'
})
export class CompleteIndicatorComponent {
  labelText = input<string>("")
} 
