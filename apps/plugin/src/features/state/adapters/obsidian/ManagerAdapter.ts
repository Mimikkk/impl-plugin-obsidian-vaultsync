import { Manager } from "@plugin/features/state/infrastructure/Manager.ts";
import { type Plugin, TFolder } from "obsidian";
import { ObsidianSerializer } from "./Serializer.ts";
import { ObsidianValidator } from "./Validator.ts";

export class ManagerAdapter {
  private static create(
    plugin: Plugin,
    validator: ObsidianValidator = ObsidianValidator.create(),
    serializer: ObsidianSerializer = ObsidianSerializer.create(),
  ) {
    return new ManagerAdapter(plugin, validator, serializer);
  }

  private constructor(
    private readonly plugin: Plugin,
    private readonly validator: ObsidianValidator,
    private readonly serializer: ObsidianSerializer,
  ) {}

  static async from(
    plugin: Plugin,
    manager: Manager = Manager.create(),
    validator: ObsidianValidator = ObsidianValidator.create(),
    serializer: ObsidianSerializer = ObsidianSerializer.create(),
  ): Promise<Manager> {
    return await ManagerAdapter.create(plugin, validator, serializer).adapt(manager);
  }

  async adapt(manager: Manager): Promise<Manager> {
    const persist = () => this.plugin.saveData(this.serializer.serialize(manager.get()));

    const initial = await this.plugin.loadData();
    if (this.validator.isValid(initial)) {
      manager.get().from(this.serializer.deserialize(initial));
    }

    this.plugin.registerEvent(this.plugin.app.vault.on("delete", (file) => {
      if (file instanceof TFolder) return;

      manager.update((state) => {
        state.deleted.add(file.path, Date.now());
      });
    }));

    this.plugin.register(manager.subscribe(persist));

    return manager;
  }
}
