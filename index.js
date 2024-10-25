import * as p from "@clack/prompts";
import { Migrator } from "./migrator";
import { Attio } from "./attio";
import { logger } from "./logger";

const opts = await p.group(
  {
    source: (_) =>
      p.select({
        message: `Pick a CRM to migrate to Twenty?`,
        options: [
          { value: "Attio", label: "Attio" },
          { value: "HubSpot", label: "HubSpot" },
          //{ value: "Salesforce", label: "Salesforce", hint: "Coming soon..." },
        ],
      }),
    sourceApiKey: ({ results }) =>
      p.text({ message: `What is your ${results.source} API Key?` }),
    twentyApiKey: () => p.text({ message: "What is your Twenty API Key?" }),
    objectsToMigrate: ({ results }) =>
      p.multiselect({
        message: `What Objects do you want to migrate from ${results.source} to Twenty?`,
        options: [
          { value: "People", label: "People" },
          { value: "Companies", label: "Companies" },
          { value: "Deals", label: "Deals", hint: "Coming soon..." },
        ],
      }),
  },
  {
    onCancel: () => {
      p.cancel("Operation cancelled.");
      process.exit(0);
    },
  },
);

opts.sourceApiKey = `b264aed6f44eaa4acb348fc9b87512f6f69a7aa703d7f76eb8d7ee282f6ab0d0`
opts.twentyApiKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNThmZTJlOS05YzUyLTQ1YmQtODg5OS1mOTQ0NzQxMTkxOGQiLCJpYXQiOjE3Mjg2ODMwMTYsImV4cCI6NDg4MjI4MzAxMywianRpIjoiOTFlMDM2YWYtYTQxZi00ZDg4LWI5NGItNTZkOGNhMTAyMmQ2In0.zYMjfcVEmlvAbVoTkceDCrJQngr8A3D6JyY1clSdxS0`

if (!opts.sourceApiKey) {
  logger.error("Source API key cannot be undefined");
  process.exit(1);
}

if (!opts.twentyApiKey) {
  logger.error("Twenty API key cannot be undefined");
  process.exit(1);
}

if (!opts.objectsToMigrate.length) {
  logger.error("No objects selected for migration");
  process.exit(1);
}

let migrator = null;

switch (opts.source) {
  case "Attio":
    const attio = new Attio(opts.sourceApiKey);
    migrator = new Migrator(attio, opts.twentyApiKey, opts.objectsToMigrate);
    break;
  default:
    logger.warn(`Migration from ${opts.source} is not yet supported.`);
    process.exit(1);
}

if (migrator) {
  logger.info("Starting migration...");
  await migrator.migrate();
  logger.success("Migration completed successfully.");
}
