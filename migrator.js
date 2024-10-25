import { Twenty } from "./twenty";
import { logger } from "./logger";

export class Migrator {
  constructor(source, twentyApiKey, objectsToMigrate) {
    this.source = source;
    this.twentyApiKey = twentyApiKey;
    this.objectsToMigrate = objectsToMigrate;
  }

  async migrate() {
    const twenty = new Twenty(this.twentyApiKey);
    const fetchPromises = [];

    if (this.objectsToMigrate.includes("Companies")) {
      logger.info("Fetching companies...");
      fetchPromises.push(
        this.source.fetchCompanies().then((data) => ({
          type: "Companies",
          data,
        })),
      );
    }

    if (this.objectsToMigrate.includes("People")) {
      logger.info("Fetching people...");
      fetchPromises.push(
        this.source.fetchPeople().then((data) => ({
          type: "People",
          data,
        })),
      );
    }

    if (this.objectsToMigrate.includes("Deals")) {
      logger.info("Fetching deals...");
    }

    try {
      const results = await Promise.all(fetchPromises);
      const importPromises = [];

      for (const result of results) {
        switch (result.type) {
          case "Companies":
            logger.info("Importing companies...");
            importPromises.push(twenty.importCompanies(result.data));
            break;
          case "People":
            logger.info("Importing people...");
            importPromises.push(twenty.importPeople(result.data));
            break;
          case "Deals":
            logger.info("Importing deals...");
            break;
        }
      }

      await Promise.all(importPromises);
      logger.success("Successfully imported all objects.");
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Migration failed: ${error.message}`);
        throw error;
      }
    }
  }
}
