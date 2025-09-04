import { CoreResult } from '../ports/Result';
import { AppCodeError } from './AppCodeError';
import { ValidationError } from './ValidationError';

/**
 * Generic interface representing a use case in the application.
 * Use cases encapsulate and implement all of the application's business rules.
 *
 * @template T - The type of the result returned by the use case
 */
export interface IUseCase<T = any> {
  /**
   * Validates the use case input parameters.
   * @returns An array of validation errors, or an empty array if validation passes.
   */
  validate(): ValidationError<T>[];

  /**
   * Executes the use case with the provided parameters.
   * @returns A promise that resolves to a CoreResult containing either the success result
   *          or an error with the corresponding AppCodeError or Error.
   */
  execute(): Promise<CoreResult<T, AppCodeError, Error>>;
}
