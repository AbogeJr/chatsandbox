import Image from "next/image";
import { useUserStore } from "@/lib/userStore";
import { IoIosOptions } from "react-icons/io";


const Userinfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='p-5 flex items-center justify-between'>
      <div className="flex items-center gap-5">
        <Image className="w-12 h-12 rounded-full object-cover"  width={150} height={150} src={currentUser.avatar || "/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="flex gap-5">
        <IoIosOptions size={20} />
      </div>
    </div>
  )
}

export default Userinfo