import { NextResponse } from "next/server";
import { getCoverage } from "@/lib/coverage-api";

export const revalidate = 300;

export async function GET() {
  const data = await getCoverage();
  return NextResponse.json(data);
}
