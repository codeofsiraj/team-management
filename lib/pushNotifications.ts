import crypto from "crypto";
import { prisma } from "@/lib/prisma";

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

type WebPushModule = {
  setVapidDetails: (
    subject: string,
    publicKey: string,
    privateKey: string
  ) => void;
  sendNotification: (
    subscription: {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    },
    payload: string
  ) => Promise<unknown>;
};

const dynamicImport = new Function(
  "modulePath",
  "return import(modulePath)"
) as (modulePath: string) => Promise<{ default?: WebPushModule } & WebPushModule>;

export function hashEndpoint(endpoint: string) {
  return crypto.createHash("sha256").update(endpoint).digest("hex");
}

async function getWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return null;
  }

  try {
    const imported = await dynamicImport("web-push");
    const webPush = imported.default ?? imported;

    webPush.setVapidDetails(subject, publicKey, privateKey);
    return webPush;
  } catch (error) {
    console.error("Push notification package is unavailable.", error);
    return null;
  }
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  const webPush = await getWebPush();

  if (!webPush) {
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId, enabled: true },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        );
      } catch (error) {
        console.error("Push notification delivery failed.", error);
      }
    })
  );
}

export async function notifyUsersWithPush(
  userIds: string[],
  payload: PushPayload
) {
  await Promise.all(userIds.map((userId) => sendPushToUser(userId, payload)));
}
