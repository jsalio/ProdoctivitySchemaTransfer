
/**
 * Defines notification preferences for document generation events.
 * Specifies where generation notifications should be delivered.
 */
export interface Generation {
  /** Whether to send generation notifications to web interface */
  sendToWeb: boolean;
  
  /** Whether to send generation notifications to mobile devices */
  sendToMobile: boolean;
}
