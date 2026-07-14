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
    | {
        endpoint?: unknown;
        keys?: { p256dh?: unknown; auth?: unknown };
      }
    | null;
  const endpoint = typeof body?.endpoint === "string" ? body.endpoint : "";
  const p256dh =
    typeof body?.keys?.p256dh === "string" ? body.keys.p256dh : "";
  const authKey = typeof body?.keys?.auth === "string" ? body.keys.auth : "";

  if (!endpoint || !p256dh || !authKey) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpointHash: hashEndpoint(endpoint) },
    create: {
      userId: sessionUser.id,
      endpointHash: hashEndpoint(endpoint),
      endpoint,
      p256dh,
      auth: authKey,
      userAgent: request.headers.get("user-agent"),
      enabled: true,
    },
    update: {
      userId: sessionUser.id,
      endpoint,
      p256dh,
      auth: authKey,
      userAgent: request.headers.get("user-agent"),
      enabled: true,
    },
  });

  return NextResponse.json({ ok: true });
}
