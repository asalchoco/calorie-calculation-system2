import { NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { desc } from "drizzle-orm";
import { validatePatientPayload } from "@/lib/validatePatient";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(patients).orderBy(desc(patients.createdAt));
  return NextResponse.json({ patients: rows });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validatePatientPayload(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const [created] = await db.insert(patients).values(result.data).returning();
  return NextResponse.json({ patient: created }, { status: 201 });
}
