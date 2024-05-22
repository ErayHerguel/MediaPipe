const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

let gyroData = { x: 0, y: 0, z: 0 };  // Speichert die Gyroskopdaten

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

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();

function connectToMQTT() {
    const client = mqtt.connect('wss://BROKER_ADRESSE:PORT', {
        clientId: 'webClient'
    });

    client.on('connect', function () {
        console.log("Connected to MQTT Broker!");
        client.subscribe('sensor/gyro');
    });

    client.on('message', function (topic, message) {
        [gyroData.x, gyroData.y, gyroData.z] = message.toString().split(',').map(Number);
        console.log("Received gyro data:", gyroData);
    });
}

let repetitions = 0; // Variable für die Anzahl der Wiederholungen
let lastAngle = 180; // Letzter gemessener Winkel
let isMovingToStart = false; // Zustand der Bewegung zur Ausgangsposition

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

    checkRepetition(angle); // Wiederholung prüfen und zählen
    canvasCtx.fillText("Wiederholungen: " + repetitions, 10, 70); // Wiederholungen anzeigen
  }
  canvasCtx.restore();
}

function calculateAngle(hip, knee, ankle) {
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
  const startAngle = 160; // Startwinkel für eine Bewegung
  const endAngle = 180; // Endwinkel für die Bewegung
  let progress = 0;

  // Berechne den Fortschritt basierend auf dem aktuellen Winkel
  if (angle >= startAngle && angle <= endAngle) {
      progress = ((angle - startAngle) / (endAngle - startAngle)) * 100;
  } else if (angle > endAngle) {
      progress = 100;
  }

  // Update der Fortschrittsbalken-Breite
  document.getElementById('progress_bar').style.width = `${progress}%`;

  // Überprüfe, ob die vollständige Bewegung ausgeführt wurde
  if (angle > startAngle && lastAngle <= startAngle) {
      isMovingToStart = true;
  }
  if (angle <= startAngle && lastAngle > startAngle && isMovingToStart) {
      repetitions++;
      isMovingToStart = false;
      document.getElementById('progress_bar').style.width = `0%`; // Setze den Balken zurück
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
    context.lineTo(
      end.x * canvasElement.width,
      end.y * canvasElement.height
    );
    context.stroke();
  });
}
