import {
  checkIfUniqueEmail,
  getAllParticipants,
  getDataForParticipant,
} from "@lib/queries";
import { getClient } from "@lib/sanity";
import { ScoreType } from "src/components/AdminComponents/Scoring";
import { ArrayInputs } from "src/components/ApplicationForm";
import { mutate } from "swr";
import { nanoid } from "nanoid";

class ParticipantService {
  async getParticipants() {
    try {
      return await getClient().fetch(getAllParticipants);
    } catch (e) {
      console.error(e);
    }
  }

  async acceptParticipants(id: string, currentValue: boolean) {
    try {
      return await getClient()
        .patch(id, { set: { accepted: !currentValue } })
        .commit()
        .then(() => {
          mutate("/participants_data");
        })
        .catch((e) => console.error(e));
    } catch (e) {
      console.error(e);
    }
  }

  async getParticipantData(preview: boolean, email: string) {
    try {
      return await getClient(preview || false).fetch(
        getDataForParticipant(email)
      );
    } catch (e) {
      console.error(e);
    }
  }

  async checkUniqueEmail(email: string) {
    try {
      return await getClient().fetch(checkIfUniqueEmail(email));
    } catch (e) {
      console.error(e);
    }
  }

  async uploadExtract(project: ArrayInputs) {
    try {
      if (project.extract) {
        return await getClient().assets.upload("file", project.extract, {
          filename: project.extract.name,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async uploadAdvisorCertificate(project: ArrayInputs) {
    try {
      if (project.advisorCertificate) {
        return await getClient().assets.upload(
          "file",
          project.advisorCertificate,
          { filename: project.advisorCertificate.name }
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
  async uploadMutations(mutations: any) {
    try {
      return await getClient()
        .mutate(mutations)
        .then((response) => response)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (e) {
      console.error(e);
    }
  }

  async scoreParticipant(id: string, scores: ScoreType) {
    try {
      await getClient()
        .patch(id, {
          set: {
            score: Object.keys(scores).map((s) => ({
              score: scores[s]?.score || 0,
              criteria: { _type: "reference", _ref: s },
              _key: nanoid(),
            })),
          },
        })
        .commit()
        .then(() => {
          mutate("/section_participants");
        })
        .catch((e) => console.error(e));
    } catch (e) {
      console.error(e);
    }
  }
}

const participantService = new ParticipantService();
export default Object.freeze(participantService);
