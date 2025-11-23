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

  // Load models
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

  // Toggle camera
  useEffect(() => {
    if (mode === "camera") startCamera();
    else stopCamera();
  }, [mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch {
      alert("Camera permission denied!");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  // Capture
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

  // Upload
  const uploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    imgRef.current.src = URL.createObjectURL(file);
    imgRef.current.onload = () => {
      setImageLoaded(true);
      detectEmotion();
    };
  };

  // Detect Emotion
  const detectEmotion = async () => {
    setIsDetecting(true);

    const img = imgRef.current;
    const canvas = canvasRef.current;

    // FIX: correct canvas size
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

    // Draw
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resized = faceapi.resizeResults(detection, {
      width: canvas.width,
      height: canvas.height,
    });

    faceapi.draw.drawDetections(canvas, resized);

    // Pick emotion
    const exp = detection.expressions;
    const bestEmotion = Object.keys(exp).reduce((a, b) =>
      exp[a] > exp[b] ? a : b
    );

    setEmotion(bestEmotion);
    onEmotionDetected(bestEmotion);

    ctx.font = "22px Poppins";
    ctx.fillStyle = "yellow";

    // FIXED label position
    ctx.fillText(
      bestEmotion,
      resized.detection.box.x,
      resized.detection.box.y - 10
    );
  };

  return (
    <div className="p-6 bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700 space-y-6">

      {/* Mode */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg ${
            mode === "upload" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Upload Photo
        </button>
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg ${
            mode === "camera" ? "bg-indigo-600" : "bg-slate-700"
          }`}
        >
          Use Camera
        </button>
      </div>

      {/* Upload */}
      {mode === "upload" && (
        <div className="space-y-2">
          <input type="file" accept="image/*" onChange={uploadPhoto} />

          {!imageLoaded && (
            <img src="/happy.jpg" className="rounded-xl opacity-60" />
          )}
        </div>
      )}

      {/* Camera */}
      {mode === "camera" && (
        <div>
          <video ref={videoRef} autoPlay className="rounded-xl border shadow-md w-full" />
          <button
            onClick={capturePhoto}
            className="mt-3 px-4 py-2 bg-green-600 rounded-lg"
          >
            Capture
          </button>
        </div>
      )}

      {/* Image + Canvas */}
      <div className="relative w-full max-w-xl mx-auto">
        <img ref={imgRef} className="rounded-lg shadow-lg w-full" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
      </div>

      {isDetecting && <p className="text-indigo-300 animate-pulse text-center">Detecting emotion…</p>}

      {emotion && (
        <p className="text-center text-xl font-semibold text-white">
          Emotion: <span className="text-indigo-400 capitalize">{emotion}</span>
        </p>
      )}

      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
