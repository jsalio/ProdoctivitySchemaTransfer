import { Result } from '..';

export interface IPromise {
  /**
   * Converts a Promise to a Result type, providing a safe way to handle asynchronous operations
   * that may fail. This utility function wraps Promise operations and converts them into the
   * Result pattern, enabling more robust error handling without try-catch blocks.
   *
   * @template T - The type of the value that the Promise resolves to
   * @param promise - The Promise to convert to a Result
   * @returns A Promise that resolves to a Result<T, Error>:
   *          - On success: `{ ok: true, value: T }`
   *          - On failure: `{ ok: false, error: Error }`
   *
   * @example
   * // Basic usage with a successful promise
   * const successPromise = Promise.resolve('Hello World');
   * const result = await FromPromise(successPromise);
   *
   * if (result.ok) {
   *   console.log(result.value); // 'Hello World'
   * } else {
   *   console.error(result.error.message);
   * }
   *
   * @example
   * // Usage with a failing promise
   * const failingPromise = Promise.reject(new Error('Something went wrong'));
   * const result = await FromPromise(failingPromise);
   *
   * if (!result.ok) {
   *   console.error('Operation failed:', result.error.message);
   * }
   *
   * @example
   * // Using with async operations
   * async function fetchData(url: string): Promise<Data> {
   *   const response = await fetch(url);
   *   return response.json();
   * }
   *
   * const result = await FromPromise(fetchData('https://api.example.com/data'));
   *
   * if (result.ok) {
   *   // Process successful data
   *   processData(result.value);
   * } else {
   *   // Handle error appropriately
   *   handleError(result.error);
   * }
   *
   * @remarks
   * This function follows the Result pattern, which is a common functional programming approach
   * to error handling. It helps avoid throwing exceptions and makes error handling more explicit
   * and predictable in your codebase.
   *
   * @bestpractices
   * - Use this function when you want to convert Promise-based operations to Result-based error handling
   * - Always check the `ok` property before accessing `value` or `error`
   * - Consider using this in combination with other Result utilities for chaining operations
   * - This is particularly useful in domain logic where you want to avoid exceptions
   */
  fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>>;
}
