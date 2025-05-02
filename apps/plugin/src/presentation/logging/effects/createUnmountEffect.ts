import { onCleanup } from "solid-js";

export const createUnmountEffect = () => {
  console.log("Sync plugin mounted.");

  onCleanup(() => {
    console.log("Sync plugin unmounted.");
  });
};
