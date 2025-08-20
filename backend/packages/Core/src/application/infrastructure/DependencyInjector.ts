type DependencyFactory<T> = () => T;
type DependencyType = 'singleton' | 'transient';

interface DependencyRegistration<T> {
    factory: DependencyFactory<T>;
    type: DependencyType;
    instance?: T;
}

export class DependenceInjectionContainer {
    private dependencies: Map<string, DependencyRegistration<any>> = new Map();

    register<T>(key: string, factory: DependencyFactory<T>, type: DependencyType = 'singleton'): void {
        this.dependencies.set(key, { factory, type });
    }

    resolve<T>(key: string): T {
        const registration = this.dependencies.get(key);
        if (!registration) {
            throw new Error(`Dependency ${key} not registered`);
        }

        if (registration.type === 'singleton') {
            if (!registration.instance) {
                registration.instance = registration.factory();
            }
            return registration.instance;
        }

        return registration.factory();
    }
}