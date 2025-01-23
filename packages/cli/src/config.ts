import { cosmiconfig } from "cosmiconfig";
import { Config, ConfigSchema } from "./types.js";
import { findMonorepoRoot } from "./utils.js";

export async function loadConfig(configPath?: string): Promise<Config> {
  const rootDir = await findMonorepoRoot();
  const explorer = cosmiconfig("itell", {
    searchPlaces: [
      "package.json",
      ".itellrc",
      ".itellrc.json",
      ".itellrc.yaml",
      ".itellrc.yml",
      ".itellrc.js",
      ".itellrc.cjs",
      ".config/itellrc",
      ".config/itellrc.json",
      ".config/itellrc.yaml",
      ".config/itellrc.yml",
      ".config/itellrc.js",
      ".config/itellrc.cjs",
    ],
  });

  try {
    const result = configPath
      ? await explorer.load(configPath)
      : await explorer.search(rootDir);

    if (!result) {
      throw new Error("No configuration file found");
    }

    return ConfigSchema.parse(result.config);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
    throw error;
  }
}
