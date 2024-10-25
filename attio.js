import axios from "axios";
import { logger } from "./logger";
import { mapAttioCompanyData, mapAttioPersonData } from "./attio_mappers";

const attioApi = axios.create({
  baseURL: "https://api.attio.com/v2",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
});

export class Attio {
  name = "Attio";
  apiKey;

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchCompanies() {
    try {
      logger.info(`Fetching companies from Attio`);

      const response = await attioApi({
        method: "post",
        url: "https://api.attio.com/v2/objects/companies/records/query",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          limit: 500,
          offset: 0,
        },
      });

      logger.info("Companies fetch completed successfully!");
      return mapAttioCompanyData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `There was a problem with the API! Check your Attio API_KEY`,
        );
      } else {
        logger.error(
          "There was an uknown problem... Call an ambulance!! But not for me",
        );
      }
    }
  }

  async fetchPeople() {
    try {
      logger.info(`Fetching contacts from Attio`);

      const response = await attioApi({
        method: "post",
        url: "https://api.attio.com/v2/objects/people/records/query",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          limit: 500,
          offset: 0,
        },
      });

      logger.info("People fetch completed successfully!");

      return mapAttioPersonData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `There was a problem with the API! Check your Attio API_KEY`,
        );
      } else {
        logger.error(
          "There was an uknown problem... Call an ambulance!! But not for me",
        );
      }
    }
  }
}
