#!/usr/bin/env node
import { program } from "commander";
import { createSyncCommand } from "./commands/sync.js";

async function main() {
  program
    .name("itell")
    .description("CLI tool for managing monorepo projects")
    .version("0.1.0");

  program.addCommand(createSyncCommand());

  await program.parseAsync();
}

main();
