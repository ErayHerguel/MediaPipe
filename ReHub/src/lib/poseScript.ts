import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

let lastAngle = 0;
let lastUpdateTime = 0;
let isMovingToStart = false;
let repetitions = 0;
const debounceTime = 1000;

export function initialize(
  videoElementId: string,
  canvasElementId: string,
  progressBarId: string,
  angleDisplayId: string,
  repetitionsDisplayId: string,
  messageId: string
): void {
  const videoElement = document.getElementById(videoElementId) as HTMLVideoElement;
  const canvasElement = document.getElementById(canvasElementId) as HTMLCanvasElement;
  const progressBar = document.getElementById(progressBarId) as HTMLDivElement;
  const angleDisplay = document.getElementById(angleDisplayId) as HTMLDivElement;
  const repetitionsDisplay = document.getElementById(repetitionsDisplayId) as HTMLDivElement;
  const messageElement = document.getElementById(messageId) as HTMLDivElement;

  if (!videoElement || !canvasElement || !progressBar || !angleDisplay || !repetitionsDisplay || !messageElement) {
    console.error("Ein oder mehrere DOM-Elemente konnten nicht gefunden werden.");
    return;
  }

  const canvasCtx = canvasElement.getContext("2d");
  if (!canvasCtx) {
    console.error("Canvas Kontext konnte nicht initialisiert werden.");
    return;
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;

        const pose = new Pose({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 2,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => onResults(results, canvasCtx, canvasElement, angleDisplay, repetitionsDisplay, progressBar, messageElement));

        const camera = new Camera(videoElement, {
          onFrame: async () => {
            await pose.send({ image: videoElement });
          },
          width: 640,
          height: 480,
        });
        camera.start();
      })
      .catch((error) => {
        console.error("Fehler beim Zugriff auf die Kamera:", error);
        alert("Es gab ein Problem beim Zugriff auf die Kamera.");
      });
  } else {
    alert("getUserMedia ist in diesem Browser nicht verfügbar.");
  }
}

function onResults(
  results: any,
  canvasCtx: CanvasRenderingContext2D,
  canvasElement: HTMLCanvasElement,
  angleDisplay: HTMLDivElement,
  repetitionsDisplay: HTMLDivElement,
  progressBar: HTMLDivElement,
  messageElement: HTMLDivElement
): void {
  if (!canvasElement || !canvasCtx) {
    console.error("Canvas-Element oder Kontext ist nicht verfügbar.");
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#E5FC3A",
      lineWidth: 4,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#E5FC3A",
      lineWidth: 2,
    });

    const hip = results.poseLandmarks[23];
    const knee = results.poseLandmarks[25];
    const ankle = results.poseLandmarks[27];
    const angle = calculateAngle(hip, knee, ankle);

    if (angleDisplay) {
      angleDisplay.innerText = `Winkel: ${angle.toFixed(2)}°`;
    }
    checkRepetition(angle);
    if (repetitionsDisplay) {
      repetitionsDisplay.innerText = `Wiederholungen: ${repetitions}`;
    }

    const userInFrame = checkUserInFrame(results.poseLandmarks);
    displayMessage(!userInFrame, messageElement);

    updateProgressBar(angle, progressBar);
  }
  canvasCtx.restore();
}

function calculateAngle(hip: any, knee: any, ankle: any): number {
  if (hip.visibility < 0.6 || knee.visibility < 0.6 || ankle.visibility < 0.6) {
    return lastAngle;
  }
  const radians =
    Math.atan2(ankle.y - knee.y, ankle.x - knee.x) -
    Math.atan2(hip.y - knee.y, hip.x - knee.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) {
    angle = 360 - angle;
  }
  return angle;
}

function checkRepetition(angle: number): void {
  const currentTime = Date.now();
  if (currentTime - lastUpdateTime < debounceTime) return;

  if (angle >= 160 && lastAngle < 160) {
    isMovingToStart = true;
  }
  if (angle < 160 && lastAngle >= 160 && isMovingToStart) {
    repetitions++;
    isMovingToStart = false;
    lastUpdateTime = currentTime;
  }
  lastAngle = angle;
}

function drawLandmarks(context: CanvasRenderingContext2D, landmarks: any[], style: any = {}): void {
  context.fillStyle = style.color || "white";
  landmarks.forEach((landmark) => {
    context.beginPath();
    context.arc(
      landmark.x * context.canvas.width,
      landmark.y * context.canvas.height,
      style.size || 3,
      0,
      2 * Math.PI
    );
    context.fill();
  });
}

function drawConnectors(context: CanvasRenderingContext2D, landmarks: any[], connections: any[], style: any = {}): void {
  context.strokeStyle = style.color || "white";
  context.lineWidth = style.lineWidth || 2;
  connections.forEach(([startIdx, endIdx]) => {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    context.beginPath();
    context.moveTo(
      start.x * context.canvas.width,
      start.y * context.canvas.height
    );
    context.lineTo(end.x * context.canvas.width, end.y * context.canvas.height);
    context.stroke();
  });
}

function checkUserInFrame(poseLandmarks: any[]): boolean {
  const visibilityThreshold = 0.5;
  let inFrame = true;

  for (let landmark of poseLandmarks) {
    if (landmark.visibility < visibilityThreshold) {
      inFrame = false;
      break;
    }
  }

  return inFrame;
}

function displayMessage(show: boolean, messageElement: HTMLDivElement): void {
  if (!messageElement) return;

  if (show) {
    messageElement.style.display = "block";
  } else {
    messageElement.style.display = "none";
  }
}

function updateProgressBar(angle: number, progressBar: HTMLDivElement): void {
  const minAngle = 100;
  const maxAngle = 180;
  const progressPercentage = ((angle - minAngle) / (maxAngle - minAngle)) * 100;
  const boundedProgress = Math.max(0, Math.min(progressPercentage, 100));

  if (progressBar) {
    progressBar.style.width = `${boundedProgress}%`;
  }
}
