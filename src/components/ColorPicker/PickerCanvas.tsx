import React, { useRef, useEffect } from "react";

interface PickerCanvasProps {
  hexCode: string;
  isHovering: boolean;
  position: { x: number; y: number };
  magnifierPosition: { x: number; y: number };
}

const ZOOM_CANVAS_SIZE = 100;
const ZOOM_SCALE = 4;

export const PickerCanvas: React.FC<PickerCanvasProps> = ({
  hexCode,
  isHovering,
  position,
  magnifierPosition,
}) => {
  const zoomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hexCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const zoomCanvas = zoomCanvasRef.current;
    const zoomCtx = zoomCanvas?.getContext("2d");
    const canvas = zoomCanvas?.parentElement
      ?.previousElementSibling as HTMLCanvasElement;

    if (zoomCanvas && zoomCtx && canvas) {
      const zoomSize = ZOOM_CANVAS_SIZE;
      const scale = ZOOM_SCALE;
      zoomCtx.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
      zoomCtx.drawImage(
        canvas,
        magnifierPosition.x - zoomSize / (2 * scale),
        magnifierPosition.y - zoomSize / (2 * scale),
        zoomSize / scale,
        zoomSize / scale,
        0,
        0,
        zoomSize,
        zoomSize,
      );
    }
  }, [magnifierPosition, hexCode]);

  useEffect(() => {
    const hexCanvas = hexCanvasRef.current;
    const hexCtx = hexCanvas?.getContext("2d");

    if (hexCanvas && hexCtx) {
      hexCtx.clearRect(0, 0, hexCanvas.width, hexCanvas.height);

      hexCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
      hexCtx.fillRect(0, 0, hexCanvas.width, hexCanvas.height);

      hexCtx.font = "19px Arial";
      hexCtx.fillStyle = hexCode;
      hexCtx.textAlign = "center";
      hexCtx.textBaseline = "middle";
      hexCtx.fillText(hexCode, hexCanvas.width / 2, hexCanvas.height / 2);
    }
  }, [hexCode]);

  return (
    <div
      data-testid="picker-canvas"
      style={{
        pointerEvents: "none",
        left: `${position.x}px`,
        top: `${position.y}px`,
        border: `solid 8px ${hexCode}`,
        display: isHovering ? "flex" : "none",
        position: "absolute",
        width: `${ZOOM_CANVAS_SIZE}px`,
        height: `${ZOOM_CANVAS_SIZE}px`,
        borderRadius: "50%",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <canvas
        ref={zoomCanvasRef}
        width={ZOOM_CANVAS_SIZE}
        height={ZOOM_CANVAS_SIZE}
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      ></canvas>
      <canvas
        ref={hexCanvasRef}
        width={ZOOM_CANVAS_SIZE}
        height={ZOOM_CANVAS_SIZE}
        style={{
          position: "absolute",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontSize: "14px",
          fontWeight: "bold",
          color: hexCode,
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
