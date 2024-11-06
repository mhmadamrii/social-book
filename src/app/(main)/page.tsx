import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();
  console.log("session", session);
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi sunt
        eligendi hic inventore voluptates aspernatur aliquam, perspiciatis optio
        quos corporis mollitia animi iste, ratione eveniet, sapiente dolores
        modi nisi cumque!
      </p>
    </div>
  );
}
