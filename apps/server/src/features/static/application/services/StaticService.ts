import { singleton } from "@nimir/framework";
import type { StaticFileNs } from "@server/features/static/domain/StaticFile.ts";
import { StaticFileProvider } from "../../infrastructure/StaticFileProvider.ts";

@singleton
export class StaticService {
  static create(): StaticService {
    return new StaticService();
  }

  private constructor(
    private readonly provider = StaticFileProvider.create(),
  ) {}

  read<P extends StaticFileNs.Path>(path: P): Promise<StaticFileNs.FromPath<P> | undefined> {
    return this.provider.read(path);
  }
}
