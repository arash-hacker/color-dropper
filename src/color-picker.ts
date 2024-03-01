const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};
const getColor = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const data = ctx.getImageData(x, y, 1, 1).data;
  const hex = rgbToHex(data[0], data[1], data[2]).toUpperCase();
  return hex;
};
export const processByCanvases = ({
  mainCanvas,
  picker,
  masker,
  pickerSize = 200,
  srcImage,
}: {
  mainCanvas: string;
  picker: string;
  masker: string;
  pickerSize: number;
  srcImage: string;
}) => {
  const canvas = document.getElementById(mainCanvas) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colorPicker = document.getElementById(picker) as HTMLCanvasElement;
  const pickerCtx = colorPicker.getContext("2d")!;
  pickerCtx.imageSmoothingEnabled = false;

  const mask = document.getElementById(masker) as HTMLCanvasElement;
  const maskCtx = mask.getContext("2d")!;
  maskCtx.imageSmoothingEnabled = false;

  loadImage(canvas, srcImage);

  //---
  colorPicker.addEventListener("mouseenter", (event) => {});
  colorPicker.addEventListener("mouseleave", (event) => {});
  colorPicker.addEventListener("mousemove", (event) => {
    colorPicker.style.cursor = "none";
    const cpTop = colorPicker.getBoundingClientRect().top;
    const canTop = canvas.getBoundingClientRect().top;
    if (cpTop + pickerSize / 2 < canTop) {
      colorPicker.style.display = "none";
      return;
    }
    const hex = transferPicker(canvas, event, ctx, colorPicker, pickerSize);
    DrawPickerCircle({
      pickerCtx,
      picker: colorPicker,
      maskCtx,
      mask,
      canvas,
      event,
      pickerSize,
      hex,
    });
  });

  ///---
  canvas.addEventListener("mouseleave", (event) => {});

  canvas.addEventListener("mouseenter", (event) => {
    colorPicker.style.display = "block";
    transferPicker(canvas, event, ctx, colorPicker, pickerSize);
  });

  canvas.addEventListener("mousemove", (event) => {});
};

const DrawPickerCircle = ({
  pickerCtx,
  picker,
  maskCtx,
  mask,
  canvas,
  event,
  pickerSize,
  hex,
}: {
  pickerCtx: CanvasRenderingContext2D;
  picker: HTMLCanvasElement;
  maskCtx: CanvasRenderingContext2D;
  mask: HTMLCanvasElement;
  canvas: HTMLCanvasElement;
  event: MouseEvent;
  pickerSize: number;
  hex: string;
}) => {
  const { left: canvasX, top: canvasY } = canvas.getBoundingClientRect();

  pickerCtx.clearRect(0, 0, picker.width, picker.height);
  pickerCtx.drawImage(
    canvas,
    event.clientX - canvasX,
    event.clientY - canvasY,
    20,
    20,
    0,
    0,
    pickerSize,
    pickerSize
  );

  pickerCtx.lineWidth = 1;

  for (let x = 0; x <= pickerSize; x += pickerSize / 20) {
    pickerCtx.moveTo(x, 0);
    pickerCtx.lineTo(x, pickerSize);
  }
  for (let y = 0; y <= pickerSize; y += pickerSize / 20) {
    pickerCtx.moveTo(0, y);
    pickerCtx.lineTo(pickerSize, y);
  }
  pickerCtx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  pickerCtx.stroke();

  pickerCtx.strokeStyle = "rgba(250, 50, 50, 1)";
  pickerCtx.strokeRect(
    (pickerSize / 20) * 10,
    (pickerSize / 20) * 10,
    pickerSize / 20,
    pickerSize / 20
  );

  pickerCtx.strokeStyle = "rgba(100, 100, 100, 1)";
  pickerCtx.fillRect(60, 120, 90, 30);
  pickerCtx.strokeStyle = "rgba(250, 250, 250, 1)";
  pickerCtx.font = "20px Sans-serif";
  pickerCtx.strokeText(hex, 60, 140);

  pickerCtx.beginPath();
  pickerCtx.arc(pickerSize / 2, pickerSize / 2, 90, 0, 2 * Math.PI, false);
  pickerCtx.strokeStyle = "#000000";
  pickerCtx.lineWidth = 15;
  pickerCtx.stroke();
  pickerCtx.closePath();

  pickerCtx.beginPath();
  pickerCtx.arc(
    pickerSize / 2,
    pickerSize / 2,
    pickerSize / 2 - 10,
    0,
    2 * Math.PI,
    false
  );
  pickerCtx.strokeStyle = hex;
  pickerCtx.lineWidth = 9;
  pickerCtx.stroke();
  pickerCtx.closePath();

  maskCtx.arc(
    pickerSize / 2,
    pickerSize / 2,
    pickerSize / 2 - 5,
    0,
    2 * Math.PI,
    false
  );
  maskCtx.fillStyle = "red";
  maskCtx.fill();

  pickerCtx.globalCompositeOperation = "destination-in";
  pickerCtx.drawImage(mask, 0, 0);
  pickerCtx.globalCompositeOperation = "source-over";
};

const transferPicker = (
  canvas: HTMLCanvasElement,
  event: MouseEvent,
  ctx: CanvasRenderingContext2D,
  colorPicker: HTMLCanvasElement,
  pickerSize: number
) => {
  const { left: canvasX, top: canvasY } = canvas.getBoundingClientRect();
  const realPositionOnMainCanvas = {
    y: event.clientY - canvasY,
    x: event.clientX - canvasX,
  };
  const hex = getColor(
    ctx,
    event.clientX - canvasX + pickerSize / 20,
    event.clientY - canvasY + pickerSize / 20
  );

  colorPicker.style.borderColor = hex;

  colorPicker.style.top = `${realPositionOnMainCanvas.y - pickerSize / 2}px`;
  colorPicker.style.left = `${realPositionOnMainCanvas.x - pickerSize / 2}px`;
  return hex;
};

function loadImage(canvas: HTMLCanvasElement, srcImage: string) {
  let base_image = new Image();
  base_image.src = srcImage;
  base_image.onload = function () {
    canvas
      .getContext("2d")!
      .drawImage(base_image, 0, 0, canvas.width, canvas.height);
  };
}
