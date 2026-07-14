import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashEndpoint } from "@/lib/pushNotifications";

export async function POST(request: Request) {
  const session = await auth();
  const sessionUser = session?.user as
    | (NonNullable<typeof session>["user"] & { id?: string })
    | undefined;

  if (!sessionUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { endpoint?: unknown }
    | null;
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";

  if (!endpoint) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await prisma.pushSubscription.updateMany({
    where: {
      userId: sessionUser.id,
      endpointHash: hashEndpoint(endpoint),
    },
    data: { enabled: false },
  });

  return NextResponse.json({ ok: true });
}
