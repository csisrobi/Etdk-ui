import Link from "next/link";

const LinkWrapper = ({
  href,
  children,
  target,
}: {
  href: string;
  target?: string;
  children: React.ReactNode;
}) => {
  // if (href == "#") {
  //   return <>{children}</>;
  // }
  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
