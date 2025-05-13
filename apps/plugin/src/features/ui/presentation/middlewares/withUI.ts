import { composeMiddleware } from "@plugin/core/infrastructure/createMiddleware.ts";
import { withCleanup } from "@plugin/features/ui/presentation/middlewares/withCleanup.ts";
import { withCommands } from "@plugin/features/ui/presentation/middlewares/withCommands.ts";
import { withRibbon } from "@plugin/features/ui/presentation/middlewares/withRibbon.ts";
import { withStatusBar } from "@plugin/features/ui/presentation/middlewares/withStatusBar.ts";

export const withUI = composeMiddleware(withStatusBar, withRibbon, withCommands, withCleanup);
