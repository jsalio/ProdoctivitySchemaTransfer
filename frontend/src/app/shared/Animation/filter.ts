import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

/**
 * Animation trigger that provides a fade-in and slide-down/up effect with smooth transitions.
 *
 * This animation is typically used for showing/hiding filter panels, dropdowns, or any
 * collapsible content with a smooth transition effect.
 *
 * @example
 * ```html
 * <div [@fadeInOut]="isVisible ? 'visible' : 'hidden'">
 *   <!-- Content that will be animated -->
 * </div>
 * ```
 *
 * @example
 * In your component's animations array:
 * ```typescript
 * @Component({
 *   selector: 'app-filter',
 *   templateUrl: './filter.component.html',
 *   animations: [FilterAnimation]
 * })
 * ```
 */
export const FilterAnimation: AnimationTriggerMetadata = trigger('fadeInOut', [
  // Animation when element is added to the DOM
  transition(':enter', [
    // Start with zero height and fully transparent
    style({ opacity: 0, height: 0 }),
    // Animate to full height and opacity over 200ms with ease-out timing
    animate('200ms ease-out', style({ opacity: 1, height: '*' })),
  ]),
  // Animation when element is removed from the DOM
  transition(':leave', [
    // Start with current height and full opacity
    style({ opacity: 1, height: '*' }),
    // Animate to zero height and fully transparent over 200ms with ease-in timing
    animate('200ms ease-in', style({ opacity: 0, height: 0 })),
  ]),
]);
