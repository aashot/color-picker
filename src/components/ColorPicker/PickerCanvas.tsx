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
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

      hexCtx.fillStyle = "rgba(255, 255, 255, 0.033)";
      hexCtx.fillRect(0, 0, hexCanvas.width, hexCanvas.height);

      hexCtx.font = "12px Arial";
      hexCtx.fillStyle = "#ffffff";
      hexCtx.textAlign = "center";
      hexCtx.textBaseline = "middle";

      hexCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
      hexCtx.shadowOffsetX = 1;
      hexCtx.shadowOffsetY = 1;
      hexCtx.shadowBlur = 2;

      const textX = hexCanvas.width / 2;
      const textY = hexCanvas.height - 20;
      hexCtx.fillText(hexCode, textX, textY);
    }
  }, [hexCode]);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas?.getContext("2d");

    if (gridCanvas && gridCtx) {
      gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

      const gridSize = 10;
      gridCtx.strokeStyle = "rgba(255, 255, 255, 0.19)";

      for (let x = 0; x < gridCanvas.width; x += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridCanvas.height);
        gridCtx.stroke();
      }

      for (let y = 0; y < gridCanvas.height; y += gridSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(0, y);
        gridCtx.lineTo(gridCanvas.width, y);
        gridCtx.stroke();
      }
    }
  }, []);

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
        ref={gridCanvasRef}
        width={ZOOM_CANVAS_SIZE}
        height={ZOOM_CANVAS_SIZE}
        style={{
          position: "absolute",
          zIndex: 2,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={hexCanvasRef}
        width={ZOOM_CANVAS_SIZE}
        height={ZOOM_CANVAS_SIZE}
        style={{
          position: "absolute",
          zIndex: 3,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
