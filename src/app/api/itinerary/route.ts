import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { title, destination } = await req.json();
  if (!title?.trim()) return Response.json({ error: "title required" }, { status: 400 });

  const itinerary = await db.itinerary.create({
    data: {
      title: title.trim(),
      destination: destination?.trim() || null,
      userId: session.user.id,
    },
  });

  return Response.json({ id: itinerary.id }, { status: 201 });
}
