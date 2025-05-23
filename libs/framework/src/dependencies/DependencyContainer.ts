export type Create<T> = (...args: any[]) => T;
export type Constructible<T = any> = { create: Create<T>; name?: string };
export type InstanceOf<C extends Constructible> = C extends { create: Create<infer T> } ? T : never;

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

  register<T extends Constructible>(item: T, options?: RegistrationOptions): T {
    const createFn = (item?.create instanceof Function ? item.create : item) as Create<T>;
    const singleton = options?.singleton ?? false;

    this.registrations.set(item, { create: createFn, singleton });

    return item;
  }

  singleton<T extends Constructible>(item: T): T {
    return this.register(item, Singleton);
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
