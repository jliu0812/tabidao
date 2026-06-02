import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CreateItineraryForm } from "@/components/create-itinerary-form";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const itineraries = await db.itinerary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { days: true } } },
  });

  return (
    <main className="min-h-screen p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Itineraries</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mb-6">
        <CreateItineraryForm />
      </div>

      {itineraries.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          No itineraries yet. Create one above to get started!
        </p>
      ) : (
        <ul className="space-y-2 max-w-2xl">
          {itineraries.map((it) => (
            <li key={it.id}>
              <Link
                href={`/itinerary/${it.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{it.title}</p>
                  {it.destination && (
                    <p className="text-sm text-gray-500">{it.destination}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {it._count.days} {it._count.days === 1 ? "day" : "days"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
