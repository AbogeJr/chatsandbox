import ChatList from "./ChatList";
import Userinfo from "./Userinfo";

const List = () => {
  return (
    <div className="flex-[1] flex flex-col ">
      <Userinfo />
      <ChatList />
    </div>
  );
};

export default List;
