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

  // Load Face API Models
  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
  }, []);

  // Handle camera on or off
  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
  }, [mode]);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    imgRef.current.src = canvas.toDataURL("image/jpeg", 0.9);

    imgRef.current.onload = () => {
      setImageLoaded(true);
      detectEmotion();
    };
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    imgRef.current.src = URL.createObjectURL(file);

    imgRef.current.onload = () => {
      setImageLoaded(true);
      detectEmotion();
    };
  };

  // MAIN FACE DETECTION
  const detectEmotion = async () => {
    setIsDetecting(true);

    const img = imgRef.current;
    const canvas = canvasRef.current;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    setIsDetecting(false);

    if (!detection) {
      alert("No face detected! Try a clearer image.");
      return;
    }

    // Draw face detection box
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
      detection.detection.box.x,
      detection.detection.box.y - 10
    );
  };

  return (
    <div className="p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700 space-y-6">

      {/* Mode Switch */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg transition ${
            mode === "upload" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Upload Photo
        </button>

        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg transition ${
            mode === "camera" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Use Camera
        </button>
      </div>

      {/* Upload */}
      {mode === "upload" && (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            className="text-white"
            onChange={uploadPhoto}
          />

          {!imageLoaded && (
            <img
              src="/mnt/data/Screenshot 2025-11-23 004225.png"
              className="rounded-xl opacity-60"
            />
          )}
        </div>
      )}

      {/* Camera */}
      {mode === "camera" && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            className="rounded-xl border border-slate-700 shadow-md w-full"
          />
          <button
            onClick={capturePhoto}
            className="mt-3 px-4 py-2 bg-green-600 rounded-lg"
          >
            Capture
          </button>
        </div>
      )}

      {/* Display Image + Detection */}
      <div className="relative w-full max-w-xl mx-auto">
        <img ref={imgRef} className="rounded-lg shadow-lg" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>

      {/* Loader */}
      {isDetecting && (
        <p className="text-indigo-300 animate-pulse text-center">
          Detecting emotion...
        </p>
      )}

      {/* Emotion Result */}
      {emotion && (
        <p className="text-center text-xl font-semibold text-white">
          Emotion: <span className="text-indigo-400">{emotion}</span>
        </p>
      )}

      <canvas ref={captureCanvasRef} className="hidden"></canvas>
    </div>
  );
}
