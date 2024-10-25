import axios from "axios";
import { logger } from "./logger";

const twentyApi = axios.create({
  baseURL: "https://api.twenty.com/rest",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});

export class Twenty {
  apiKey;

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async importCompanies(companies) {
    try {
      logger.info("Importing companies into Twenty!");
      const response = await twentyApi({
        method: "post",
        url: "https://api.twenty.com/rest/batch/companies",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: companies.filter((c) => c.name),
      });
      logger.success("Companies imported successfully!");

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `There was a problem with the API! Check your API_KEY`,
          error,
        );
      } else {
        logger.error(
          "There was an uknown problem... Call an ambulance!! But not for me",
        );
      }
    }
  }

  async importPeople(people) {
    try {
      logger.info("Importing contacts into Twenty!");

      await twentyApi({
        method: "post",
        url: "https://api.twenty.com/rest/batch/people",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: people,
      });

      logger.success("Contacts imported successfully!");

      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`There was a problem with the API! Check your API_KEY`);
      } else {
        logger.error(
          "There was an uknown problem... Call an ambulance!! But not for me",
        );
      }
    }
  }
}
