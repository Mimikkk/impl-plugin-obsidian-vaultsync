import { State, StateCodec, StateFields, StateSchemaBuilder } from "@nimir/framework";

export const SyncStateSchema = StateSchemaBuilder
  .create()
  .with("lastSyncTs", StateFields.number())
  .with("deletedFiles", StateFields.map<string, number>())
  .with("localFilesHashes", StateFields.map<string, string>())
  .with("remoteFilesHashes", StateFields.map<string, string>())
  .build();

export const SyncState = State.create(StateCodec.create(SyncStateSchema).initial());
export type ISyncState = typeof SyncState;
