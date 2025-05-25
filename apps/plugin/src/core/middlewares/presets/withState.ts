import type { State, StateRuntime, StateSchema, StateStorage } from "@nimir/framework";
import { StateCodec } from "@nimir/framework";
import { createMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { debounce, type Plugin } from "obsidian";

const d = {
  "sync": {
    "lastSyncTs": 1748094642471,
    "deletedFiles": [],
    "localFilesHashes": [
      [
        "Pasted image 20250429031735.png-1748089081238",
        "pitTpA5Qp2RJBpSxd3HRpb/c3QMOny2Mp0komVHrExY=",
      ],
      [
        "Pasted image 20250429022753.png-1748089081240",
        "VcQTBRz1u/LE5gZ4aVR/q3fvg47Fbm62JxHksfTs2SY=",
      ],
      [
        "Books/Textbooks/IT/Software architecture patterns.canvas-1748089081262",
        "J2RlqXas52hMWYLtIQKZfCgr5O4cTsvqx8jEz6r1P+w=",
      ],
      [
        "Books/Textbooks/IT/Fundamentals of software architecture, 2nd edition.canvas-1748089081250",
        "IIszCbkl3jbT2ye9MmbagGm+TM8fQ9WQTbuqEpFlmFg=",
      ],
      [
        "Books/My Youth Romantic Comedy is all wrong, as expected.md-1748089081244",
        "wjnvFLGaK9/NbhivvQOILsrP8PnKjikdzq/mK1ypkIY=",
      ],
    ],
    "remoteFilesHashes": [
      [
        "Pasted image 20250429031735.png-1748089075301",
        "pitTpA5Qp2RJBpSxd3HRpb/c3QMOny2Mp0komVHrExY=",
      ],
      [
        "Pasted image 20250429022753.png-1748089075349",
        "VcQTBRz1u/LE5gZ4aVR/q3fvg47Fbm62JxHksfTs2SY=",
      ],
      [
        "Books/Textbooks/IT/Software architecture patterns.canvas-1748089075327",
        "J2RlqXas52hMWYLtIQKZfCgr5O4cTsvqx8jEz6r1P+w=",
      ],
      [
        "Books/Textbooks/IT/Fundamentals of software architecture, 2nd edition.canvas-1748089075301",
        "IIszCbkl3jbT2ye9MmbagGm+TM8fQ9WQTbuqEpFlmFg=",
      ],
      [
        "Books/My Youth Romantic Comedy is all wrong, as expected.md-1748089075320",
        "wjnvFLGaK9/NbhivvQOILsrP8PnKjikdzq/mK1ypkIY=",
      ],
    ],
  },
};

export type StateConfiguration = { state: State; schema: StateSchema; setup?: (plugin: Plugin) => void };
export const withState = <M extends Record<string, StateConfiguration>>(configuration: M) =>
  createMiddleware(async (plugin) => {
    const data = d as Record<keyof M, StateStorage>;
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
        for (const [key, value] of Object.entries(content)) {
          const field = codec.field(key as any);

          if (!field?.validate(value)) {
            console.error("invalid value for:", key, value);
            continue;
          }

          state.set(key, field.encode(value));
        }
      } else {
        console.info("no content for:", name);
      }

      setup?.(plugin);
      state.subscribe("change", debouncedPersist);
    }

    await persist();
  });
