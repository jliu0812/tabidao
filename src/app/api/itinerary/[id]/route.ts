import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return Response.json(null, { status: 401 });

  const { id } = await params;

  const itinerary = await db.itinerary.findUnique({
    where: { id, userId: session.user.id },
    include: {
      days: {
        include: { events: true },
        orderBy: { dayNumber: "asc" },
      },
    },
  });

  if (!itinerary) return Response.json(null, { status: 404 });

  return Response.json(itinerary);
}
