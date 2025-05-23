import { container, resolve, State, StateCodec, StateFields, StateSchemaBuilder } from "@nimir/framework";

export const SyncStateSchema = {
  create: () =>
    StateSchemaBuilder
      .create()
      .with("lastSyncTs", StateFields.number())
      .with("deletedFiles", StateFields.map<string, number>())
      .with("localFilesHashes", StateFields.map<string, string>())
      .with("remoteFilesHashes", StateFields.map<string, string>())
      .build(),
  name: "SyncStateSchema",
};
container.singleton(SyncStateSchema);
export type ISyncStateSchema = typeof SyncStateSchema;

export const SyncState = {
  create: () => State.create(StateCodec.create(resolve(SyncStateSchema)).initial()),
  name: "SyncState",
};
container.singleton(SyncState);

export type ISyncState = ReturnType<typeof SyncState.create>;
