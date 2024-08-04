import Image from "next/image";
import { useUserStore } from "@/lib/userStore";
import { IoIosOptions } from "react-icons/io";


const Userinfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        <Image  width={150} height={150} src={currentUser.avatar || "/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <IoIosOptions size={20} />
      </div>
    </div>
  )
}

export default Userinfo