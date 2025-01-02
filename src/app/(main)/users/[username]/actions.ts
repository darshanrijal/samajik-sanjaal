"use server";

import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import {
  type UpdateUserProfileValues,
  updateUserProfileSchema,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
}
