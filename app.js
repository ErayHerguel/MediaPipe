const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// MediaPipe Pose Bibliothek laden
const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});

pose.setOptions({
  modelComplexity: 2,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Fehlerbehandlung für Pose-Erkennung hinzugefügt
pose.onResults(onResults, onError);

function onError(error) {
  console.error("Fehler bei der Pose-Erkennung:", error);
  // Optional: Benutzerfreundliche Fehlermeldung anzeigen
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.font = "16px Arial";
  canvasCtx.fillStyle = "red";
  canvasCtx.fillText(
    "Fehler bei der Pose-Erkennung. Bitte überprüfen Sie die Kamera und die Einstellungen.",
    10,
    50
  );
  canvasCtx.restore();
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    try {
      await pose.send({ image: videoElement });
    } catch (error) {
      onError(error);
    }
  },
  width: 640,
  height: 480,
});
camera.start();

let repetitions = 0;
let lastAngle = 0;
let isMovingToStart = false;
let lastUpdateTime = Date.now();
let debounceTime = 500; // Anpassbar, abhängig von der Bewegungsgeschwindigkeit

function onResults(results) {
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
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });

    const hip = results.poseLandmarks[23];
    const knee = results.poseLandmarks[25];
    const ankle = results.poseLandmarks[27];
    const angle = calculateAngle(hip, knee, ankle);

    canvasCtx.font = "16px Arial";
    canvasCtx.fillStyle = "red";
    canvasCtx.fillText("Winkel: " + angle.toFixed(2) + "°", 10, 50);
    checkRepetition(angle);
    canvasCtx.fillText("Wiederholungen: " + repetitions, 10, 70);
  }
  canvasCtx.restore();
}

function calculateAngle(hip, knee, ankle) {
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

function checkRepetition(angle) {
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

function drawLandmarks(context, landmarks, style = {}) {
  context.fillStyle = style.color || "white";
  landmarks.forEach((landmark) => {
    context.beginPath();
    context.arc(
      landmark.x * canvasElement.width,
      landmark.y * canvasElement.height,
      style.size || 3,
      0,
      2 * Math.PI
    );
    context.fill();
  });
}

function drawConnectors(context, landmarks, connections, style = {}) {
  context.strokeStyle = style.color || "white";
  context.lineWidth = style.lineWidth || 2;
  connections.forEach(([startIdx, endIdx]) => {
    const start = landmarks[startIdx];
    const end = landmarks[endIdx];
    context.beginPath();
    context.moveTo(
      start.x * canvasElement.width,
      start.y * canvasElement.height
    );
    context.lineTo(end.x * canvasElement.width, end.y * canvasElement.height);
    context.stroke();
  });
}
