import type { State, StateRuntime, StateSchema, StateStorage } from "@nimir/framework";
import { StateCodec } from "@nimir/framework";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { debounce, type Plugin } from "obsidian";

export type StateConfiguration = { state: State; schema: StateSchema; setup?: (plugin: Plugin) => void };
export const withState = <M extends Record<string, StateConfiguration>>(configuration: M) =>
  createMiddleware(async (plugin) => {
    const data = (await plugin.loadData()) as Record<keyof M, StateStorage>;
    const codecs = new Map<keyof M, StateCodec>();

    const persist = async () => {
      const content = {} as Record<keyof M, StateRuntime>;

      for (const name in configuration) {
        const { state } = configuration[name];

        content[name] = codecs.get(name)!.decode(state.content);
      }

      await plugin.saveData(content);
    };

    const debouncedPersist = debounce(persist, 1000, true) as never as () => Promise<void>;

    for (const name in configuration) {
      const { state, schema, setup } = configuration[name];
      const codec = StateCodec.create(schema);
      codecs.set(name, codec);

      const content = data?.[name];
      if (content) {
        const decoded = codec.decode(content);
        for (const [key, value] of Object.entries(decoded)) {
          if (!schema.validate(key, value)) {
            console.error("invalid value for:", key, value);
            continue;
          }

          state.set(key, value);
        }
      } else {
        console.info("no content for:", name);
      }

      setup?.(plugin);
      state.subscribe("change", debouncedPersist);
    }

    await persist();
  });
