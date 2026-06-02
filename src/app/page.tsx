import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">TabiDao</h1>
      <p className="text-gray-500">Plan your next adventure.</p>
      <Link
        href="/login"
        className="rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700 transition-colors"
      >
        Get started
      </Link>
    </main>
  );
}
