import type { ReactNode } from "react";
import Header from "./Header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        position: "relative",
        overflowX: "hidden",
        width: "100vw",
        height: "100vh",
      }}
      className="no-scrollbar"
    >
      <Header />
      {children}
    </div>
  );
};

export default Layout;
