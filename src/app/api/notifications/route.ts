import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notificationsInclude, NotificationsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pagesize = 5;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { recipientId: user.id },
      include: notificationsInclude,
      orderBy: {
        createdAt: "desc",
      },
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    const nextCursor =
      notifications.length > pagesize ? notifications[pagesize].id : null;

    const data: NotificationsPage = {
      notifications: notifications.slice(0, pagesize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
