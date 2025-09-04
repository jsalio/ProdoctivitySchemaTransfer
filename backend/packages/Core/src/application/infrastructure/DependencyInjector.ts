/**
 * A factory function type that creates an instance of type T
 * @template T The type of the dependency to be created
 */
type DependencyFactory<T> = () => T;

/**
 * The lifetime management type for a dependency
 * - 'singleton': Only one instance will be created and reused
 * - 'transient': A new instance will be created on each resolution
 */
type DependencyType = 'singleton' | 'transient';

/**
 * Represents a registered dependency with its factory and lifetime management
 * @template T The type of the dependency
 */
interface DependencyRegistration<T> {
  /** Factory function to create the dependency instance */
  factory: DependencyFactory<T>;

  /** The lifetime management type for this dependency */
  type: DependencyType;

  /** Cached instance (only used for singleton dependencies) */
  instance?: T;
}

/**
 * A simple dependency injection container that supports both singleton and transient dependencies.
 * This container allows registering and resolving dependencies by their string keys.
 */
export class DependenceInjectionContainer {
  /** Map to store all registered dependencies */
  private dependencies: Map<string, DependencyRegistration<any>> = new Map();

  /**
   * Registers a dependency with the container
   * @template T The type of the dependency
   * @param {string} key - The unique key to identify the dependency
   * @param {DependencyFactory<T>} factory - Factory function that creates the dependency
   * @param {DependencyType} [type='singleton'] - The lifetime management type (default: 'singleton')
   * @throws {Error} If a dependency with the same key is already registered
   */
  register<T>(
    key: string,
    factory: DependencyFactory<T>,
    type: DependencyType = 'singleton',
  ): void {
    if (this.dependencies.has(key)) {
      throw new Error(`Dependency with key '${key}' is already registered`);
    }
    this.dependencies.set(key, { factory, type });
  }

  /**
   * Resolves a dependency by its key
   * @template T The expected return type of the dependency
   * @param {string} key - The key of the dependency to resolve
   * @returns {T} The resolved dependency instance
   * @throws {Error} If no dependency is registered with the given key
   */
  resolve<T>(key: string): T {
    const registration = this.dependencies.get(key);
    if (!registration) {
      throw new Error(`Dependency '${key}' not registered`);
    }

    // For singleton, return cached instance or create and cache if not exists
    if (registration.type === 'singleton') {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      return registration.instance;
    }

    // For transient, always create a new instance
    return registration.factory();
  }
}
