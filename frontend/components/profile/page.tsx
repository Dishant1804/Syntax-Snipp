import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProfileComponent = ({ option }: { option: string }) => {
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [canUpdateUsername, setCanUpdateUsername] = useState<boolean>(false);
  const router = useRouter();

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername === profile?.username) {
      setUsernameError('Username is the same as current username');
    } else {
      setUsernameError('');
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/auth/user/profile', {
        withCredentials: true,
      });

      setProfile(response.data.profile);
      setUsername(response.data.profile.username);

      const lastUpdate = new Date(response.data.profile.updatedAt);
      const creationDate = new Date(response.data.profile.createdAt);
      const daysSinceUpdate = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
      const daysSinceCreation = (new Date().getTime() - creationDate.getTime()) / (1000 * 3600 * 24);

      setCanUpdateUsername(daysSinceUpdate >= 30 || daysSinceCreation >= 30);

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!canUpdateUsername && username !== profile?.username) {
      setUsernameError('You can only change your username once every 30 days.');
      return;
    }

    try {
      const data = {
        username: username !== profile?.username ? username : undefined,
        password: password || undefined
      }

      const response = await axios.patch('http://localhost:3000/api/v1/auth/updateprofile', data, {
        withCredentials: true,
      });

      if (response.data.status === "updated" && response.data.success) {
        router.push('/dashboard');
      }
    } catch (e) {
      console.log(e);
      setUsernameError('An error occurred while updating your profile.');
    }
  }

  return (
    <div className="h-screen w-full bg-[#111111] text-white/90 flex flex-col px-16 pt-8">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-semibold">
          Settings
        </div>
        <div className="text-lg text-[#85868b]">
          Manage your account settings and preferences here.
        </div>
      </div>
      <Separator className="bg-slate-400/20 mt-8" />
      {option === "account" ? (
        <>
          <div className="flex flex-col mt-4 ">
            <div className="text-2xl font-medium">
              Profile
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
              <Input
                placeholder="username"
                className="p-4 border border-slate-400/20"
                onChange={handleUsername}
                value={username}
                disabled={!canUpdateUsername}
              />
              {usernameError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{usernameError}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex text-md text-[#85868b]">
              {canUpdateUsername
                ? "This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days."
                : "You can change your username once every 30 days. Your next opportunity to change will be in " + Math.ceil(30 - (new Date().getTime() - new Date(profile?.updatedAt).getTime()) / (1000 * 3600 * 24)) + " days."
              }
            </div>
          </div>
          <div className="flex flex-col mt-6 gap-2">
            <label className="text-lg">
              Password
            </label>
            <div>
              <Input
                type="password"
                placeholder="Password"
                className="p-4 border-slate-400/20"
                onChange={handlePassword}
                value={password}
              />
            </div>
            <div className="flex text-md text-[#85868b] mt-1 ">
              Update your password here
            </div>
          </div>
          <Button onClick={handleSubmit} className="mt-8">Submit</Button>
        </>
      ) : (
        <>
          <div className="w-full text-white/90 flex-col hidden">
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
      )
      }
    </div>
  )
}

export default ProfileComponent