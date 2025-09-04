import { Observable, Subscription, finalize } from 'rxjs';

/**
 * ObservableHandler - A utility class that provides a fluent builder pattern for handling RxJS Observables
 * with optional async/await support.
 *
 * This class simplifies Observable handling by providing a chainable API for setting up
 * callbacks for different Observable lifecycle events (start, next, error, complete, finalize).
 * It supports both traditional Observable subscription and async/await patterns.
 *
 * @template T - The type of data emitted by the Observable
 *
 * @example
 * ```typescript
 * // Traditional Observable handling
 * ObservableHandler.handle(someObservable)
 *   .onStart(() => console.log('Starting...'))
 *   .onNext(data => console.log('Received:', data))
 *   .onError(error => console.error('Error:', error))
 *   .onComplete(() => console.log('Completed'))
 *   .onFinalize(() => console.log('Finalized'))
 *   .execute();
 *
 * // Async/await pattern
 * try {
 *   const result = await ObservableHandler.handle(someObservable)
 *     .onStart(() => console.log('Starting...'))
 *     .onError(error => console.error('Error:', error))
 *     .executeAsync();
 *   console.log('Result:', result);
 * } catch (error) {
 *   console.error('Failed:', error);
 * }
 * ```
 */
export class ObservableHandler<T> {
  private _onNext?: (data: T) => void;
  private _onError?: (error: any) => void;
  private _onComplete?: () => void;
  private _onFinalize?: () => void;
  private _onStart?: () => void;

  /**
   * Creates a new ObservableHandler instance.
   *
   * @param observable - The RxJS Observable to handle
   */
  constructor(private observable: Observable<T>) {}

  /**
   * Static factory method to create an ObservableHandler instance.
   * This is the preferred way to create an ObservableHandler.
   *
   * @param observable - The RxJS Observable to handle
   * @returns A new ObservableHandler instance
   *
   * @example
   * ```typescript
   * const handler = ObservableHandler.handle(myObservable);
   * ```
   */
  static handle<T>(observable: Observable<T>): ObservableHandler<T> {
    return new ObservableHandler(observable);
  }

  /**
   * Sets a callback to be executed when the Observable execution starts.
   *
   * @param callback - Function to execute at the start of Observable execution
   * @returns The ObservableHandler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onStart(() => {
   *   console.log('Observable execution started');
   *   // Show loading indicator, etc.
   * });
   * ```
   */
  onStart(callback: () => void): ObservableHandler<T> {
    this._onStart = callback;
    return this;
  }

  /**
   * Sets a callback to be executed when the Observable emits a value.
   *
   * @param callback - Function to execute when a value is emitted, receives the emitted data
   * @returns The ObservableHandler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onNext((data) => {
   *   console.log('Received data:', data);
   *   // Process the data, update UI, etc.
   * });
   * ```
   */
  onNext(callback: (data: T) => void): ObservableHandler<T> {
    this._onNext = callback;
    return this;
  }

  /**
   * Sets a callback to be executed when the Observable encounters an error.
   *
   * @param callback - Function to execute when an error occurs, receives the error object
   * @returns The ObservableHandler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onError((error) => {
   *   console.error('Observable error:', error);
   *   // Show error message, retry logic, etc.
   * });
   * ```
   */
  onError(callback: (error: any) => void): ObservableHandler<T> {
    this._onError = callback;
    return this;
  }

  /**
   * Sets a callback to be executed when the Observable completes successfully.
   *
   * @param callback - Function to execute when the Observable completes
   * @returns The ObservableHandler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onComplete(() => {
   *   console.log('Observable completed successfully');
   *   // Hide loading indicator, show success message, etc.
   * });
   * ```
   */
  onComplete(callback: () => void): ObservableHandler<T> {
    this._onComplete = callback;
    return this;
  }

  /**
   * Sets a callback to be executed when the Observable finalizes (completes, errors, or is unsubscribed).
   * This callback is guaranteed to be called regardless of how the Observable ends.
   *
   * @param callback - Function to execute when the Observable finalizes
   * @returns The ObservableHandler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onFinalize(() => {
   *   console.log('Observable finalized');
   *   // Cleanup resources, hide loading indicators, etc.
   * });
   * ```
   */
  onFinalize(callback: () => void): ObservableHandler<T> {
    this._onFinalize = callback;
    return this;
  }

  /**
   * Executes the Observable using traditional subscription pattern.
   * Returns a Subscription object that can be used to unsubscribe.
   *
   * This method is suitable when you need to:
   * - Handle multiple emissions from the Observable
   * - Manually control subscription lifecycle
   * - Use the Observable in a reactive programming context
   *
   * @returns RxJS Subscription object for managing the subscription
   *
   * @example
   * ```typescript
   * const subscription = handler
   *   .onNext(data => console.log(data))
   *   .onError(error => console.error(error))
   *   .execute();
   *
   * // Later, unsubscribe when needed
   * subscription.unsubscribe();
   * ```
   */
  execute(): Subscription {
    this._onStart?.();

    return this.observable.pipe(finalize(() => this._onFinalize?.())).subscribe({
      next: this._onNext || (() => {}),
      error: this._onError || (() => {}),
      complete: this._onComplete || (() => {}),
    });
  }

  /**
   * Executes the Observable using async/await pattern.
   * Returns a Promise that resolves with the first emitted value or rejects with an error.
   *
   * This method is suitable when you need to:
   * - Use async/await syntax for better readability
   * - Handle single-value Observables (like HTTP requests)
   * - Integrate with other async code
   *
   * Note: This method will resolve with the first emitted value and then complete.
   * For Observables that emit multiple values, only the first value will be returned.
   *
   * @returns Promise that resolves with the emitted data or rejects with an error
   *
   * @example
   * ```typescript
   * try {
   *   const result = await handler
   *     .onStart(() => console.log('Starting...'))
   *     .onError(error => console.error('Error:', error))
   *     .executeAsync();
   *   console.log('Success:', result);
   * } catch (error) {
   *   console.error('Failed:', error);
   * }
   * ```
   */
  async executeAsync(): Promise<T> {
    this._onStart?.();

    return new Promise<T>((resolve, reject) => {
      this.observable.pipe(finalize(() => this._onFinalize?.())).subscribe({
        next: (data: T) => {
          this._onNext?.(data);
          resolve(data);
        },
        error: (error: any) => {
          this._onError?.(error);
          reject(error);
        },
        complete: () => {
          this._onComplete?.();
        },
      });
    });
  }

  /**
   * Executes the Observable using a clean async/await pattern without callbacks.
   * Only the onStart and onFinalize callbacks are executed.
   *
   * This method is suitable when you want:
   * - Minimal callback overhead
   * - Clean async/await syntax
   * - Only start/finalize lifecycle management
   *
   * Note: This method will resolve with the first emitted value and then complete.
   * For Observables that emit multiple values, only the first value will be returned.
   *
   * @returns Promise that resolves with the emitted data or rejects with an error
   *
   * @example
   * ```typescript
   * try {
   *   const result = await handler
   *     .onStart(() => console.log('Starting...'))
   *     .onFinalize(() => console.log('Finished'))
   *     .executeAsyncClean();
   *   console.log('Result:', result);
   * } catch (error) {
   *   console.error('Error:', error);
   * }
   * ```
   */
  async executeAsyncClean(): Promise<T> {
    this._onStart?.();

    try {
      const result = await new Promise<T>((resolve, reject) => {
        this.observable.subscribe({
          next: resolve,
          error: reject,
        });
      });

      return result;
    } finally {
      this._onFinalize?.();
    }
  }
}
