const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Laden der MediaPipe Pose Bibliothek
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

// Konfigurieren der Pose-Erkennungsoptionen
pose.setOptions({
    modelComplexity: 2,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Verbinden der Ergebnisfunktion mit der Pose-Erkennung
pose.onResults(onResults);

// Videoquelle für die Kamera-Konfiguration
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks,
                      {color: '#FF0000', lineWidth: 2});

        // Berechnen und Überprüfen des Winkels
        const hip = results.poseLandmarks[23]; 
        const knee = results.poseLandmarks[25]; 
        const ankle = results.poseLandmarks[27]; 
        const angle = calculateAngle(hip, knee, ankle);
        checkRepetition(angle);

        // Anzeigen der Wiederholungen
        canvasCtx.font = '16px Arial';
        canvasCtx.fillStyle = 'red';
        canvasCtx.fillText('Wiederholungen: ' + repetitions, 10, 50);
    }
    canvasCtx.restore();
}


// Berechnung des Winkels zwischen drei Punkten
function calculateAngle(hip, knee, ankle) {
    const radians = Math.atan2(ankle.y - knee.y, ankle.x - knee.x) - Math.atan2(hip.y - knee.y, hip.x - knee.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}

// Zustandsvariablen für die Wiederholungszählung
let lastAngle = 180; // Startwinkel
let repetitions = 0;
let isMovingToStart = false;

// Überprüfung und Aktualisierung der Wiederholungszählung
function checkRepetition(angle) {
    if (angle > 90 && lastAngle <= 90) {
        isMovingToStart = true;
    }
    if (angle <= 90 && lastAngle > 90 && isMovingToStart) {
        repetitions++;
        isMovingToStart = false;
    }
    lastAngle = angle;
}

// Funktionen zum Zeichnen der Landmarks und Verbindungen
function drawLandmarks(context, landmarks, style = {}) {
    const {color = 'white', size = 3} = style;
    for (const landmark of landmarks) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height,
                    size, 0, 2 * Math.PI);
        context.fill();
    }
}

function drawConnectors(context, landmarks, connections, style = {}) {
    const {color = 'white', lineWidth = 2} = style;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    
    for (const [startIdx, endIdx] of connections) {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        context.beginPath();
        context.moveTo(start.x * canvasElement.width, start.y * canvasElement.height);
        context.lineTo(end.x * canvasElement.width, end.y * canvasElement.height);
        context.stroke();
    }
}
