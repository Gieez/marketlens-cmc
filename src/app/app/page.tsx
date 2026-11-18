import { Screener } from "@/components/screener";
import { AppShell } from "@/components/app-shell";
import type { Metadata } from "next";
import { getScreenerSnapshot, toApiError } from "@/lib/cmc";

export const metadata: Metadata = { title: "Screener" };
export const dynamic = "force-dynamic";

export default async function ScreenerPage() {
  let snapshot = null;
  let failure: string | undefined;
  try { snapshot = await getScreenerSnapshot(); }
  catch (error) { failure = toApiError(error).message; }
  return <AppShell active="/app"><Screener snapshot={snapshot} failure={failure} /></AppShell>;
}
