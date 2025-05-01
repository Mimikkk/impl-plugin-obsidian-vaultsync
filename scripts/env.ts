import { load } from "jsr:@std/dotenv";
import { resolve } from "jsr:@std/path";

await load({ envPath: resolve(".env.local"), export: true });
await load({ envPath: resolve(".env"), export: true });
