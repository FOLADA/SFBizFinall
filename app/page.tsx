import HomePage from "@/components/HomePage";
import { Business } from "@/types/business";

async function getBusinesses(): Promise<Business[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function Page() {
  const businesses = await getBusinesses();
  return <HomePage businesses={businesses} />;
}