import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";


const ProfileComponent = () => {
  const [username , setUsername] = useState<string>('');
  const [password ,setPassword] = useState<string>('');
  const router = useRouter();

  const handleUsername = (e: any) =>{
    setUsername(e.target.value)
  }

  const handlePassword = (e: any) =>{
    setPassword(e.target.value)
  }
  

  const data = {
    username,
    password
  }

  const handleSubmit = async () =>{
    try{
      const response = await axios.patch('http://localhost:3000/api/v1/auth/updateprofile' , data , {
        withCredentials : true,
      })

      if(response.data.status === "updated" && response.data.success){
        router.push('/dashboard');
      }
    }
    catch(e){
      console.log(e);
    }
  }

  return <div className="h-screen w-[80%] bg-[#111111] text-white/90 flex flex-col px-16 pt-8">
    <div className="flex flex-col">
      <div className="text-3xl font-semibold">
        Settings
      </div>
      <div className="text-lg text-[#85868b] mt-1">
        Manage your account settings and set e-mail preferences.
      </div>
    </div>
    <Separator className="bg-slate-400/20 mt-8" />
    <div className="flex flex-col mt-4">
      <div className="text-lg font-medium">
        profile
      </div>
      <div className="text-md text-[#85868b] mt-1">
        This is how others will see you on the site.
      </div>
      <Separator className="bg-slate-400/20 mt-2"/>
    </div>
    <div className="flex flex-col mt-6">
      <label className="text-lg">
        Username
      </label>
      <div>
        <Input placeholder="username" className="pl-6 border border-slate-400/20" onChange={(e) => handleUsername(e)}/>
      </div>
      <div className="flex text-md text-[#85868b] mt-1 ">
        This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
      </div>
    </div>
    <div className="flex flex-col mt-6">
      <label className="text-lg">
        Password
      </label>
      <div>
        <Input placeholder="Password" className="pl-6 border-slate-400/20" onChange={(e) => handlePassword(e)} />
      </div>
      <div className="flex text-md text-[#85868b] mt-1 ">
        You can manage verified email addresses in your email settings.
      </div>
    </div>
    <div className="flex flex-col mt-6">
      <div>
        Link your profile
      </div>
      <div>
        Link to github 
      </div>
    </div>
    <Button onClick={handleSubmit}>Submit</Button>
  </div>
}

export default ProfileComponent