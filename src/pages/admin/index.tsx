//TODO:
import { getProviders, getSession, signIn } from "next-auth/react";
import type { GetSessionParams } from "next-auth/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { InferGetServerSidePropsType } from "next";
import Snackbar from "src/components/UtilityComponents/Snackbar";

const AdminLogin = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notiMessage, setNotiMessage] = useState("");

  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center space-y-4 bg-white p-4">
      <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 p-6 sm:w-[400px]">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
          <p className="text-2xl font-semibold text-darkcherry">
            Bejelentkezés
          </p>
          {providers &&
            Object.values(providers).map((provider) => (
              <React.Fragment key={provider.id}>
                {provider.id === "credentials" ? (
                  <div className="w-full space-y-6">
                    <div className="space-y-6 rounded-md shadow-sm">
                      <div>
                        <label htmlFor="email-address" className="sr-only">
                          E-mail
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="relative block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lightcherry sm:text-sm sm:leading-6"
                          placeholder="E-mail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="sr-only">
                          Jelszó
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="relative block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-lightcherry sm:text-sm sm:leading-6"
                          placeholder="Jelszó"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          if (email !== "" && password !== "") {
                            signIn("credentials", {
                              email,
                              password,
                            });
                          } else {
                            setNotiMessage("Minden mező kötelező");
                            setTimeout(() => setNotiMessage(""), 3000);
                          }
                        }}
                        className="group relative flex w-full justify-center rounded-md bg-lightcherry py-2 px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon
                            className="h-5 w-5 text-beige"
                            aria-hidden="true"
                          />
                        </span>
                        Bejelentkezés
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      key={provider.id}
                      onClick={() => signIn(provider.id)}
                      className="rounded-xl bg-darkcherry px-4 py-2 text-white"
                    >
                      Folytatás {provider.name}-al
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
      <Snackbar message={notiMessage} open={notiMessage !== ""} />
    </div>
  );
};

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  const providers = await getProviders();
  const session = await getSession(ctx);

  if (session?.user) {
    if (session.user.role === "superadmin") {
      return {
        redirect: {
          destination: "/admin/ellenorzes",
          permanent: false,
        },
      };
    }
    if (session.user.role !== "participant") {
      return {
        redirect: {
          destination: "/admin/pontozas",
          permanent: false,
        },
      };
    }
    //FOR NOW NO LOGIN FOR USERS
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
    // return {
    //   redirect: {
    //     destination: "/admin/jelentkezes",
    //     permanent: false,
    //   },
    // };
  }
  return {
    props: { providers },
  };
}

export default AdminLogin;
