import { StoreShell } from "@/components/StoreShell";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 30;

export default async function HomePage() {
  const catalog = await getCatalog();
  return <StoreShell initialProducts={catalog.products} initialStore={catalog.store} />;
}
