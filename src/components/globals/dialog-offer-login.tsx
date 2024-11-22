import { Link } from "next-view-transitions";
import { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

interface DialogOfferLoginProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  message?: string;
  redirectUri?: string;
}

export function DialogOfferLogin({
  isOpen,
  onOpenChange,
  message,
  redirectUri,
}: DialogOfferLoginProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-bold text-primary sm:text-2xl">
            Social-Book
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please login to continue. {message ?? ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Link
              href={`/login?redirect=${redirectUri}`}
              className="flex w-full gap-2 transition-all"
            >
              <span>Login</span>
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
