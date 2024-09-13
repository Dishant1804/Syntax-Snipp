"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SpinnerWithText from "@/components/ui/spinnerWithText"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LayoutGridIcon, HomeIcon, BriefcaseIcon, SquareCheckIcon, CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios';

interface Snippet {
  id : string;
  content : string;
  description : string;
  favorite? : boolean
}

export default function DashboardComponent() {
  const router = useRouter();
  const [ snippets , setSnippets ] = useState<Snippet[]>([]);
  const [isLoading , setIsLoading] = useState(true);
  const [ error , setError] = useState<String | null>(null); 

  useEffect(() => {
    const fetchSnippets = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const response = await axios.get<Snippet[]>(
          'http://localhost:3000/api/v1/snippet/displayallsnippets',
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setSnippets(response.data);
      } 
      catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'An error occurred while fetching snippets');
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            router.push('/signin');
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerWithText/>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }



  return (
    <div className="flex min-h-screen w-full">
      <div className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r bg-background p-4">
        <div className="mb-6">
          <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
            <LayoutGridIcon className="h-6 w-6" />
            <span>Website</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <BriefcaseIcon className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <SquareCheckIcon className="h-5 w-5" />
            <span>Tasks</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar</span>
          </Link>
        </nav>
        <div className="mt-auto">
          <div className="mb-4 text-sm font-medium text-muted-foreground">Tags</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Design
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Development
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Marketing
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Sales
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              HR
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Finance
            </Button>
          </div>
        </div>
      </div>
      <div className="ml-64 flex-1 border-r bg-muted/20 p-6 overflow-auto">
        <div className="mb-6">
          <Input type="search" placeholder="Search..." className="w-full rounded-md bg-background px-4 py-2 text-sm" />
        </div>
        <div className="grid gap-4 overflow-auto" style={{ maxHeight: "70vh" }}>
          <Card>
            <CardHeader>
              <CardTitle>Project A</CardTitle>
              <CardDescription>Description of Project A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Status</div>
                  <div>In Progress</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Due Date</div>
                  <div>June 30, 2023</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Team</div>
                  <div>John, Jane, Bob</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Tags</div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Design</Badge>
                    <Badge variant="outline">Development</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project B</CardTitle>
              <CardDescription>Description of Project B</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Status</div>
                  <div>Completed</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Due Date</div>
                  <div>April 15, 2023</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Team</div>
                  <div>Alice, Bob, Charlie</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Tags</div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Development</Badge>
                    <Badge variant="outline">Marketing</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project C</CardTitle>
              <CardDescription>Description of Project C</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Status</div>
                  <div>On Hold</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Due Date</div>
                  <div>September 1, 2023</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Team</div>
                  <div>Eve, Frank, Grace</div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-muted-foreground">Tags</div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Design</Badge>
                    <Badge variant="outline">Sales</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Project A</h1>
          <p className="text-muted-foreground">Detailed information about Project A</p>
        </div>
        <div className="grid gap-6">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Description</div>
            <p>
              Project A is a design and development project that aims to create a new website for our company. The
              project involves designing the user interface, developing the frontend and backend components, and
              integrating various features and functionalities.
            </p>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Objectives</div>
            <ul className="list-disc pl-6">
              <li>Improve the overall user experience of the website</li>
              <li>Increase website traffic and engagement</li>
              <li>Integrate e-commerce functionality</li>
              <li>Optimize the website for search engine visibility</li>
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Timeline</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">Start Date</div>
                <div>March 1, 2023</div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">End Date</div>
                <div>June 30, 2023</div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Team</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="John" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>John</div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Jane" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <div>Jane</div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Bob" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <div>Bob</div>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">Tags</div>
            <div className="flex gap-2">
              <Badge variant="outline">Design</Badge>
              <Badge variant="outline">Development</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



