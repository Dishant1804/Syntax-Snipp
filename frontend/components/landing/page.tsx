import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeIcon, FolderIcon, ShareIcon, CombineIcon, CloudIcon, SearchIcon, GithubIcon, ArrowRightIcon, BookMarkedIcon, CheckIcon } from "lucide-react"


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] justify-center items-center mx-15">
      <header className="px-4 lg:px-6 h-auto py-4 flex items-center justify-center gap-4 sm:gap-6 ">
        <Link href="#" className="flex items-center justify-between " prefetch={false}>
          <CodeIcon className="" />
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="/signin" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign In
          </Link>
          <Link href="/signup" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex flex-col">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Unleash Your Coding Superpowers with Syntax Snipp
                  </h1>
                  <p className=" w-full flex justify-center items-center text-start md:text-xl">
                    Syntax Snipp is the ultimate code snippet management tool that will make your coding life a breeze.
                    Organize, share, and collaborate on your code like a true coding ninja.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Become a Coding Wizard
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Explore the Dark Arts
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Unleash Your Coding Superpowers
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Syntax Snipp: The Ultimate Code Snippet Toolkit
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Syntax Snipp is the one-stop-shop for all your coding needs. Organize, share, and collaborate on your
                  code like a true coding legend.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <FolderIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Organized Snippets</h3>
                <p className="text-sm text-muted-foreground">
                  Easily categorize and manage your code snippets in a structured library, so you can find what you need
                  in a snap.
                </p>
              </div>
              <div className="grid gap-1">
                <ShareIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Seamless Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Share your coding secrets with your team or the community with a single click. Become a coding legend.
                </p>
              </div>
              <div className="grid gap-1">
                <CombineIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Collaborative Editing</h3>
                <p className="text-sm text-muted-foreground">
                  Collaborate on code snippets in real-time with your team and unleash your coding superpowers together.
                </p>
              </div>
              <div className="grid gap-1">
                <CodeIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Syntax Highlighting</h3>
                <p className="text-sm text-muted-foreground">
                  Enjoy seamless syntax highlighting for all your code snippets, so you can focus on the magic.
                </p>
              </div>
              <div className="grid gap-1">
                <CloudIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Cloud-based Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Access your code snippets from anywhere with our secure cloud-based platform, so you can code like a
                  true ninja.
                </p>
              </div>
              <div className="grid gap-1">
                <SearchIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Powerful Search</h3>
                <p className="text-sm text-muted-foreground">
                  Quickly find the code snippets you need with our advanced search functionality, so you can focus on
                  the magic.
                </p>
              </div>
              <div className="grid gap-1">
                <GithubIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">GitHub Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Sync your code snippets with GitHub Gist. Sign in with your GitHub account to have your snippets sync
                  with Gist on every update, so you can be a coding legend.
                </p>
                <Link href="#" className="flex items-center gap-1 text-primary hover:underline" prefetch={false}>
                  Learn more
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-1">
                <BookMarkedIcon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-bold">Docs with Markdown</h3>
                <p className="text-sm text-muted-foreground">
                  First-class support for Markdown editing, with live preview and file/image uploads, so you can
                  document your coding magic like a pro.
                </p>
                <Link href="#" className="flex items-center gap-1 text-primary hover:underline" prefetch={false}>
                  Learn more
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing for Coding Legends</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Unleash Your Coding Superpowers with Syntax Snipp
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that best fits your coding needs and budget, and become a true coding legend.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <Card className="flex flex-col justify-between rounded-lg border">
                <CardHeader className="border-b p-6">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <p className="text-muted-foreground">Get started on your coding journey for free.</p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      100 code snippets
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Basic organization
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Limited sharing
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Community support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col justify-between rounded-lg border">
                <CardHeader className="border-b p-6">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-muted-foreground">Unlock advanced features to become a coding legend.</p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Unlimited code snippets
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Advanced organization
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Unlimited sharing
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      GitHub Sync
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Markdown Editing
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button className="w-full">Avail Superpowers</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col justify-between rounded-lg border">
                <CardHeader className="border-b p-6">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-muted-foreground">
                    Unleash your coding superpowers with our enterprise solutions.
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Advanced security and compliance
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Customizable integrations
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Tailored onboarding and training
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      GitHub Sync
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                      Markdown Editing
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button className="w-full">Get in touch</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
