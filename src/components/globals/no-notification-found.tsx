import { Link } from "next-view-transitions";

export function NoNotificationFound() {
  return (
    <div className="mt-[20px] flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">You don't have any notifications</h1>
      <div>
        <p className="text-muted-foreground">
          Don't be nerd, start interacting with other users to get
          notifications.
        </p>
        <Link className="text-center text-blue-500 underline" href="/">
          Browse posts
        </Link>
      </div>
    </div>
  );
}
