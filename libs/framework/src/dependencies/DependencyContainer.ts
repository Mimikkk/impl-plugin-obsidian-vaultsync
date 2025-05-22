export type Create<T> = (...args: any[]) => T;
export type Token<T = any> = symbol & { __type?: T };
export type Constructible<T> = { create: Create<T>; name?: string };

export interface Registration<T = any> extends RegistrationOptions {
  create: Create<T>;
}

export interface RegistrationOptions {
  singleton: boolean;
}

const Singleton: RegistrationOptions = { singleton: true };
export class DependencyContainer {
  static create(
    registrations: Map<Token, Registration> = new Map(),
    instances: Map<Token, any> = new Map(),
  ) {
    return new DependencyContainer(registrations, instances);
  }

  private constructor(
    private readonly registrations: Map<Token, Registration>,
    private readonly instances: Map<Token, any>,
  ) {}

  register<T>(create: Constructible<T>, options?: RegistrationOptions): Token<T> {
    const token = Symbol(create.name);
    const createFn = (create?.create instanceof Function ? create.create : create) as Create<T>;
    const singleton = options?.singleton ?? false;

    this.registrations.set(token, { create: createFn, singleton });

    return token;
  }

  singleton<T>(create: Constructible<T>): Token<T> {
    return this.register(create, Singleton);
  }

  of<T>(token: Token<T>): T {
    const registration = this.registrations.get(token);

    if (!registration) {
      throw new Error(`Unregistered dependency: ${token.toString()}.`);
    }

    if (registration.singleton) {
      let instance = this.instances.get(token);

      if (instance === undefined) {
        instance = registration.create();

        this.instances.set(token, instance);
      }

      return instance!;
    }

    return registration.create();
  }

  has<T>(token: Token<T>): boolean {
    return this.registrations.has(token);
  }

  clear(): void {
    this.registrations.clear();
    this.instances.clear();
  }
}

export const di = DependencyContainer.create();
