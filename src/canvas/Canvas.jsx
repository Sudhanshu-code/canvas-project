import React, { useEffect, useRef, useState } from "react";

function Canvas() {
  const ref = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("white");
  const [bgColor, setBgColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  //   const [selectedColor, setSelectedColor] = useState("");

  const colors = ["#FFA500", "#008000", "#FF0000", "#0000FF", "#FFFFFF"];

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        context.lineCap = "round";
      }
    }
  }, []);
  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.style.background = bgColor;
        if (brushSize > 20) {
          setBrushSize(20);
        } else if (brushSize < 3) {
          setBrushSize(3);
        }

        if (isEraser) {
          setColor(bgColor);
          context.globalCompositeOperation = "destination-out";
        } else {
          context.globalCompositeOperation = "source-over";
        }
        context.strokeStyle = color;

        context.lineWidth = brushSize;
      }
    }
  }, [brushSize, isEraser, bgColor]);

  const startDrawing = (e) => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = color;
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="font-mono">
      <div className="flex top-5 left-5 h-auto p-2 w-full items-center justify-center gap-24 ">
        <div>
          <label htmlFor="size" className="mr-2">
            Size:
          </label>
          <input
            className="border-2 border-black rounded-lg pl-3 py-1"
            type="number"
            name=""
            id="size"
            min={3}
            max={20}
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
          />
        </div>
        <div className="flex">
          {colors.map((defaultColor) => (
            <button
              key={defaultColor}
              className={`text-3xl rounded-full w-7 h-7 m-2 border-2 ${
                defaultColor == color ? "border-2 border-black" : ""
              } `}
              style={{ backgroundColor: defaultColor }}
              onClick={() => {
                setColor(defaultColor);
                setIsEraser(false);
              }}
            ></button>
          ))}
          <div className="flex flex-col-reverse items-center ml-1 ">
            <label
              htmlFor="brushColor"
              className="items-center text-center text-base leading-4 "
            >
              Choose More <br /> Colors
            </label>
            <input
              className="border-none bg-transparent h-7 w-7 p-0 cursor-pointer rounded-md "
              type="color"
              id="brushColor"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse items-center ">
          <label
            htmlFor="bgcolor"
            className="items-center text-center text-base leading-4 "
          >
            Choose <br /> BgColor
          </label>
          <input
            className="border-none bg-transparent h-7 w-7 rounded-md p-0 cursor-pointer "
            type="color"
            id="bgcolor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsEraser((prev) => !prev)}
          className={`px-6 py-2 bg-red-500 text-bold rounded-md -skew-x-12 ${
            isEraser ? "bg-gray-500" : ""
          }`}
        >
          Eraser
        </button>
        <button
          onClick={clearCanvas}
          className=" px-6 py-2 bg-red-500 text-bold rounded-md -skew-x-12 "
        >
          Reset
        </button>
      </div>
      <canvas
        className={`top-0 left-0 w-full h-full overflow-x-hidden overflow-y-hidden ${
          isEraser ? "cursor-cell" : "cursor-crosshair"
        } `}
        ref={ref}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  );
}

export default Canvas;
