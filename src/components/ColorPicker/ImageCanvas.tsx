import React, { useEffect } from "react";

interface ImageCanvasProps {
  imageUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({
  imageUrl,
  canvasRef,
  onMouseMove,
  onMouseLeave,
  onClick,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageUrl;

      image.onload = () => {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth = image.width;
        const imageHeight = image.height;

        const scale = Math.min(
          canvasWidth / imageWidth,
          canvasHeight / imageHeight,
        );
        const scaledWidth = imageWidth * scale;
        const scaledHeight = imageHeight * scale;

        const x = (canvasWidth - scaledWidth) / 2;
        const y = (canvasHeight - scaledHeight) / 2;

        ctx?.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx?.drawImage(image, x, y, scaledWidth, scaledHeight);
      };
    }
  }, [imageUrl, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="image-canvas"
      width="800"
      height="600"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
};
