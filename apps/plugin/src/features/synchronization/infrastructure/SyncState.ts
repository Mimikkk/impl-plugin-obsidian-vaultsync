import {
  container,
  type InstanceOf,
  resolve,
  State,
  StateCodec,
  StateFields,
  StateSchemaBuilder,
} from "@nimir/framework";

export const SyncStateSchema = container.singleton({
  create: () =>
    StateSchemaBuilder
      .create()
      .with("lastSyncTs", StateFields.number())
      .with("deletedFiles", StateFields.map<string, number>())
      .with("localFilesHashes", StateFields.map<string, string>())
      .with("remoteFilesHashes", StateFields.map<string, string>())
      .build(),
  name: "SyncStateSchema",
});
export type ISyncStateSchema = InstanceOf<typeof SyncStateSchema>;

export const SyncState = container.singleton({
  create: () => State.create(StateCodec.create(resolve(SyncStateSchema)).initial()),
  name: "SyncState",
});

export type ISyncState = InstanceOf<typeof SyncState>;
