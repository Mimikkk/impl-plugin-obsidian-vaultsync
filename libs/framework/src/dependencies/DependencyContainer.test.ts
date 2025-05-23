import { expect } from "@std/expect";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { type Constructible, DependencyContainer } from "./DependencyContainer.ts";
import { resolve, singletonTo } from "./decorators.ts";

// Test interfaces and implementations
interface AService {
  work(): string;
}

interface BService {
  work(): number;
}

class AServiceImpl implements AService {
  static create(): AService {
    return new AServiceImpl();
  }

  private constructor() {}

  work(): string {
    return "test-value";
  }
}

class BServiceImpl implements BService {
  static create(): BService {
    return new BServiceImpl();
  }

  private constructor() {}

  work(): number {
    return 42;
  }
}

class ExampleService {
  private static count = 0;

  static create(): ExampleService {
    return new ExampleService();
  }

  private constructor() {
    ++ExampleService.count;
  }

  static getCount(): number {
    return ExampleService.count;
  }

  static resetCount(): void {
    ExampleService.count = 0;
  }

  getId(): number {
    return ExampleService.count;
  }
}

const createFactoryService = (): AService => ({
  work: () => "factory-value",
});

describe("DependencyContainer", () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = DependencyContainer.create();
    ExampleService.resetCount();
  });

  describe("Decorators", () => {
    it("should register and resolve a service", () => {
      @singletonTo(container)
      class X {
        static create(): X {
          return new X();
        }

        private constructor() {}
      }

      expect(container.has(X)).toBe(true);

      const x = resolve(X, container);
      const y = resolve(X, container);

      expect(x).toBe(y);
    });
  });

  describe("Basic Registration and Resolution", () => {
    it("should register and resolve a service", () => {
      container.register(AServiceImpl);

      expect(container.has(AServiceImpl)).toBe(true);
    });

    it("should create different tokens for different registrations", () => {
      const container1 = DependencyContainer.create();
      const container2 = DependencyContainer.create();

      container1.singleton(AServiceImpl);
      container2.singleton(AServiceImpl);

      expect(container1.get(AServiceImpl)).not.toBe(container2.get(AServiceImpl));
    });

    describe("Singleton Registration", () => {
      it("should return the same instance for singleton services", () => {
        container.singleton(ExampleService);

        const service1 = container.get(ExampleService);
        const service2 = container.get(ExampleService);
        const service3 = container.get(ExampleService);

        expect(service1).toBe(service2);
        expect(service2).toBe(service3);
        expect(ExampleService.getCount()).toBe(1);
      });

      it("should persist singleton instances across multiple calls", () => {
        container.singleton(ExampleService);

        const service1 = container.get(ExampleService);
        const id = service1.getId();
        const service2 = container.get(ExampleService);

        expect(service1).toBe(service2);
        expect(service2.getId()).toBe(id);
        expect(ExampleService.getCount()).toBe(1);
      });
    });

    describe("Non-Singleton Registration", () => {
      it("should create new instances for non-singleton services", () => {
        container.register(ExampleService, { singleton: false });

        const service1 = container.get(ExampleService);
        const service2 = container.get(ExampleService);
        const service3 = container.get(ExampleService);

        expect(service1).not.toBe(service2);
        expect(service2).not.toBe(service3);
        expect(ExampleService.getCount()).toBe(3);
      });

      it("should default to non-singleton when no options provided", () => {
        container.register(ExampleService);

        const service1 = container.get(ExampleService);
        const service2 = container.get(ExampleService);

        expect(service1).not.toBe(service2);
        expect(ExampleService.getCount()).toBe(2);
      });

      it("should default singleton to false when no options provided", () => {
        container.register(ExampleService);

        // Verify it behaves as non-singleton by checking instance creation
        const service1 = container.get(ExampleService);
        const service2 = container.get(ExampleService);

        expect(service1).not.toBe(service2);
        expect(ExampleService.getCount()).toBe(2);
      });
    });

    describe("Factory Function Registration", () => {
      it("should register and resolve factory functions", () => {
        const factory: Constructible<AService> = {
          create: createFactoryService,
          name: "FactoryService",
        };

        container.register(factory);
        const service = container.get(factory);

        expect(service.work()).toBe("factory-value");
      });

      it("should handle factory function errors gracefully", () => {
        const errorFactory: Constructible<AService> = {
          create: () => {
            throw new Error("Factory error");
          },
          name: "ErrorFactory",
        };

        container.register(errorFactory);

        expect(() => container.get(errorFactory)).toThrow("Factory error");
      });

      it("should handle factory functions that return null or undefined", () => {
        const nullFactory: Constructible<AService | null> = {
          create: () => null,
          name: "NullFactory",
        };

        const undefinedFactory: Constructible<AService | undefined> = {
          create: () => undefined,
          name: "UndefinedFactory",
        };

        container.register(nullFactory);
        container.register(undefinedFactory);

        expect(container.get(nullFactory)).toBe(null);
        expect(container.get(undefinedFactory)).toBe(undefined);
      });
    });

    describe("Multiple Services", () => {
      it("should handle multiple different services", () => {
        container.register(AServiceImpl);
        container.register(BServiceImpl);

        const service1 = container.get(AServiceImpl);
        const service2 = container.get(BServiceImpl);

        expect(service1.work()).toBe("test-value");
        expect(service2.work()).toBe(42);
      });
    });

    describe("Error Handling", () => {
      it("should throw error for unregistered tokens", () => {
        const unregistered = { create: () => {} };

        expect(() => container.get(unregistered)).toThrow("Unregistered dependency");
      });

      it("should handle registration with invalid constructors", () => {
        const invalidConstructible = {
          create: null as any,
          name: "InvalidService",
        };

        expect(() => {
          container.register(invalidConstructible);
          container.get(invalidConstructible);
        }).toThrow();
      });
    });
  });
});
