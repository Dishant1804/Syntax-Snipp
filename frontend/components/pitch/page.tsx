import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { ArrowRightIcon, ChromeIcon } from "lucide-react";

const PitchComponent = () => {
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google/dashboard`;
  };

  const handleGithubSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/github`;
  };
  return (<div className="w-full flex justify-center items-center">
    <div className="w-full border border-neutral-400 backdrop-blur-sm bg-[#181818] py-16 px-10  justify-center items-center flex flex-col gap-4 max-w-7xl rounded-3xl">
      <div className="flex flex-col w-full justify-center items-center gap-3">
        <div className="flex flex-col w-full gap-3 justify-center items-center">
          <h1 className="text-4xl font-semibold">Code fast at ligthening speed now</h1>
          <h3 className="text-lg text-neutral-400">Get started with our free plan</h3>
        </div>
        <h4 className="text-3xl font-semibold py-4 max-w-2xl text-center">Save share and manage your snippets with Syntax snipp</h4>
        <div className="w-full flex items-center max-w-2xl gap-6 pt-4">
          <Button
            type="button"
            className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300"
            onClick={handleGoogleSignIn}
          >
            <ChromeIcon className="md:w-5 md:h-5 h-4 w-4" />
            Sign in with Google
            <ArrowRightIcon className="md:w-5 md:h-5 h-4 w-4" />
          </Button>
          <Button
            type="button"
            className="w-full items-center gap-2 bg-white/90 text-black hover:bg-neutral-300"
            onClick={handleGithubSignIn}
          >
            <GitHubLogoIcon className="md:w-5 md:h-5 h-4 w-4" />
            Sign in with GitHub
            <ArrowRightIcon className="md:w-5 md:h-5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>

  )
}

export default PitchComponent;
