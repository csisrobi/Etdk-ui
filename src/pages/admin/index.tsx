/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO:
import { getProviders, getSession, signIn } from "next-auth/react";
import type { GetSessionParams } from "next-auth/react";

const AdminLogin = ({ providers }: { providers: any }) => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center space-y-4 bg-white p-4 pt-[100px]">
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            {Object.values(providers).map((provider: any) => (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  const providers = await getProviders();
  const session = await getSession(ctx);
  if (session?.user) {
    return {
      redirect: {
        destination: "/admin/jelentkezes",
        permanent: false,
      },
    };
  }
  return {
    props: { providers },
  };
}

export default AdminLogin;
