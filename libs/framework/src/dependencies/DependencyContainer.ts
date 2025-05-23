export type Create<T> = (...args: any[]) => T;
export type Token<T = any> = symbol & { __type?: T };
export type Constructible<T = any> = { create: Create<T>; name?: string };

export interface Registration<T = any> extends RegistrationOptions {
  create: Create<T>;
}

export interface RegistrationOptions {
  singleton: boolean;
}

const Singleton: RegistrationOptions = { singleton: true };
export class DependencyContainer {
  static create(
    registrations: Map<Constructible, Registration> = new Map(),
    instances: Map<Constructible, any> = new Map(),
  ) {
    return new DependencyContainer(registrations, instances);
  }

  private constructor(
    private readonly registrations: Map<Constructible, Registration>,
    private readonly instances: Map<Constructible, any>,
  ) {}

  register<T>(item: Constructible<T>, options?: RegistrationOptions): this {
    const createFn = (item?.create instanceof Function ? item.create : item) as Create<T>;
    const singleton = options?.singleton ?? false;

    this.registrations.set(item, { create: createFn, singleton });

    return this;
  }

  singleton<T>(create: Constructible<T>): this {
    return this.register(create, Singleton);
  }

  get<T>(item: Constructible<T>): T {
    const registration = this.registrations.get(item);

    if (!registration) {
      throw new Error(`Unregistered dependency: ${item.name}.`);
    }

    if (registration.singleton) {
      let instance = this.instances.get(item);

      if (instance === undefined) {
        instance = registration.create();

        this.instances.set(item, instance);
      }

      return instance!;
    }

    return registration.create();
  }

  has<T>(item: Constructible<T>): boolean {
    return this.registrations.has(item);
  }

  clear(): void {
    this.registrations.clear();
    this.instances.clear();
  }
}

export const container = DependencyContainer.create();
