import { expect } from "@std/expect";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { type Constructible, DependencyContainer, type Token } from "./DependencyContainer.ts";

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

  describe("Basic Registration and Resolution", () => {
    it("should register and resolve a service", () => {
      const token = container.register(AServiceImpl);
      const service = container.of(token);

      expect(service.work()).toBe("test-value");
      expect(container.has(token)).toBe(true);
    });

    it("should create different tokens for different registrations", () => {
      const container1 = DependencyContainer.create();
      const container2 = DependencyContainer.create();

      const token1 = container1.register(AServiceImpl);
      const token2 = container2.register(AServiceImpl);

      expect(token1).not.toBe(token2);
      expect(container1).not.toBe(container2);
    });

    it("should create tokens with class names", () => {
      const token = container.register(AServiceImpl);

      expect(typeof token).toBe("symbol");
      expect(token.toString()).toBe("Symbol(AServiceImpl)");
    });
  });

  describe("Singleton Registration", () => {
    it("should return the same instance for singleton services", () => {
      const token = container.singleton(ExampleService);

      const service1 = container.of(token);
      const service2 = container.of(token);
      const service3 = container.of(token);

      expect(service1).toBe(service2);
      expect(service2).toBe(service3);
      expect(ExampleService.getCount()).toBe(1);
    });

    it("should persist singleton instances across multiple calls", () => {
      const token = container.singleton(ExampleService);

      const service1 = container.of(token);
      const id = service1.getId();
      const service2 = container.of(token);

      expect(service1).toBe(service2);
      expect(service2.getId()).toBe(id);
      expect(ExampleService.getCount()).toBe(1);
    });
  });

  describe("Non-Singleton Registration", () => {
    it("should create new instances for non-singleton services", () => {
      const token = container.register(ExampleService, { singleton: false });

      const service1 = container.of(token);
      const service2 = container.of(token);
      const service3 = container.of(token);

      expect(service1).not.toBe(service2);
      expect(service2).not.toBe(service3);
      expect(ExampleService.getCount()).toBe(3);
    });

    it("should default to non-singleton when no options provided", () => {
      const token = container.register(ExampleService);

      const service1 = container.of(token);
      const service2 = container.of(token);

      expect(service1).not.toBe(service2);
      expect(ExampleService.getCount()).toBe(2);
    });

    it("should default singleton to false when no options provided", () => {
      const token = container.register(ExampleService);

      // Verify it behaves as non-singleton by checking instance creation
      const service1 = container.of(token);
      const service2 = container.of(token);

      expect(service1).not.toBe(service2);
      expect(ExampleService.getCount()).toBe(2);
    });
  });

  describe("Factory Function Registration", () => {
    it("should register and resolve factory functions", () => {
      const factoryConstructible: Constructible<AService> = {
        create: createFactoryService,
        name: "FactoryService",
      };

      const token = container.register(factoryConstructible);
      const service = container.of(token);

      expect(service.work()).toBe("factory-value");
    });

    it("should handle factory function errors gracefully", () => {
      const errorFactory: Constructible<AService> = {
        create: () => {
          throw new Error("Factory error");
        },
        name: "ErrorFactory",
      };

      const token = container.register(errorFactory);

      expect(() => container.of(token)).toThrow("Factory error");
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

      const nullToken = container.register(nullFactory);
      const undefinedToken = container.register(undefinedFactory);

      expect(container.of(nullToken)).toBe(null);
      expect(container.of(undefinedToken)).toBe(undefined);
    });
  });

  describe("Multiple Services", () => {
    it("should handle multiple different services", () => {
      const token1 = container.register(AServiceImpl);
      const token2 = container.register(BServiceImpl);

      const service1 = container.of(token1);
      const service2 = container.of(token2);

      expect(service1.work()).toBe("test-value");
      expect(service2.work()).toBe(42);
    });
  });

  describe("Error Handling", () => {
    it("should throw error for unregistered tokens", () => {
      const unregistered = Symbol("fake") as Token<AService>;

      expect(() => container.of(unregistered)).toThrow("Unregistered dependency");
    });

    it("should handle registration with invalid constructors", () => {
      // Test with null create function
      const invalidConstructible = {
        create: null as any,
        name: "InvalidService",
      };

      expect(() => {
        const token = container.register(invalidConstructible);
        container.of(token);
      }).toThrow();
    });

    it("should provide meaningful error messages for unregistered dependencies", () => {
      const unregistered = Symbol("UnknownService") as Token<AService>;

      expect(() => container.of(unregistered)).toThrow("Unregistered dependency: Symbol(UnknownService)");
    });
  });

  describe("Container State Management", () => {
    it("should correctly report token existence", () => {
      const token = container.register(AServiceImpl);
      const unregistered = Symbol("fake") as Token<AService>;

      expect(container.has(token)).toBe(true);
      expect(container.has(unregistered)).toBe(false);
    });

    it("should clear all registrations and instances", () => {
      const token1 = container.singleton(ExampleService);
      const token2 = container.register(AServiceImpl);

      container.of(token1);
      container.of(token2);

      expect(container.has(token1)).toBe(true);
      expect(container.has(token2)).toBe(true);
      expect(ExampleService.getCount()).toBe(1);

      container.clear();

      expect(container.has(token1)).toBe(false);
      expect(container.has(token2)).toBe(false);

      expect(() => container.of(token1)).toThrow();
      expect(() => container.of(token2)).toThrow();
    });

    it("should properly clean up singleton instances after clear", () => {
      const token = container.singleton(ExampleService);
      const instance1 = container.of(token);

      container.clear();

      // Re-register the same service
      const newToken = container.singleton(ExampleService);
      const instance2 = container.of(newToken);

      // Should be a new instance since the old one was cleared
      expect(instance1).not.toBe(instance2);
    });

    it("should handle multiple clears gracefully", () => {
      const token = container.register(AServiceImpl);
      container.of(token);

      container.clear();
      container.clear(); // Second clear should not throw

      expect(container.has(token)).toBe(false);
    });
  });

  describe("Type Safety and Token Management", () => {
    it("should maintain type information in tokens", () => {
      const testToken = container.register(AServiceImpl);
      const anotherToken = container.register(BServiceImpl);

      // TypeScript should enforce correct types
      const testService: AService = container.of(testToken);
      const anotherService: BService = container.of(anotherToken);

      expect(testService.work()).toBe("test-value");
      expect(anotherService.work()).toBe(42);
    });

    it("should create unique tokens even for same constructor", () => {
      const token1 = container.register(AServiceImpl);
      const token2 = container.register(AServiceImpl);

      expect(token1).not.toBe(token2);
      expect(container.has(token1)).toBe(true);
      expect(container.has(token2)).toBe(true);
    });

    it("should handle services with same name but different implementations", () => {
      class AlternativeTestService implements AService {
        static create(): AService {
          return new AlternativeTestService();
        }

        work(): string {
          return "alternative-value";
        }
      }

      const token1 = container.register(AServiceImpl);
      const token2 = container.register(AlternativeTestService);

      expect(container.of(token1).work()).toBe("test-value");
      expect(container.of(token2).work()).toBe("alternative-value");
    });
  });

  describe("Performance and Memory", () => {
    it("should handle large numbers of registrations efficiently", () => {
      const tokens: Token<AService>[] = [];
      const startTime = Date.now();

      const oneSecond = 1000;
      const registerCount = 1000;

      for (let i = 0; i < registerCount; i++) {
        const token = container.register(AServiceImpl);
        tokens.push(token);
      }

      const registrationTime = Date.now() - startTime;

      const resolveStartTime = Date.now();
      tokens.forEach((token) => container.of(token));
      const resolveTime = Date.now() - resolveStartTime;

      expect(registrationTime).toBeLessThan(oneSecond);
      expect(resolveTime).toBeLessThan(oneSecond);
      expect(tokens.length).toBe(registerCount);
    });

    it("should efficiently retrieve singleton instances", () => {
      const token = container.singleton(ExampleService);
      const startTime = performance.now();
      container.of(token);
      const firstCallTime = performance.now() - startTime;
      const cachedStartTime = performance.now();

      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        container.of(token);
      }
      const cachedCallsTime = performance.now() - cachedStartTime;

      expect(ExampleService.getCount()).toBe(1);
      expect(cachedCallsTime).toBeLessThan(firstCallTime * 50);
    });
  });

  describe("Global Container", () => {
    it("should work with the exported global container", async () => {
      const { di: global } = await import("./DependencyContainer.ts");

      const token = global.register(AServiceImpl);
      const service = global.of(token);

      expect(service.work()).toBe("test-value");

      global.clear();
    });
  });
});
