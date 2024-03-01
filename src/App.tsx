import { useEffect, useRef, useState } from "react";
import { processByCanvases } from "./color-picker";

const App = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState("");
  useEffect(() => {
    if (ref.current) {
      processByCanvases({
        mainCanvas: "myCanvas",
        picker: "picker",
        masker: "masker",
        pickerSize: 200,
        srcImage: image,
      });
    }
  }, [image]);

  return (
    <>
      <div style={{ width: "100px", height: "200px" }}>
        <button
          onClick={() => {
            setImage("./image1.jpg");
          }}
        >
          pic1
        </button>
        <button
          onClick={() => {
            setImage("./image2.jpeg");
          }}
        >
          pic2
        </button>
        <button
          onClick={() => {
            setImage("./image3.jpg");
          }}
        >
          pic3
        </button>
        <button
          onClick={() => {
            setImage("./rgb.jpg");
          }}
        >
          rgb
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={ref} id="myCanvas" width="0" height="0"></canvas>
        <canvas
          style={{ position: "absolute", zIndex: 100 }}
          id="picker"
          width="200"
          height="200"
        ></canvas>
        <canvas
          style={{
            display: "none",
            position: "absolute",
            zIndex: 100,
          }}
          id="masker"
          width="200"
          height="200"
        ></canvas>
      </div>
    </>
  );
};
export default App;
