import React, { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import Label from "../components/Label";
import eraser from "../images/eraser.png";
import Button from "../components/Button";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

function Canvas() {
  const ref = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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

  const saveState = () => {
    const canvas = ref.current;
    if (canvas) {
      const currentState = canvas.toDataURL();
      undoStack.push(currentState); // Push state only if it's different from the last
      redoStack.length = 0; // Clear redoStack
    }
  };

  const startDrawing = (x, y) => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        saveState();
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (x, y) => {
    if (!isDrawing) {
      return;
    }
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = color;
        context.lineTo(x, y);
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

  const downloadImg = () => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const imgUrl = canvas.toDataURL();

        const createEl = document.createElement("a");
        createEl.href = imgUrl;

        // This is the name of our downloaded file
        createEl.download = "sudhanshu";
        createEl.click();
        createEl.remove();
      }
    }
  };

  const handleMouseMove = (e) => {
    draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const handleMouseDown = (e) => {
    startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  useEffect(() => {
    const canvas = ref.current;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      startDrawing(x, y);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      draw(x, y);
    };

    const handleTouchEnd = (e) => {
      stopDrawing();
    };

    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);

      return () => {
        // Clean up event listeners
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDrawing]);

  const undo = () => {
    const canvas = ref.current;
    if (canvas && undoStack.length > 0) {
      const context = canvas.getContext("2d");
      const imgData = undoStack[undoStack.length - 1]; // Use the last state
      redoStack.push(undoStack.pop()); // Push current state to redo stack
      console.log("undo", undoStack.length, "redo", redoStack.length);

      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        context.drawImage(img, 0, 0); // Restore previous state
      };
    }
  };

  const redo = () => {
    const canvas = ref.current;
    if (redoStack.length > 0) {
      const context = canvas.getContext("2d");
      const imgData = redoStack[redoStack.length - 1]; // Use the last state

      undoStack.push(redoStack.pop()); // Push current state to redo stack
      console.log("undo", undoStack.length, "redo", redoStack.length);
      const img = new Image();
      img.src = imgData;

      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        context.drawImage(img, 0, 0); // Restore previous state
      };
    }
  };

  return (
    <>
      <div className="absolute text-white z-50 flex gap-3 ml-2 top-1/4 items-center">
        <UndoIcon fontSize="large" className="cursor-pointer" onClick={undo} />
        <RedoIcon fontSize="large" className="cursor-pointer" onClick={redo} />
      </div>
      <div className="absolute z-20 flex top-1/2 items-center -left-12 ">
        <Input
          className=" pl-2 -rotate-90 "
          type="range"
          id="size"
          min="3"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
      </div>
      <div className="font-mono relative h-[90vh]">
        <div className="flex justify-around items-center p-4 gap-7 bg-gray-100 w-full ">
          {/* Size, Color, and Background Color Section */}
          <div className="flex items-center w-full sm:w-auto">
            {/* Brush Size */}

            <div className="flex items-center md:gap-10 gap-5">
              {/* Color Picker */}
              <div className=" grid grid-cols-3 items-center">
                {colors.map((defaultColor) => (
                  <button
                    key={defaultColor}
                    className={`text-3xl rounded-full w-6 h-6 border-2 ${
                      defaultColor === color ? "border-black" : ""
                    }`}
                    style={{ backgroundColor: defaultColor }}
                    onClick={() => {
                      setColor(defaultColor);
                      setIsEraser(false);
                    }}
                  />
                ))}
                <div className="flex flex-col-reverse items-center ">
                  <Label label="Choose" htmlFor="color" />
                  <Input
                    type="color"
                    id="color"
                    className=" h-6 w-6 cursor-pointer"
                    onChange={(e) => setColor(e.target.value)}
                    value={color}
                  />
                </div>
              </div>
              {/* Background Color */}
              <div className="flex flex-col-reverse items-center space-x-2">
                <Label label="BgColor" htmlFor="bgcolor" />
                <Input
                  id="bgcolor"
                  type="color"
                  className="border-none bg-transparent h-7 w-7 cursor-pointer rounded-md"
                  onChange={(e) => setBgColor(e.target.value)}
                  value={bgColor}
                />
              </div>
            </div>
          </div>

          {/* Erase and Reset Section */}
          <div className="flex items-center justify-end w-full sm:w-auto gap-4">
            {/* Eraser */}
            <div className="flex flex-col-reverse items-center">
              <Label label="Erase" />
              <img
                width={20}
                src={eraser}
                alt="Eraser"
                onClick={() => setIsEraser((prev) => !prev)}
                className={`cursor-pointer ${isEraser ? "grayscale" : ""}`}
              />
            </div>

            {/* Reset Button */}
            <Button
              onClick={clearCanvas}
              className=" bg-red-500 text-bold rounded-md "
              text="Reset"
            />
            <Button
              onClick={downloadImg}
              className="  text-bold rounded-md"
              text="Download"
            />
          </div>
        </div>

        <canvas
          className={` w-full h-full ${
            isEraser ? "cursor-cell" : "cursor-crosshair"
          } `}
          ref={ref}
          onMouseDown={handleMouseDown}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={handleMouseMove}
        />
      </div>
    </>
  );
}

export default Canvas;
