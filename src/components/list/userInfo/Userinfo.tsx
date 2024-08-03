import Image from "next/image";
import "./userInfo.css"
import { useUserStore } from "@/lib/userStore";

const Userinfo = () => {

  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        <Image  width={100} height={100} src={currentUser.avatar || "/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <Image  width={50} height={50} src="/more.png" alt="" />
        <Image  width={50} height={50} src="/video.png" alt="" />
        <Image  width={50} height={50} src="/edit.png" alt="" />
      </div>
    </div>
  )
}

export default Userinfo