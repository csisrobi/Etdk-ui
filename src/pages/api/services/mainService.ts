import {
  queryApplicate,
  queryArchivsBasic,
  queryArhivDetails,
  queryContact,
  queryDeadline,
  queryGeneral,
  queryGeneralRules,
  queryNews,
  queryOrg,
  querySponsor,
} from "@lib/queries";
import { getClient } from "@lib/sanity";

class MainService {
  async getSponsors(preview = false) {
    try {
      return await getClient(preview).fetch(querySponsor);
    } catch (e) {
      console.error(e);
    }
  }

  async getOrganizers(preview = false) {
    try {
      return await getClient(preview).fetch(queryOrg);
    } catch (e) {
      console.error(e);
    }
  }

  async getContacts(preview = false) {
    try {
      return await getClient(preview).fetch(queryContact);
    } catch (e) {
      console.error(e);
    }
  }

  async getGenerals(preview = false) {
    try {
      return await getClient(preview).fetch(queryGeneral);
    } catch (e) {
      console.error(e);
    }
  }
  async getApplicate(preview = false) {
    try {
      return await getClient(preview).fetch(queryApplicate);
    } catch (e) {
      console.error(e);
    }
  }
  async getNews(preview = false) {
    try {
      return await getClient(preview).fetch(queryNews);
    } catch (e) {
      console.error(e);
    }
  }
  async getArchives(preview = false) {
    try {
      return await getClient(preview).fetch(queryArchivsBasic);
    } catch (e) {
      console.error(e);
    }
  }

  async getArchiveDetails(preview: boolean, year: string) {
    try {
      return await getClient(preview).fetch(queryArhivDetails(year));
    } catch (e) {
      console.error(e);
    }
  }

  async getDeadline(preview: boolean) {
    try {
      return await getClient(preview).fetch(queryDeadline);
    } catch (e) {
      console.error(e);
    }
  }
  async getGeneralRules(preview: boolean) {
    try {
      return await getClient(preview).fetch(queryGeneralRules);
    } catch (e) {
      console.error(e);
    }
  }
}

const mainService = new MainService();

export default Object.freeze(mainService);
