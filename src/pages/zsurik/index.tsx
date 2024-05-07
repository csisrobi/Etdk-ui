import { querySectionScorers } from "@lib/queries";
import { getClient } from "@lib/sanity";

type Section = {
  name: string;
  scorers: { name: string }[];
};

type Props = {
  sections: Section[];
};

const Zsurik = ({ sections }: Props) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col space-y-10 bg-primaryLight p-4 pt-[100px] text-white">
      <div className="flex flex-wrap justify-evenly gap-4 md:gap-8">
        {sections.map((s) => (
          <div
            key={s.name}
            className="h-auto w-full bg-lightGray p-2 md:w-[500px] md:p-4"
          >
            <table className="w-full border-separate border-spacing-x-3 border-spacing-y-2 md:border-spacing-x-5 md:border-spacing-y-4">
              <thead>
                <tr>
                  <th className="w-2/3">
                    <span className="flex text-left text-2xl text-primaryDark md:text-3xl">
                      {s.name}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(s.scorers || []).map((scorer) => (
                  <tr key={scorer.name}>
                    <td>
                      <span
                        key={scorer.name}
                        className="whitespace-pre-wrap text-lg text-slate-900 md:text-xl"
                      >
                        {scorer.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps({ preview = false }) {
  const sections: Section[] = await getClient(preview).fetch(
    querySectionScorers
  );
  return {
    props: {
      sections: sections
        .filter((s) => s.name)
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
      preview,
    },
    revalidate: 300,
  };
}

export default Zsurik;
