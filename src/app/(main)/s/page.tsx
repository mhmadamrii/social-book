import { NotificationSkeleton } from "~/components/globals/notification-skeleton";
import { AppIcon } from "../_components/app-icon";
import MultiSelectTest from "../messages/_components/mlt";

export default function S() {
  return (
    <section className="h-screen w-full">
      <AppIcon />
      <MultiSelectTest />
    </section>
  );
}
