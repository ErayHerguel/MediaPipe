<script lang="ts">
  import { onMount } from "svelte";
  import posePkg from "@mediapipe/pose";
  import cameraPkg from "@mediapipe/camera_utils";
  import { writable, get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { exerciseStore, addRepDataToSet } from "../lib/exerciseStore";

  const { Pose, POSE_CONNECTIONS } = posePkg;
  const { Camera } = cameraPkg;

  let videoElement: HTMLVideoElement;
  let canvasElement: HTMLCanvasElement;
  let canvasCtx: CanvasRenderingContext2D;

  let repetitionsDisplay: HTMLDivElement;

  let lastAngle = 0;
  let lastUpdateTime = 0;
  let debounceTime = 1000;
  let repetitions = 0;
  let isMovingToStart = false;
  let currentSet = 1;
  const totalSets = 3;
  const totalReps = 12;
  let bodyDetected = false;

  let userInstruction = writable(
    "Setzen Sie sich so hin, dass die Kamera Ihren ganzen Körper erkennen kann."
  );
  let activeIcon = writable("high");

  const sounds = {
    Anweisung_1: "/Anweisung_1.mp3",
    Anweisung_2: "/Anweisung_2.mp3",
    Anweisung_Hinten: "/Anweisung_Hinten.mp3",
    Anweisung_Links: "/Anweisung_Links.mp3",
    Anweisung_Rechts: "/Anweisung_Rechts.mp3",
    Anweisung_Vorne: "/Anweisung_Vorne.mp3",
    completion: "/completion.mp3",
    pause: "/pause.mp3",
    signal: "/Signal.mp3",
  };

  function enqueueInstruction(text: string, soundKey: string) {
    userInstruction.set(text);
    const volume = get(activeIcon);

    if (volume === "mute") {
      return;
    }

    const audioFile = volume === "medium" ? sounds["signal"] : sounds[soundKey];
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.play();
    }
  }

  onMount(() => {
    videoElement = document.getElementById("input_video") as HTMLVideoElement;
    canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement;
    canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;

    repetitionsDisplay = document.getElementById(
      "repetitions_display"
    ) as HTMLDivElement;

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

          enqueueInstruction(
            "Setzen Sie sich so hin, dass die Kamera Ihren ganzen Körper erkennen kann.",
            "Anweisung_1"
          );
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

      if (
        hip.visibility > 0.6 &&
        knee.visibility > 0.6 &&
        ankle.visibility > 0.6 &&
        !bodyDetected
      ) {
        bodyDetected = true;
        enqueueInstruction("Super, wir können starten.", "Anweisung_2");
      } else if (
        hip.visibility <= 0.6 ||
        knee.visibility <= 0.6 ||
        ankle.visibility <= 0.6
      ) {
        bodyDetected = false;
      }

      const angle = calculateAngle(hip, knee, ankle);
      checkRepetition(angle);
      updateProgressBar(angle);
    } else {
      bodyDetected = false;
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

  let isPauseSoundPlaying = false;

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

      addRepDataToSet(0, currentSet - 1, angle);

      if (repetitions >= totalReps) {
        repetitions = 0;
        currentSet++;
        if (currentSet > totalSets) {
          enqueueInstruction("Übung abgeschlossen!", "completion");
          goto("/finished");
        } else {
          if (!isPauseSoundPlaying) {
            isPauseSoundPlaying = true;
            const audio = new Audio(sounds["pause"]);
            audio.play();
            audio.onended = () => {
              isPauseSoundPlaying = false;
              enqueueInstruction(
                `Satz ${currentSet} abgeschlossen!`,
                "Anweisung_2"
              );
            };
          }
        }
      }
    }
    lastAngle = angle;
  }

  function drawLandmarks(
    context: CanvasRenderingContext2D,
    landmarks: any[],
    style: any = {}
  ) {
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

  function drawConnectors(
    context: CanvasRenderingContext2D,
    landmarks: any[],
    connections: any[],
    style: any = {}
  ) {
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

  function updateProgressBar(angle: number) {
    const minAngle = 90;
    const maxAngle = 180;
    const progressPercentage =
      ((angle - minAngle) / (maxAngle - minAngle)) * 100;
    const boundedProgress = Math.max(0, Math.min(progressPercentage, 100));

    repetitionsDisplay.style.height = `${boundedProgress}%`;
  }

  function cancelExercise() {
    goto("/exercise");
  }
</script>

<main>
  <div class="instruction-container">
    <p class="instruction-text">{$userInstruction}</p>
    <div class="icon-container">
      <button
        type="button"
        aria-label="Mute"
        class:active={$activeIcon === "mute"}
        on:click={() => activeIcon.set("mute")}
        class:highlight={$activeIcon === "mute"}
      >
        <img src="/Mute.svg" alt="Mute" style="width: 25px; height: 25px;" />
      </button>
      <button
        type="button"
        aria-label="Medium Volume"
        class:active={$activeIcon === "medium"}
        on:click={() => activeIcon.set("medium")}
        class:highlight={$activeIcon === "medium"}
      >
        <img
          src="/Signal.svg"
          alt="Medium Volume"
          style="width: 28px; height: 28px;"
        />
      </button>
      <button
        type="button"
        aria-label="High Volume"
        class:active={$activeIcon === "high"}
        on:click={() => activeIcon.set("high")}
        class:highlight={$activeIcon === "high"}
      >
        <img
          src="/Loud.svg"
          alt="High Volume"
          style="width: 30px; height: 30px;"
        />
      </button>
    </div>
  </div>

  <div class="set-rep-display">
    <div class="set-rep-progress" id="repetitions_display"></div>

    <div class="set-rep-text">
      <p>Set {currentSet}</p>
      <p>Reps {repetitions}</p>
    </div>
  </div>

  <div class="button-container">
    <button class="button cancel-button" on:click={cancelExercise}
      >Abbruch</button
    >
  </div>

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
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    margin: 0;
    font-family: "SF Pro", sans-serif;
    background-color: #fafffe;
    padding: 1em;
    box-sizing: border-box;
  }

  .instruction-container {
    position: absolute;
    top: 1em;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    width: 20em;
    padding: 20px;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    z-index: 3;
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

  .icon-container button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .icon-container img.active {
    filter: brightness(0) saturate(100%) invert(47%) sepia(78%) saturate(1007%)
      hue-rotate(116deg) brightness(101%) contrast(89%);
  }

  .highlight {
    filter: brightness(0) saturate(100%) invert(47%) sepia(78%) saturate(1007%)
      hue-rotate(116deg) brightness(101%) contrast(89%);
  }

  .set-rep-display {
    width: 19.5em;
    min-height: 350px;
    position: relative;
    margin-top: 14em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 20px;
    z-index: 2;
  }

  .set-rep-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #00c896;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .set-rep-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: #000000;
    font-size: 4em;
    font-weight: bold;
    z-index: 2;
  }

  .set-rep-text p {
    margin: 0;
    line-height: normal;
  }

  .button-container {
    position: absolute;
    bottom: 2em;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    width: 350px;
    gap: 20px;
    justify-content: center;
    align-items: center;
    z-index: 3;
  }

  .button {
    display: flex;
    width: 22em;
    height: 46px;
    padding: 8px 144px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 100px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    font-family: "SF Pro", sans-serif;
    font-size: 1em;
    font-weight: bold;
    text-transform: uppercase;
    color: #343434;
  }

  .cancel-button {
    background-color: #ffffff;
    color: #d04121;
    border: 2px solid #d04121;
  }

  #input_video,
  #output_canvas {
    display: none;
  }
</style>
