import Image from 'next/image';
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  input: string;
  setInput: (input: string) => void;
  addMode: boolean;
  toggleAddMode: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ input, setInput, addMode, toggleAddMode }) => {
  return (
    <div className="flex items-center gap-[20px] p-[20px]">
      <div className="flex-[1] bg-[rgba(17,25,40,0.5)] flex items-center gap-[20px] rounded-[10px] p-[10px]">
      <FaSearch size={15}/>
        <input
          className="bg-transparent w-2/3 border-none outline-none text-white flex-[1]"
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Image
        width={20}
        height={20}
        src={addMode ? "/minus.png" : "/plus.png"}
        alt="Toggle Add Mode"
        className="w-[36px] h-[36px] bg-[rgba(17,25,40,0.5)] p-[10px] rounded-[10px] cursor-pointer"
        onClick={toggleAddMode}
      />
    </div>
  );
};

export default SearchBar;
