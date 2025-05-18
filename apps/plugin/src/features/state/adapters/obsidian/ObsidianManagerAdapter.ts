import { type Plugin, TFolder } from "obsidian";
import { StateManager } from "../../infrastructure/SyncStateManager.ts";
import { ObsidianStateSerializer } from "./ObsidianStateSerializer.ts";
import { ObsidianStateValidator } from "./ObsidianStateValidator.ts";

export class ObsidianManagerAdapter {
  private static create(
    plugin: Plugin,
    validator: ObsidianStateValidator = ObsidianStateValidator.create(),
    serializer: ObsidianStateSerializer = ObsidianStateSerializer.create(),
  ) {
    return new ObsidianManagerAdapter(plugin, validator, serializer);
  }

  private constructor(
    private readonly plugin: Plugin,
    private readonly validator: ObsidianStateValidator,
    private readonly serializer: ObsidianStateSerializer,
  ) {}

  static async from(
    plugin: Plugin,
    manager: StateManager = StateManager.create(),
    validator: ObsidianStateValidator = ObsidianStateValidator.create(),
    serializer: ObsidianStateSerializer = ObsidianStateSerializer.create(),
  ): Promise<StateManager> {
    return await ObsidianManagerAdapter.create(plugin, validator, serializer).adapt(manager);
  }

  async adapt(manager: StateManager): Promise<StateManager> {
    const persist = () => this.plugin.saveData(this.serializer.serialize(manager.get()));

    const initial = await this.plugin.loadData();
    if (this.validator.isValid(initial)) {
      manager.get().from(this.serializer.deserialize(initial));
    }

    this.plugin.registerEvent(this.plugin.app.vault.on("delete", (file) => {
      if (file instanceof TFolder) return;

      manager.update((state) => {
        state.deletedFiles.add(file.path, Date.now());
      });
    }));

    this.plugin.register(manager.subscribe(persist));

    return manager;
  }
}
