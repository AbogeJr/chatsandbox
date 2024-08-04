import Image from "next/image";
import { BsPlus } from "react-icons/bs";
import { FaMinus, FaSearch } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface SearchBarProps {
  input: string;
  setInput: (input: string) => void;
  addMode: boolean;
  toggleAddMode: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  input,
  setInput,
  addMode,
  toggleAddMode,
}) => {
  return (
    <div className="flex border-b border-[#dddddd35] items-center gap-[20px] p-[20px]">
      <div className="flex-[1] bg-[rgba(17,25,40,0.5)]  flex items-center gap-[20px] rounded-full p-[10px] px-6">
        <FaSearch size={15} />
        <input
          className="bg-transparent w-2/3 border-none outline-none text-white flex-[1]"
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button onClick={toggleAddMode}>
        {!addMode ? (
          <AiOutlinePlus size={20} className="cursor-pointer" />
        ) : (
          <AiOutlineMinus size={20} className="cursor-pointer" />
        )}
      </button>
    </div>
  );
};

export default SearchBar;
