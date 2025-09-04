import { Generation } from './Generation';
import { Update } from './Update';

/**
 * Represents a user's subscription settings for document generation and updates.
 * This interface tracks which events or notifications a user is subscribed to.
 */
export interface MySubscriptions {
  /** Subscription settings related to document generation events */
  generation: Generation;

  /** Subscription settings related to document update events */
  update: Update;
}
