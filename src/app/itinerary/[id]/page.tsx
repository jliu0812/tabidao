import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { ItineraryChat } from "@/components/itinerary-chat";

const ItineraryMap = dynamic(
  () => import("@/components/itinerary-map").then((m) => m.ItineraryMap),
  { ssr: false }
);

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const itinerary = await db.itinerary.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!itinerary) notFound();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← My Itineraries
        </Link>
        <h1 className="font-semibold">{itinerary.title}</h1>
        {itinerary.destination && (
          <span className="text-sm text-gray-400">{itinerary.destination}</span>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-gray-100 overflow-hidden">
          <ItineraryChat itineraryId={itinerary.id} />
        </div>
        <div className="w-1/2 relative">
          <ItineraryMap itineraryId={itinerary.id} />
        </div>
      </div>
    </div>
  );
}
