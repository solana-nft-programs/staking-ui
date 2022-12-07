import { PlusIcon } from "@heroicons/react/24/solid";

type Props = {
  onClick: () => void;
};

const ButtonReadMore = ({ onClick }: Props) => {
  return (
    <button
      className="flex items-center text-gray-400 p-2 px-4 rounded-full border border-gray-500 w-fit"
      onClick={onClick}
    >
      <PlusIcon className="w-6 h-6 text-white" />
      <span className="ml-3">Read More</span>
    </button>
  );
};

export default ButtonReadMore;
