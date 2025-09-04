/**
 * Error code for the app
 */
export enum AppCodeError {
  /**
   *  use when occurs unknow or unmanage error
   */
  UnmanagedError = 'Unmanaged Error',
  /**
   * use for notify error when try to apply action over store
   */
  StoreError = 'Store Error',
  /**
   * use for notify error when use case validation fail
   */
  ValidationsFailed = 'Validations Failed',
  /**
   * use for notify error when use case fail
   */
  UseCaseError = 'UseCase error',
}
