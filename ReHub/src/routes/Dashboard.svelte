<script>
  import { goto } from "$app/navigation";
  import { exerciseStore } from "../lib/exerciseStore";

  function openExercise(exercise) {
    exerciseStore.set(exercise); // Set the exercise data in the store
    goto("/exercise"); // Navigate to the exercise page
  }
</script>

<div class="container">
  <div class="header">
    <img
      src="/Rehub.svg"
      alt="Logo"
      style="height: 48px; margin-bottom: 12px; margin-top: 60px; margin-left: 16px;"
    />
    <div>
      <!-- Add any header icons here -->
    </div>
  </div>
  <div class="date-switcher-container">
    <div class="date-switcher">
      <button class="inactive">Gestern</button>
      <button class="active">Heute</button>
      <button class="inactive">Morgen</button>
    </div>
  </div>
  <div class="title">Anstehend</div>
  <div class="task-list">
    <div
      class="task"
      on:click={() =>
        openExercise({
          title: "Beinstrecker",
          gif: "/path/to/gif.gif",
          instructions:
            "Setzen Sie sich aufrecht hin und strecken Sie Ihr Bein bis zum Schmerzpunkt nach vorne aus",
          sets: 3,
          reps: 12,
        })}
    >
      <div class="exercise-info">
        <img
          src="/Beinstrecker.png"
          alt="Beinstrecker"
          class="exercise-image"
        />
        <div>
          <p>Beinstrecker</p>
          <p><span>12 x 3 Wiederholungen</span></p>
          <p><span>anstehend</span></p>
        </div>
      </div>
      <div>
        <img
          src="/SF_Play.svg"
          alt="Play Button"
          style="width: 60%; height: 60%;"
        />
      </div>
    </div>
    <hr class="trennstrich" />
    <div
      class="task"
      on:click={() =>
        openExercise({
          title: "Squads",
          gif: "/path/to/gif.gif",
          instructions:
            "Machen Sie Kniebeugen mit geradem Rücken und parallelen Füßen",
          sets: 3,
          reps: 12,
        })}
    >
      <div class="exercise-info">
        <img src="/Squats.png" alt="Squads" class="exercise-image" />
        <div>
          <p>Squads</p>
          <p><span>12 x 3 Wiederholungen</span></p>
          <p><span>Nachmittag</span></p>
        </div>
      </div>
      <div>
        <img
          src="/SF_Play.svg"
          alt="Play Button"
          style="width: 60%; height: 60%;"
        />
      </div>
    </div>
    <hr class="trennstrich" />
    <div
      class="task"
      on:click={() =>
        openExercise({
          title: "Spazieren gehen",
          gif: "/path/to/gif.gif",
          instructions: "Gehen Sie für 20 Minuten in einem angenehmen Tempo",
          duration: 20,
        })}
    >
      <div class="exercise-info">
        <img
          src="/Spazieren.png"
          alt="Spazieren gehen"
          class="exercise-image"
        />
        <div>
          <p>Spazieren gehen</p>
          <p><span>20 Minuten lang</span></p>
          <p><span>Abend</span></p>
        </div>
      </div>
      <div>
        <img
          src="/SF_Play.svg"
          alt="Play Button"
          style="width: 60%; height: 60%;"
        />
      </div>
    </div>
  </div>
  <div class="title">Erledigt</div>
  <div class="task-list">
    <p class="no-task-title">Noch keine Übungen erledigt!</p>
    <p class="no-task-subtitle">
      <span>Fang jetzt mit deiner ersten Übung heute an</span>
    </p>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* Ensure that padding and border are included in the element's total width and height */
  }

  body {
    overflow-x: hidden; /* Prevent horizontal scrolling */
  }

  .container {
    width: 100%; /* Ensure it takes full width of the viewport */
    max-width: 390px; /* Set to iPhone 12 viewport width */
    background: #fafffe;
    padding: 0; /* Adjust padding to remove left and right margins */
    box-sizing: border-box;
    margin-top: 1.4em;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -120px;
  }
  .header-text {
    font-size: 36px; /* Adjust font size for smaller screens */
    color: var(--Akzentfarbe, #343434);
    font-family: "SF Pro", sans-serif;
    font-weight: 590;
    line-height: normal;
  }
  .date-switcher-container {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px; /* Optional, to ensure space for scrollbar */
    margin-bottom: 2em;
  }
  .date-switcher {
    margin-top: 20px;
    margin-bottom: 8px;
    display: inline-flex;
    gap: 20px; /* Adjust gap for smaller screens */
    padding: 0 16px; /* Ensure padding within the container */
  }
  .date-switcher button {
    display: flex;
    width: 140px;
    height: 40px;
    padding: 4px 20px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    font-family: "SF Pro", sans-serif;
    font-weight: 590;
    line-height: normal;
    border-radius: 100px;
    background: var(--Akzentfarbe, #00e6bd);
    color: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
  }
  .date-switcher button.active {
    background: #00e6bd;
    color: white;
    font-size: 16px;
  }
  .date-switcher button.inactive {
    background: #f6f6f6;
    color: #343434;
    font-size: 16px;
  }
  .task-list {
    width: calc(100% - 24px); /* Adjust width to fit within the container */
    padding: 12px;
    background: #ffffff;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .task {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; /* Make task full width */
    margin-bottom: 12px; /* Add margin to create space between tasks */
    cursor: pointer;
  }
  .task:last-child {
    margin-bottom: 0; /* Remove margin from the last task */
  }
  .task p {
    margin: 0;
  }
  .task span {
    color: #343434;
  }
  .exercise-info {
    display: flex;
    align-items: center;
  }
  .exercise-image {
    max-width: 60px;
    max-height: 60px;
    margin-right: 1rem;
  }
  .no-task-title {
    color: var(--Akzentfarbe, #999999);
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 16px;
    margin-bottom: 20px;
  }
  .no-task-subtitle {
    color: var(--Akzentfarbe, #999999);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 0%;
    margin-bottom: 28px;
  }

  .title {
    margin-left: 20px;
    margin-top: 12px;
    margin-bottom: 8px;
    color: var(--Schwarz, #343434);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  @media (max-width: 390px) {
    .header-text {
      font-size: 24px; /* Adjust the size for smaller screens */
    }
    .date-switcher {
      width: auto;
      padding: 8px 10px;
    }
    .date-switcher button {
      padding: 8px 10px;
      font-size: 14px;
    }
    .task {
      padding: 10px;
    }
  }

  .trennstrich {
    width: 300px;
    height: 2px;
    border: none;
    margin-left: auto;
    margin-right: auto;
    background-color: #e0e0e0;
  }
</style>
