"use client";

import ActionModal from "@/shared/Components/ActionModal";
import { toast } from "sonner";
import { useState } from "react";
import { deletePastaAction } from "../_actions/deletePastaAction";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

type Props = {
  id: string;
  publicId: string | null;
};

export default function DeletePastaBtn({ id, publicId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete(
    id: string,
    publicId: string | null,
  ): Promise<void> {
    try {
      setLoading(true);
      const response = await deletePastaAction(id, publicId);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(BACKEND_RESPONSE_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ActionModal
      triggerTitle="Tészta törlése"
      description="Biztos törölni szeretnéd a tésztát az étlapról? Ez a művelet nem visszavonható!"
      action={async () => await handleDelete(id, publicId)}
      disabled={loading}
    />
  );
}
