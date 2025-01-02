import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { user } = await getCurrentSession();
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.user.avatarUrl) {
        const key = metadata.user.avatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];

        await new UTApi().deleteFiles(key);
      }
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      await db.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });
      return { avatarUrl: newAvatarUrl };
    }),

  attachments: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await getCurrentSession();
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await db.media.create({
        data: {
          url: file.appUrl,
          type: file.type.startsWith("image") ? "PHOTO" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
