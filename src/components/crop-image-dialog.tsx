import { DialogTitle } from "@radix-ui/react-dialog";
import { useRef } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";

interface CropImageDialogProps {
  src: string;
  aspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClose: () => void;
}

export const CropImageDialog = ({
  src,
  aspectRatio,
  onCropped,
  onClose,
}: CropImageDialogProps) => {
  const cropperRef = useRef<ReactCropperElement>(null);

  function crop() {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) {
      return;
    }

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  }
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={aspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
