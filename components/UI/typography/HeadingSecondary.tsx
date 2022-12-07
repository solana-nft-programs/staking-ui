import { HeadingElements } from "@/types/index";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
  el?: HeadingElements;
};

const { H2, DIV } = HeadingElements;

const HeadingSecondary = ({ children, className, el = DIV }: Props) => {
  const combinedClasses = classNames([
    "text-3xl font-medium md:w-full min-w-full",
    className,
  ]);

  switch (el) {
    case H2:
      return <h1 className={combinedClasses}>{children}</h1>;
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>;
  }
};

export default HeadingSecondary;
