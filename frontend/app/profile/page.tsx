"use client"

import ProfileComponent from "@/components/profile/page";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from '@/components/sidebar/Page'
import ProfileSettingsSidebar from "@/components/profileSettings/page";
import { useState } from "react";


const Profile = () => {
  const [option, setOption] = useState<string>("account");

  return <div className="h-screen w-screen bg-[#111111] flex flex-row justify-center">
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel minSize={18} defaultSize={18} maxSize={24}>
        <Sidebar isCollapsed={false}/>
      </ResizablePanel>
      <ResizableHandle className="h-screen bg-slate-400/20 " />
      <ResizablePanel minSize={64} defaultSize={82} >
        <ProfileComponent option={option} />
      </ResizablePanel>
      <ResizableHandle className="h-screen bg-slate-400/20 " />
      <ResizablePanel minSize={18} defaultSize={18}>
        <ProfileSettingsSidebar setOption={setOption} />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
}

export default Profile;