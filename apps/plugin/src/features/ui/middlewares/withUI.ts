import { composeMiddleware } from "@plugin/core/middlewares/createMiddleware.ts";
import { withCleanup } from "@plugin/features/ui/middlewares/withCleanup.ts";
import { withCommands } from "@plugin/features/ui/middlewares/withCommands.ts";
import { withRibbon } from "@plugin/features/ui/middlewares/withRibbon.ts";
import { withStatusBar } from "@plugin/features/ui/middlewares/withStatusBar.ts";

export const withUI = composeMiddleware(withStatusBar, withRibbon, withCommands, withCleanup);
