import { State } from "../../state/infrastructure/State.ts";
import { StateCodec } from "../../state/infrastructure/StateCodec.ts";
import { StateFields } from "../../state/infrastructure/StateField.ts";
import { StateSchemaBuilder } from "../../state/infrastructure/StateSchemaBuilder.ts";

export const SyncStateSchema = StateSchemaBuilder
  .create()
  .with("lastSyncTs", StateFields.number())
  .with("deletedFiles", StateFields.map<string, number>())
  .with("localFilesHashes", StateFields.map<string, string>())
  .with("remoteFilesHashes", StateFields.map<string, string>())
  .build();

export const SyncState = State.create(StateCodec.create(SyncStateSchema).initial());
export type ISyncState = typeof SyncState;
