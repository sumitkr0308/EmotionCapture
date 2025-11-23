import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { emotionTheme } from "../theme/emotionTheme";
import { getAutoTextColor } from "../utils/getTextContrast";

export default function PhotoEmotionDetectorWithCamera({ onEmotionDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const imgRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [emotion, setEmotion] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // SELECT THEME
  const theme = emotionTheme[emotion] || emotionTheme.neutral;
  const textColor =
    theme.text === "auto"
      ? getAutoTextColor(theme.background)
      : theme.text;

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      console.log("Models loaded");
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
  }, [mode]);

  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch {
      alert("Camera permission denied!");
    }
  };

  const stopCamera = () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());

      video.srcObject = null;
    } catch (err) {
      console.log("Failed to stop camera:", err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const temp = captureCanvasRef.current;
    const ctx = temp.getContext("2d");

    temp.width = video.videoWidth;
    temp.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    imgRef.current.src = temp.toDataURL("image/jpeg", 0.9);

    imgRef.current.onload = () => {
      setImageLoaded(true);
      detectEmotion();
    };
  };

  const uploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    imgRef.current.src = URL.createObjectURL(file);
    imgRef.current.onload = () => {
      setImageLoaded(true);
      detectEmotion();
    };
  };

  const detectEmotion = async () => {
    setIsDetecting(true);

    const img = imgRef.current;
    const canvas = canvasRef.current;

    canvas.width = img.clientWidth || img.naturalWidth;
    canvas.height = img.clientHeight || img.naturalHeight;

    const detection = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5,
        })
      )
      .withFaceExpressions();

    setIsDetecting(false);

    if (!detection) {
      alert("No face detected. Try better lighting or a clearer image.");
      return;
    }

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resized = faceapi.resizeResults(detection, {
      width: canvas.width,
      height: canvas.height,
    });

    faceapi.draw.drawDetections(canvas, resized);

    const exp = detection.expressions;
    const bestEmotion = Object.keys(exp).reduce((a, b) =>
      exp[a] > exp[b] ? a : b
    );

    setEmotion(bestEmotion);
    onEmotionDetected(bestEmotion);

    ctx.font = "22px Poppins";
    ctx.fillStyle = "yellow";
    ctx.fillText(
      bestEmotion,
      resized.detection.box.x,
      resized.detection.box.y - 10
    );
  };

  return (
    <div
      className={`
      p-5 sm:p-7 
      bg-white/10 backdrop-blur-2xl 
      rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] 
      border border-white/10 space-y-6 
      w-full max-w-3xl mx-auto 
      transition-all
    `}
    >
      {/* MODE BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setMode("upload")}
          className={`
            px-5 py-2.5 rounded-xl
            text-sm font-semibold w-full sm:w-auto 
            shadow-md transition-all
            ${
              mode === "upload"
                ? "bg-indigo-600 text-white shadow-indigo-500/40"
                : "bg-white/10 hover:bg-white/20"
            }
            ${textColor}
          `}
        >
          Upload Photo
        </button>

        <button
          onClick={() => setMode("camera")}
          className={`
            px-5 py-2.5 rounded-xl
            text-sm font-semibold w-full sm:w-auto 
            shadow-md transition-all
            ${
              mode === "camera"
                ? "bg-indigo-600 text-white shadow-indigo-500/40"
                : "bg-white/10 hover:bg-white/20"
            }
            ${textColor}
          `}
        >
          Use Camera
        </button>
      </div>

      {/* UPLOAD MODE */}
      {mode === "upload" && (
        <div className="space-y-5 text-center">
          <label className="block cursor-pointer">
            <div
              className={`
              w-full max-w-md mx-auto p-6
              border-2 border-dashed 
              rounded-2xl bg-white/10 hover:bg-white/20 
              transition-all shadow-lg
              border-indigo-400/40
              ${textColor}
            `}
            >
              <p className={`${textColor} text-sm font-medium`}>
                Click to upload an image
              </p>
              <p className="text-xs mt-2 text-gray-300">
                JPG • PNG supported
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              className="hidden"
            />
          </label>

          {!imageLoaded && (
            <div className="w-full max-w-sm mx-auto">
              <img
                src="/happy.jpg"
                className="
                  rounded-xl opacity-70 w-full 
                  shadow-xl border border-white/10
                "
              />
              <p className="text-xs text-gray-300 mt-2">
                Your uploaded image will appear here
              </p>
            </div>
          )}
        </div>
      )}

      {/* CAMERA MODE */}
      {mode === "camera" && (
        <div className="flex flex-col items-center space-y-3">
          <video
            ref={videoRef}
            autoPlay
            className="
              rounded-xl border border-white/10 
              shadow-lg w-full max-w-lg
            "
          />

          <button
            onClick={capturePhoto}
            className="
              mt-2 px-5 py-2.5 bg-green-600 
              rounded-xl text-sm shadow-green-500/40 
              hover:bg-green-500 transition-all
            "
          >
            Capture Photo
          </button>
        </div>
      )}

      {/* IMAGE + CANVAS */}
      <div className="relative w-full max-w-xl mx-auto">
        <img ref={imgRef} className="rounded-xl shadow-xl w-full" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {isDetecting && (
        <p className={`animate-pulse text-center text-sm ${textColor}`}>
          Detecting emotion…
        </p>
      )}

      {emotion && (
        <p
          className={`
          text-center text-lg font-semibold 
          ${textColor}
        `}
        >
          Emotion:
          <span className="capitalize ml-2 text-indigo-300">
            {emotion}
          </span>
        </p>
      )}

      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
