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
  return (
    <a href={href} target={target}>
      {children}
    </a>
  );
};

export default LinkWrapper;
