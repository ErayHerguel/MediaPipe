const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

const progressBar = document.getElementById("progress_bar");
const angleDisplay = document.getElementById("angle_display");
const repetitionsDisplay = document.getElementById("repetitions_display");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;

      const pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onResults);

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

    angleDisplay.innerText = `Winkel: ${angle.toFixed(2)}°`;
    checkRepetition(angle);
    repetitionsDisplay.innerText = `Wiederholungen: ${repetitions}`;

    const userInFrame = checkUserInFrame(results.poseLandmarks);
    displayMessage(!userInFrame);

    updateProgressBar(angle);
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

document.getElementById("message").style.display = "block";

function checkUserInFrame(poseLandmarks) {
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

function displayMessage(show) {
  const messageElement = document.getElementById("message");
  if (show) {
    messageElement.style.display = "block";
  } else {
    messageElement.style.display = "none";
  }
}

function updateProgressBar(angle) {
  const minAngle = 100;
  const maxAngle = 180;
  const progressPercentage = ((angle - minAngle) / (maxAngle - minAngle)) * 100;
  const boundedProgress = Math.max(0, Math.min(progressPercentage, 100));

  progressBar.style.width = `${boundedProgress}%`;
}
