import { permanentRedirect } from "next/navigation";
import { getCityCoverage, getCoverage } from "@/lib/coverage-api";

type Params = { city: string };

export async function generateStaticParams(): Promise<Params[]> {
  const snapshot = await getCoverage();
  return snapshot.cities.map((city) => ({ city: city.slug }));
}

export default async function CityCoverageRedirect({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  const coverage = await getCityCoverage(city);
  permanentRedirect(
    `/branches?q=${encodeURIComponent(coverage?.name || city.replaceAll("-", " "))}`,
  );
}
