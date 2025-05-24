import { createTimeoutAccessor, withQueryClient } from "@nimir/interaction";
import { useSync } from "@plugin/features/synchronization/presentation/mutations/useSync.ts";
import { Match, Switch } from "solid-js";

export const StatusBar = withQueryClient(() => {
  const { isMutating } = useSync();
  const isSynced = createTimeoutAccessor(isMutating);

  return (
    <Switch>
      <Match when={isMutating()}>
        <div class="flex items-center gap-1 -m-1">
          <div class="h-4 w-4 -my-1">
            <svg
              class="animate-[spin_2s_linear_infinite]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </div>
          <span>Synchronizing...</span>
        </div>
      </Match>
      <Match when={isSynced()}>
        <div class="flex items-center gap-1">
          <span>Synchronized.</span>
        </div>
      </Match>
    </Switch>
  );
});
