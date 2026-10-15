import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin — Asman Shop",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminShell />;
}
