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
  const scrollTo = (id: string) => {
    const anchor = document.getElementById(id);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  if (href == "#" && target) {
    return <div onClick={() => scrollTo(target)}>{children}</div>;
  }
  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
