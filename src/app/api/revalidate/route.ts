import { revalidatePath } from "next/cache";

export async function GET() {
  revalidatePath("/");
  return new Response("Revalidation triggered");
}
