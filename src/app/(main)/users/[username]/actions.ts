"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerChat from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema } from "@/lib/validation";
import { z } from "zod";

export async function updateUserProfile(
  values: z.infer<typeof updateUserProfileSchema>,
) {
  const validatedValues = updateUserProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { ...validatedValues },
      select: getUserDataSelect(user.id),
    });

    await streamServerChat.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
      },
    });
    return updatedUser;
  });

  return updatedUser;
}
