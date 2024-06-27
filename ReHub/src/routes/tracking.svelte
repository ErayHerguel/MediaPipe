<script lang="ts">
  import { onMount } from "svelte";
  import posePkg from "@mediapipe/pose";
  import cameraPkg from "@mediapipe/camera_utils";
  import { writable } from "svelte/store";

  const { Pose, POSE_CONNECTIONS } = posePkg;
  const { Camera } = cameraPkg;

  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;
  let canvasCtx: CanvasRenderingContext2D;

  let progressBar: HTMLDivElement;
  let angleDisplay: HTMLDivElement;
  let repetitionsDisplay: HTMLDivElement;
  let messageElement: HTMLDivElement;

  let lastAngle = 0;
  let lastUpdateTime = 0;
  let debounceTime = 1000;
  let repetitions = 0;
  let isMovingToStart = false;

  let userInstruction = writable(
    "Bitte setzen Sie sich so hin, dass die Kamera Ihren ganzen Körper erkennen kann.",
  );
  let activeIcon = writable("mute"); // Store for active icon

  onMount(() => {
    videoElement = document.getElementById("input_video") as HTMLVideoElement;
    canvasElement = document.getElementById(
      "output_canvas",
    ) as HTMLCanvasElement;
    canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;

    progressBar = document.getElementById("progress_bar") as HTMLDivElement;
    angleDisplay = document.getElementById("angle_display") as HTMLDivElement;
    repetitionsDisplay = document.getElementById(
      "repetitions_display",
    ) as HTMLDivElement;
    messageElement = document.getElementById("message") as HTMLDivElement;

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
  });

  function onResults(results: any) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height,
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
      if (!userInFrame) {
        updateInstruction(getInstruction(results.poseLandmarks));
      } else {
        updateInstruction("Jetzt kann die Kamera Sie sehen.");
      }

      updateProgressBar(angle);
    }
    canvasCtx.restore();
  }

  function calculateAngle(hip: any, knee: any, ankle: any) {
    if (
      hip.visibility < 0.6 ||
      knee.visibility < 0.6 ||
      ankle.visibility < 0.6
    ) {
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

  function checkRepetition(angle: number) {
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

  function drawLandmarks(
    context: CanvasRenderingContext2D,
    landmarks: any[],
    style: any = {},
  ) {
    context.fillStyle = style.color || "white";
    landmarks.forEach((landmark) => {
      context.beginPath();
      context.arc(
        landmark.x * canvasElement.width,
        landmark.y * canvasElement.height,
        style.size || 3,
        0,
        2 * Math.PI,
      );
      context.fill();
    });
  }

  function drawConnectors(
    context: CanvasRenderingContext2D,
    landmarks: any[],
    connections: any[],
    style: any = {},
  ) {
    context.strokeStyle = style.color || "white";
    context.lineWidth = style.lineWidth || 2;
    connections.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      context.beginPath();
      context.moveTo(
        start.x * canvasElement.width,
        start.y * canvasElement.height,
      );
      context.lineTo(end.x * canvasElement.width, end.y * canvasElement.height);
      context.stroke();
    });
  }

  function checkUserInFrame(poseLandmarks: any[]) {
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

  function getInstruction(poseLandmarks: any[]) {
    const instructions: string[] = [];
    const visibilityThreshold = 0.5;

    const checkVisibility = (
      index: number,
      name: string,
      direction: string,
    ) => {
      if (poseLandmarks[index].visibility < visibilityThreshold) {
        instructions.push(
          `Bitte ${direction}, um die ${name} sichtbar zu machen.`,
        );
      }
    };

    checkVisibility(0, "Nase", "weiter nach hinten");
    checkVisibility(11, "linke Schulter", "weiter nach rechts");
    checkVisibility(12, "rechte Schulter", "weiter nach links");
    checkVisibility(23, "linke Hüfte", "weiter nach rechts");
    checkVisibility(24, "rechte Hüfte", "weiter nach links");

    if (instructions.length === 0) {
      return "Bitte setzen Sie sich so hin, dass die Kamera Ihren ganzen Körper erkennen kann.";
    }

    return instructions.join(" ");
  }

  function updateInstruction(instruction) {
    userInstruction.set(instruction);
    activeIcon.subscribe((value) => {
      if (value === "mute") {
        // Do nothing
      } else if (value === "medium") {
        playInstruction("/static/signal.mp3");
      } else if (value === "high") {
        playInstruction("/static/Anweisung.mp3");
      }
    });
  }

  function updateProgressBar(angle: number) {
    const minAngle = 100;
    const maxAngle = 180;
    const progressPercentage =
      ((angle - minAngle) / (maxAngle - minAngle)) * 100;
    const boundedProgress = Math.max(0, Math.min(progressPercentage, 100));

    progressBar.style.width = `${boundedProgress}%`;
  }

  function playInstruction(audioFile) {
    let audio = new Audio(audioFile);
    audio.play();
  }
</script>

<main>
  <div class="instruction-container">
    <p class="instruction-text">{$userInstruction}</p>
    <div class="icon-container">
      <img
        src="/Mute.svg"
        alt="Mute"
        class:active={$activeIcon === "mute"}
        on:click={() => activeIcon.set("mute")}
      />
      <img
        src="/Signal.svg"
        alt="Medium Volume"
        class:active={$activeIcon === "medium"}
        on:click={() => activeIcon.set("medium")}
      />
      <img
        src="/Loud.svg"
        alt="High Volume"
        class:active={$activeIcon === "high"}
        on:click={() => activeIcon.set("high")}
      />
    </div>
  </div>
  <div id="loading">Loading...</div>
  <video
    id="input_video"
    width="640"
    height="480"
    autoplay
    muted
    loop
    playsinline
    style="display: none;"
  ></video>
  <canvas id="output_canvas" width="640" height="480" style="display: none;"
  ></canvas>
  <div class="info-container">
    <div id="angle_display" class="info-box">Winkel: 0.00°</div>
    <div id="repetitions_display" class="info-box">Wiederholungen: 0</div>
  </div>
  <div id="progress_container">
    <div id="progress_bar"></div>
  </div>
  <div id="message" class="info-box">
    Bitte setzen Sie sich so hin, dass die Kamera Ihren ganzen Körper erkennen
    kann.
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #fafffe;
  }

  .instruction-container {
    display: flex;
    flex-direction: column;
    width: 350px;
    padding: 20px;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    background: var(--Wei, #fff);
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .instruction-text {
    text-align: center;
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  .icon-container {
    display: flex;
    gap: 30px;
  }

  .icon-container img {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  .icon-container img.active {
    filter: brightness(0) saturate(100%) invert(47%) sepia(78%) saturate(1007%)
      hue-rotate(116deg) brightness(101%) contrast(89%);
  }

  video,
  canvas {
    width: 100%;
    max-width: 640px;
    height: auto;
  }

  .info-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 640px;
    margin-top: 10px;
  }

  .info-box {
    background-color: #ffffff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-size: 1.2em;
    color: #006b58;
    width: 48%;
  }

  #progress_container {
    width: 100%;
    max-width: 640px;
    background-color: #eee;
    margin-top: 10px;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
  }

  #progress_bar {
    width: 0;
    height: 100%;
    background-color: #00c896;
  }
</style>
