import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const trips = await db.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Trips</h1>
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

      {trips.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">No trips yet. Start planning!</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip) => (
            <li key={trip.id} className="rounded-lg border border-gray-100 p-4">
              <p className="font-medium">{trip.title}</p>
              {trip.destination && (
                <p className="text-sm text-gray-500">{trip.destination}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
