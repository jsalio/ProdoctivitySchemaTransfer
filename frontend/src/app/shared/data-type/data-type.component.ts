import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-data-type',
  standalone: true,
  imports: [],
  templateUrl: './data-type.component.html',
  styleUrl: './data-type.component.css'
})
export class DataTypeComponent {
  dataType= signal<string>("")
}
