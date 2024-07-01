<script>
  import { onMount } from "svelte";
  import { exerciseStore } from "../lib/exerciseStore";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  let exercise = { title: "", gif: "", instructions: "", sets: 0, reps: 0 };

  onMount(() => {
    const storedExercise = get(exerciseStore);
    if (storedExercise) {
      exercise = storedExercise;
    } else {
      // Set a default gif if none is provided
      exercise.gif = "/exercise.gif";
    }
  });

  function goBack() {
    goto("/"); // navigate back to the dashboard
  }

  async function startExercise() {
    try {
      // Create a silent audio to trigger user interaction permission
      const audio = new Audio("/Signal.mp3");
      await audio.play();
      audio.pause();
      audio.currentTime = 0;

      goto("/tracking"); // navigate to the tracking page
    } catch (error) {
      console.error("Audio permission error:", error);
      alert("Bitte erlauben Sie die Audiowiedergabe, um fortzufahren.");
    }
  }
</script>

<div class="exercise-container">
  <div class="header" on:click={goBack}>
    <img src="/Back.svg" alt="Back" style="height: 20px" />
    <h1>{exercise.title}</h1>
  </div>

  <div class="title">Anleitung</div>
  <div class="content-block">
    <img src={"/exercise.gif"} alt={exercise.title} />
    <p>{exercise.instructions}</p>
  </div>

  <div class="title">Details</div>
  <div class="details">
    <div>
      <p>Sätze</p>
      <p>{exercise.sets}</p>
    </div>
    <div>
      <p>Wiederholungen</p>
      <p>{exercise.reps}</p>
    </div>
  </div>

  <div class="start-button">
    <button
      on:click={() => {
        // Direct user interaction to play audio
        const audio = new Audio("/Signal.mp3");
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            startExercise();
          })
          .catch((error) => {
            console.error("Audio play failed:", error);
            alert("Bitte erlauben Sie die Audiowiedergabe, um fortzufahren.");
          });
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      Übung starten
    </button>
  </div>
</div>

<style>
  .exercise-container {
    padding: 16px;
    background: #fafffe;
    max-width: 390px;
    margin: 0 auto;
    font-family: "SF Pro", sans-serif;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .header img {
    cursor: pointer;
    margin-right: 16px;
  }

  .header h1 {
    font-size: 24px;
    color: #343434;
  }

  .title {
    margin-left: 8px;
    margin-top: 12px;
    margin-bottom: 8px;
    color: #343434;
    font-size: 16px;
    font-weight: 700;
  }

  .content-block {
    text-align: center;
    margin-bottom: 16px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden; /* Ensure that the content stays within the rounded borders */
  }

  .content-block img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    object-fit: cover; /* Crop the image to fit the container */
    object-position: center; /* Center the image */
    clip-path: inset(
      20% 20% 10% 10%
    ); /* Adjust these values to crop white space */
  }

  .content-block p {
    font-size: 16px;
    color: #333;
  }

  .details {
    background: #ffffff;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-around;
  }

  .details div {
    text-align: center;
  }

  .details p {
    margin: 0;
    font-size: 16px;
  }

  .start-button {
    display: flex;
    justify-content: center;
  }

  .start-button button {
    background: #006b58;
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    font-weight: 600;
  }

  .start-button button svg {
    width: 16px;
    height: 16px;
    fill: white;
  }
</style>