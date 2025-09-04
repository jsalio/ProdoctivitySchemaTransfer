import { Component, input, signal } from '@angular/core';
import { stepIndicator } from '../../pages/schema-transfer/schema-transfer.component';
import { ProcessingIndicatorComponent } from '../processing-indicator/processing-indicator.component';
import { ErrorIndicatorComponent } from '../error-indicator/error-indicator.component';
import { CompleteIndicatorComponent } from '../complete-indicator/complete-indicator.component';

@Component({
  selector: 'app-indicator',
  standalone: true,
  imports: [ProcessingIndicatorComponent, ErrorIndicatorComponent, CompleteIndicatorComponent],
  templateUrl: './indicator.component.html',
  styleUrl: './indicator.component.css',
})
export class IndicatorComponent {
  labelText = input<string>('');
  stepIndicator = input<stepIndicator>('processing');
}
