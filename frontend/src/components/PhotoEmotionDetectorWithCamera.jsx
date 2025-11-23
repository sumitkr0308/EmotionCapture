import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export default function PhotoEmotionDetectorWithCamera({ onEmotionDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const imgRef = useRef(null);

  const [mode, setMode] = useState("upload");
  const [emotion, setEmotion] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    stopCamera(); // prevent duplicate streams (StrictMode fix)

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
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      video.srcObject = null; // fully detach stream
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
    <div className="p-4 sm:p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700 space-y-6 w-full max-w-3xl mx-auto">
      {/* Mode Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto ${
            mode === "upload" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Upload Photo
        </button>
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto ${
            mode === "camera" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Use Camera
        </button>
      </div>

      {/* Upload */}
      {mode === "upload" && (
        <div className="space-y-4 text-center w-full">
          {/* Upload Box */}
          <label className="block cursor-pointer">
            <div className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-indigo-400/40 rounded-2xl bg-white/5 hover:bg-white/10 transition-all shadow-lg">
              <p className="text-sm text-indigo-300 font-medium">
                Click to upload an image
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG supported</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              className="hidden"
            />
          </label>

          {/* Placeholder Preview */}
          {!imageLoaded && (
            <div className="w-full max-w-sm mx-auto">
              <img
                src="/happy.jpg"
                className="rounded-xl opacity-70 w-full shadow-lg border border-white/10"
              />
              <p className="text-xs text-gray-400 mt-2">
                Your uploaded image will appear here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Camera */}
      {mode === "camera" && (
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            className="rounded-xl border shadow-md w-full max-w-lg"
          />
          <button
            onClick={capturePhoto}
            className="mt-3 px-4 py-2 bg-green-600 rounded-lg text-sm sm:text-base"
          >
            Capture
          </button>
        </div>
      )}

      {/* Image + Canvas */}
      <div className="relative w-full mx-auto max-w-xl">
        <img ref={imgRef} className="rounded-lg shadow-lg w-full" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      {isDetecting && (
        <p className="text-indigo-300 animate-pulse text-center text-sm sm:text-base">
          Detecting emotion…
        </p>
      )}

      {emotion && (
        <p className="text-center text-lg sm:text-xl font-semibold text-white">
          Emotion: <span className="text-indigo-400 capitalize">{emotion}</span>
        </p>
      )}

      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
