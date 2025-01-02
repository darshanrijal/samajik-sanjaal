"use client";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/lib/types";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";

interface EditProfileButtonProps {
  user: UserData;
}

export const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
