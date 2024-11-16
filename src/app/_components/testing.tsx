import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CalendarIcon, Users2Icon } from "lucide-react";

export default function UserProfile() {
  return (
    <Card className="mx-auto w-full max-w-3xl overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
        <img
          src="/placeholder.svg?height=192&width=768"
          alt="Profile background"
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="relative px-4 pt-0 sm:px-6">
        <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="User avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="mt-2 space-y-1 text-center sm:mt-0 sm:text-left">
            <h2 className="text-2xl font-bold">Jane Doe</h2>
            <p className="text-sm text-muted-foreground">@janedoe</p>
          </div>
          <Button className="ml-auto mt-2 sm:mt-0">Follow</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="flex flex-wrap justify-between gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users2Icon className="h-4 w-4" />
            <span className="font-semibold">5.2K</span> followers
          </div>
          <div className="flex items-center gap-1">
            <Users2Icon className="h-4 w-4" />
            <span className="font-semibold">1.8K</span> following
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Joined <span className="font-semibold">September 2021</span>
          </div>
        </div>
        <p className="text-sm">
          Passionate designer and developer. Creating beautiful and functional
          web experiences. Love to travel and capture moments. 📷✈️
        </p>
      </CardContent>
      <CardFooter className="bg-muted/50 px-4 sm:px-6">
        <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
      </CardFooter>
    </Card>
  );
}
