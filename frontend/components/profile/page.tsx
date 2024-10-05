import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";


const ProfileComponent = ({ option }: { option: string }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleUsername = (e: any) => {
    setUsername(e.target.value)
  }

  const handlePassword = (e: any) => {
    setPassword(e.target.value)
  }


  const data = {
    username,
    password
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.patch('http://localhost:3000/api/v1/auth/updateprofile', data, {
        withCredentials: true,
      })

      if (response.data.status === "updated" && response.data.success) {
        router.push('/dashboard');
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  return <div className="h-screen w-full bg-[#111111] text-white/90 flex flex-col px-16 pt-8">
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-semibold">
        Settings
      </div>
      <div className="text-lg text-[#85868b]">
        Manage your account settings and preferences here.
      </div>
    </div>
    <Separator className="bg-slate-400/20 mt-8" />
    {option === "account" ? <>
      <div className="flex flex-col mt-4 ">
        <div className="text-2xl font-medium">
          profile
        </div>
        <div className="text-md text-[#85868b] mt-1">
          This is how others will see you on the site.
        </div>
        <Separator className="bg-slate-400/20 mt-2" />
      </div>
      <div className="flex flex-col mt-6 gap-2">
        <label className="text-lg">
          Username
        </label>
        <div>
          <Input placeholder="username" className="p-4 border border-slate-400/20" onChange={(e) => handleUsername(e)} />
        </div>
        <div className="flex text-md text-[#85868b]">
          This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
        </div>
      </div>
      <div className="flex flex-col mt-6 gap-2">
        <label className="text-lg">
          Password
        </label>
        <div>
          <Input placeholder="Password" className="p-4 border-slate-400/20" onChange={(e) => handlePassword(e)} />
        </div>
        <div className="flex text-md text-[#85868b] mt-1 ">
          Update your password here
        </div>
      </div>
      <Button onClick={handleSubmit} className="mt-8">Submit</Button>
    </>

      :

      <>
        <div className="w-full text-white/90 flex flex-col">
          <div className="flex flex-col gap-2 mt-8">
            <h1 className="font-medium text-2xl">Theme</h1>
            <h3 className="text-md text-[#85868b]">Customize the appearance of the app. Automatically switch between day and night themes.</h3>
          </div>
          <div className="flex flex-row mt-8 gap-16 w-full">
            <div className="flex flex-col">
              <div>
                dark theme image
              </div>
              <h1>Dark Theme</h1>
            </div>
            <div className="flex flex-col">
            <div>
                Light theme image
              </div>
              <h1>Light Theme</h1>
            </div>
          </div>
          <Button onClick={handleSubmit} className="mt-8">Update preferences</Button>
        </div>
      </>
    }
  </div>
}

export default ProfileComponent