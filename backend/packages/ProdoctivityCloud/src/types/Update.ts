/**
 * Defines notification preferences for document update events.
 * Specifies where update notifications should be delivered.
 */
export interface Update {
  /** Whether to send update notifications to web interface */
  sendToWeb: boolean;

  /** Whether to send update notifications to mobile devices */
  sendToMobile: boolean;
}
