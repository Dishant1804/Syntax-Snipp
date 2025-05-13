import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";

const PitchComponent = () => {
  return (<div className="w-full flex justify-center items-center px-4 pb-24">
    <div className="w-full border border-neutral-400 backdrop-blur-sm bg-[#181818] p-8 md:py-12 md:px-10  justify-center items-center flex flex-col gap-4 max-w-7xl rounded-3xl">
      <RainbowButton className='hidden sm:flex'>Try Beta Now! ✨</RainbowButton>
      <div className="flex flex-col w-full pt-4 justify-center items-center gap-3">
        <div className="flex flex-col w-full gap-3 justify-center items-center">
          <h1 className="text-3xl text-center md:text-4xl font-semibold">Code at ligthening speed now</h1>
          <h3 className="text-lg text-center text-neutral-400">Get started with our free plan</h3>
        </div>
        <h4 className="text-xl md:text-3xl font-semibold pt-4 pb-6 max-w-2xl text-center">Save share and manage your snippets with Syntax snipp</h4>
        <Button className="bg-neutral-300 text-black hover:bg-neutral-400">Get started</Button>
      </div>
    </div>
  </div>

  )
}

export default PitchComponent;
