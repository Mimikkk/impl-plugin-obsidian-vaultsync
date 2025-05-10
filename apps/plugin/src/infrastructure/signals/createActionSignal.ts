import { createSignal } from "solid-js";

export const createActionSignal = <A extends (...params: any[]) => any>(action: A) => {
  const [isPending, togglePending] = createSignal(false);

  const handle = async (...params: Parameters<A>): Promise<Awaited<ReturnType<A>> | undefined> => {
    if (isPending()) return;

    try {
      togglePending(true);
      return await action(...params);
    } finally {
      togglePending(false);
    }
  };

  return [handle, isPending] as const;
};
