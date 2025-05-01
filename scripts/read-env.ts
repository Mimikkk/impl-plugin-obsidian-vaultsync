import { load } from "@std/dotenv";
import { resolve } from "@std/path";

await load({ envPath: resolve(".env.local"), export: true });
await load({ envPath: resolve(".env"), export: true });
