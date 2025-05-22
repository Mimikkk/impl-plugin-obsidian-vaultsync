import { State } from "../../../core/infrastructure/state/State.ts";
import { StateCodec } from "../../../core/infrastructure/state/StateCodec.ts";
import { StateFields } from "../../../core/infrastructure/state/StateField.ts";
import { StateSchemaBuilder } from "../../../core/infrastructure/state/StateSchemaBuilder.ts";

export const SyncStateSchema = StateSchemaBuilder
  .create()
  .with("lastSyncTs", StateFields.number())
  .with("deletedFiles", StateFields.map<string, number>())
  .with("localFilesHashes", StateFields.map<string, string>())
  .with("remoteFilesHashes", StateFields.map<string, string>())
  .build();

export const SyncState = State.create(StateCodec.create(SyncStateSchema).initial());
export type ISyncState = typeof SyncState;
