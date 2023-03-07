import {
  checkIfAdmin,
  queryActiveSections,
  queryFaculties,
  querySectionsForScoring,
  querySubjects,
  queryUniversities,
  sectionParticipants,
} from "@lib/queries";
import { getClient } from "@lib/sanity";

class AdminService {
  async checkIfAdmin(email: string) {
    try {
      return await getClient().fetch(checkIfAdmin(email));
    } catch (e) {
      console.error(e);
    }
  }

  async getUniversities(preview: boolean) {
    try {
      return await getClient(preview || false).fetch(queryUniversities);
    } catch (e) {
      console.error(e);
    }
  }
  async getFaculties(preview: boolean) {
    try {
      return await getClient(preview || false).fetch(queryFaculties);
    } catch (e) {
      console.error(e);
    }
  }
  async getSubjects(preview: boolean) {
    try {
      return await getClient(preview || false).fetch(querySubjects);
    } catch (e) {
      console.error(e);
    }
  }
  async getSections(preview: boolean) {
    try {
      return await getClient(preview || false).fetch(queryActiveSections);
    } catch (e) {
      console.error(e);
    }
  }

  async getSectionParticipants(id: string) {
    try {
      return await getClient().fetch(sectionParticipants(id));
    } catch (e) {
      console.error(e);
    }
  }

  async getSectionsForScoring(preview: boolean) {
    try {
      return await getClient(preview || false).fetch(querySectionsForScoring);
    } catch (e) {
      console.error(e);
    }
  }
}
const adminService = new AdminService();
export default Object.freeze(adminService);
