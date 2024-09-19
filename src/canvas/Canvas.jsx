import React, { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import Label from "../components/Label";
import eraser from "../images/eraser.png";
import Button from "../components/Button";

function Canvas() {
  const ref = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");
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

  const downloadImg = () => {
    const canvas = ref.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const imgUrl = canvas.toDataURL();
        console.log(imgUrl);

        const createEl = document.createElement("a");
        createEl.href = imgUrl;

        // This is the name of our downloaded file
        createEl.download = "sudhansuh-Paint";
        createEl.click();
        createEl.remove();
      }
    }
  };

  return (
    <div className="font-mono">
      <div className="flex justify-between items-center p-4 bg-gray-100 w-full">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <Label label="Size:" htmlFor="size" />
            <Input
              className="border-2 border-black rounded-lg pl-3 py-1"
              type="number"
              id="size"
              min="3"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            {colors.map((defaultColor) => (
              <button
                key={defaultColor}
                className={`text-3xl rounded-full w-7 h-7 border-2 ${
                  defaultColor === color ? "border-black" : ""
                }`}
                style={{ backgroundColor: defaultColor }}
                onClick={() => {
                  setColor(defaultColor);
                  setIsEraser(false);
                }}
              />
            ))}
            <div className="flex flex-col-reverse items-center">
              <Label label="Colors" htmlFor="color" />
              <Input
                type="color"
                id="color"
                className="border-none bg-transparent h-7 w-7 cursor-pointer rounded-md"
                onChange={(e) => setColor(e.target.value)}
                value={color}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse items-center space-x-2">
            <Label label="Background" htmlFor="bgcolor" />
            <Input
              id="bgcolor"
              type="color"
              className="border-none bg-transparent h-7 w-7 cursor-pointer rounded-md"
              onChange={(e) => setBgColor(e.target.value)}
              value={bgColor}
            />
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex flex-col-reverse items-center ">
            <Label label="Erase" />
            <img
              width={28}
              src={eraser}
              alt="Eraser"
              onClick={() => setIsEraser((prev) => !prev)}
              className={`cursor-pointer ${isEraser ? "grayscale" : ""}`}
            />
          </div>

          {/* Reset Button */}
          <Button
            onClick={clearCanvas}
            className="px-6 bg-red-500 text-bold rounded-md"
            text="Reset"
          />
        </div>

        {/* Download Section */}
        <Button
          onClick={downloadImg}
          className="px-6 text-bold rounded-md"
          text="Download"
        />
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

// <div className="flex top-5 left-5 h-auto p-2 w-full items-center justify-center gap-24 ">
//   <div>
//     <Label label="size: " htmlFor="size" className="mr-2" />
//     <Input
//       className="border-2 border-black rounded-lg pl-3 py-1"
//       type="number"
//       id="size"
//       min="3"
//       max="20"
//       value={brushSize}
//       onChange={(e) => setBrushSize(e.target.value)}
//     />
//   </div>
//   <div className="flex">
//     {colors.map((defaultColor) => (
//       <button
//         key={defaultColor}
//         className={`text-3xl rounded-full w-7 h-7 m-2 border-2 ${
//           defaultColor == color ? "border-2 border-black" : ""
//         } `}
//         style={{ backgroundColor: defaultColor }}
//         onClick={() => {
//           setColor(defaultColor);
//           setIsEraser(false);
//         }}
//       ></button>
//     ))}
//     <div className="flex flex-col-reverse h-auto items-center ml-1 ">
//       <Label label={`Choose\nColor`} htmlFor="color" />
//       <Input
//         type="color"
//         id="color"
//         className="border-none bg-transparent h-7 w-7 p-0 cursor-pointer rounded-md "
//         label={`Choose More Colors`}
//         onChange={(e) => setColor(e.target.value)}
//         value={color}
//       />
//     </div>
//   </div>
//   <div className="flex flex-col-reverse items-center text-wrap text-center ">
//     <Label label={`Choose BgColor`} htmlFor="bgcolor" />
//     <Input
//       id="bgcolor"
//       type="color"
//       className="border-none bg-transparent h-7 w-7 p-0 cursor-pointer rounded-md "
//       onChange={(e) => setBgColor(e.target.value)}
//       value={bgColor}
//     />
//   </div>

//   <div className="flex flex-col-reverse items-center">
//     <Label label="Erase" />
//     <img
//       width={28}
//       src={eraser}
//       alt="Eraser"
//       onClick={() => setIsEraser((prev) => !prev)}
//       className={isEraser ? "grayscale " : ""}
//     />
//   </div>

//   <Button
//     onClick={clearCanvas}
//     className=" px-6 py-2 bg-red-500 text-bold rounded-md -skew-x-12 "
//     text="Reset"
//   />
//   <Button
//     onClick={downloadImg}
//     className=" px-6 py-2 bg-red-500 text-bold rounded-md -skew-x-12 "
//     text="Download"
//   />
// </div>;
