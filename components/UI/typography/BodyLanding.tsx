import { BodyElements, BodyTextSizes } from "@/types/index";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
  el?: BodyElements;
  textSize?: BodyTextSizes;
};

const { DIV, P } = BodyElements;
const { BASE, LARGE } = BodyTextSizes;

const BodyLanding = ({
  children,
  className,
  el = DIV,
  textSize = BASE,
}: Props) => {
  const combinedClasses = classNames([
    "text-gray-400 md:min-w-0 min-w-full",
    className,
    {
      "text-base": textSize === BASE,
      "text-xl": textSize === LARGE,
    },
  ]);

  switch (el) {
    case P:
      return <p className={combinedClasses}>{children}</p>;
    case DIV:
    default:
      return <div className={combinedClasses}>{children}</div>;
  }
};

export default BodyLanding;
