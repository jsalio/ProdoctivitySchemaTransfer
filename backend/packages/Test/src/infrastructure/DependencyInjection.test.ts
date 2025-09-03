import { describe, it, expect, beforeEach } from "bun:test";
import { DependenceInjectionContainer } from "@schematransfer/core";

describe("DependenceInjectionContainer", () => {
    let container: DependenceInjectionContainer;
    
    // Test classes for dependency injection
    class TestService {
        public id: number;
        constructor() {
            this.id = Math.random();
        }
    }

    class AnotherService {
        public name: string;
        constructor() {
            this.name = `Service-${Math.random().toString(36).substring(2, 8)}`;
        }
    }

    beforeEach(() => {
        container = new DependenceInjectionContainer();
    });

    describe("register", () => {
        it("should register a singleton dependency", () => {
            container.register('testService', () => new TestService(), 'singleton');
            expect(container).toBeDefined();
        });

        it("should register a transient dependency", () => {
            container.register('testService', () => new TestService(), 'transient');
            expect(container).toBeDefined();
        });

        it("should use 'singleton' as default type when not specified", () => {
            container.register('testService', () => new TestService());
            const registration = (container as any).dependencies.get('testService');
            expect(registration.type).toBe('singleton');
        });

        it("should throw an error when registering a duplicate key", () => {
            container.register('testService', () => new TestService());
            
            expect(() => {
                container.register('testService', () => new TestService());
            }).toThrow("Dependency with key 'testService' is already registered");
        });
    });

    describe("resolve", () => {
        it("should resolve a singleton dependency with the same instance", () => {
            container.register('testService', () => new TestService(), 'singleton');
            
            const instance1 = container.resolve<TestService>('testService');
            const instance2 = container.resolve<TestService>('testService');
            
            expect(instance1).toBe(instance2);
            expect(instance1.id).toBe(instance2.id);
        });

        it("should resolve a transient dependency with new instances each time", () => {
            container.register('testService', () => new TestService(), 'transient');
            
            const instance1 = container.resolve<TestService>('testService');
            const instance2 = container.resolve<TestService>('testService');
            
            expect(instance1).not.toBe(instance2);
            expect(instance1.id).not.toBe(instance2.id);
        });

        it("should resolve multiple different dependencies", () => {
            container.register('testService', () => new TestService(), 'singleton');
            container.register('anotherService', () => new AnotherService(), 'transient');
            
            const testService = container.resolve<TestService>('testService');
            const anotherService = container.resolve<AnotherService>('anotherService');
            
            expect(testService).toBeInstanceOf(TestService);
            expect(anotherService).toBeInstanceOf(AnotherService);
            expect(anotherService.name).toMatch(/^Service-[a-z0-9]+$/);
        });

        it("should throw an error when resolving an unregistered dependency", () => {
            expect(() => {
                container.resolve('nonExistentService');
            }).toThrow("Dependency 'nonExistentService' not registered");
        });
    });

    describe("integration tests", () => {
        it("should handle complex dependency scenarios", () => {
            // Register multiple dependencies with different lifecycles
            container.register('singletonService', () => new TestService(), 'singleton');
            container.register('transientService', () => new TestService(), 'transient');
            container.register('anotherService', () => new AnotherService(), 'singleton');
            
            // Resolve instances
            const singleton1 = container.resolve<TestService>('singletonService');
            const singleton2 = container.resolve<TestService>('singletonService');
            const transient1 = container.resolve<TestService>('transientService');
            const transient2 = container.resolve<TestService>('transientService');
            const another = container.resolve<AnotherService>('anotherService');
            
            // Verify singleton behavior
            expect(singleton1).toBe(singleton2);
            expect(singleton1.id).toBe(singleton2.id);
            
            // Verify transient behavior
            expect(transient1).not.toBe(transient2);
            expect(transient1.id).not.toBe(transient2.id);
            
            // Verify different services don't interfere
            expect(singleton1).not.toBe(transient1);
            expect(singleton1).not.toBe(transient2);
            expect(another).toBeInstanceOf(AnotherService);
        });
    });
});