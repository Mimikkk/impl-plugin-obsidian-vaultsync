import type { Awaitable } from "@plugin/shared/common-types.ts";
import { createSignal } from "solid-js";

export const createLoadingSignal = (action: () => Awaitable<void>) => {
  const [isDisabled, setIsDisabled] = createSignal(false);

  const handle = async () => {
    if (isDisabled()) return;

    try {
      setIsDisabled(true);
      await action();
    } finally {
      setIsDisabled(false);
    }
  };

  return [handle, isDisabled] as const;
};
