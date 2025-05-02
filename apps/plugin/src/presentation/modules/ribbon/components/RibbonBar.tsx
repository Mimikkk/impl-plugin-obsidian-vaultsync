import { VaultSyncService } from "@plugin/application/services/VaultSyncService.ts";
import { withQueryClient } from "@plugin/shared/withQueryClient.tsx";
import { useQuery } from "@tanstack/solid-query";

const useHealth = () =>
  useQuery(() => ({
    queryKey: ["health"],
    queryFn: () => VaultSyncService.health(),
    refetchInterval: 2000,
  }));

export const RibbonBar = withQueryClient(() => (
  <div class="absolute top-0 right-0">
    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
  </div>
));
