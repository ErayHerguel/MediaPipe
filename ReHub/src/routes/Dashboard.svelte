<script>
  import { goto } from '$app/navigation';
  import { exerciseStore } from '../lib/exerciseStore';

  function openExercise() {
    const exercise = {
      title: 'Beinstrecker',
      gif: '/path/to/gif.gif',
      instructions: 'Setzen Sie sich aufrecht hin und strecken Sie Ihr Bein bis zum Schmerzpunkt nach vorne aus',
      sets: 3,
      reps: 12
    };

    exerciseStore.set(exercise); // Set the exercise data in the store
    goto('/exercise'); // Navigate to the exercise page
  }
</script>

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
    background: #FAFFFE;
    padding: 0; /* Adjust padding to remove left and right margins */
    box-sizing: border-box;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -120px;
  }
  .header-text {
    font-size: 36px; /* Adjust font size for smaller screens */
    color: var(--Akzentfarbe, #006B58);
    font-family: 'SF Pro', sans-serif;
    font-weight: 590;
    line-height: normal;
  }
  .date-switcher-container {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px; /* Optional, to ensure space for scrollbar */
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
    font-family: 'SF Pro', sans-serif;
    font-weight: 590;
    line-height: normal;
    border-radius: 100px;
    background: var(--Akzentfarbe, #006B58);
    color: #FFF;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.10);
    border: none;
    cursor: pointer;
  }
  .date-switcher button.active {
    background: #006B58;
    color: white;
    font-size: 16px;
  }
  .date-switcher button.inactive {
    background: #F6F6F6;
    color: #006858;
    font-size: 16px;
  }
  .task-list {
    width: calc(100% - 24px); /* Adjust width to fit within the container */
    padding: 12px;
    background: #FFFFFF;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
    border-radius: 20px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .task {
    border-radius: 10px;
    background: #F6F6F6;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.10);
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
    color: #006858;
  }
  .no-task-title {
    color: var(--Akzentfarbe, #006B58);
    text-align: center;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-top: 16px;
    margin-bottom: 20px;
  }
  .no-task-subtitle {
    color: var(--Akzentfarbe, #006B58);
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
</style>

<div class="container">
  <div class="header">
    <h1 class="header-text">Willkommen zurück!</h1>
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
  <div class="title">
    Anstehend
  </div>
  <div class="task-list">
    <div class="task" on:click={openExercise}>
      <div>
        <p>Beinstrecker</p>
        <p><span>12 x 3 Wiederholungen</span></p>
        <p><span>anstehend</span></p>
      </div>
      <div>
        <img src="/SF_Play.svg" alt="Play Button" style="width: 60%; height: 60%;">
      </div>
    </div>
    <div class="task">
      <div>
        <p>Suads</p>
        <p><span>12 x 3 Wiederholungen</span></p>
        <p><span>Nachmittag</span></p>
      </div>
      <div>
        <img src="/SF_Play.svg" alt="Play Button" style="width: 60%; height: 60%;">
      </div>
    </div>
    <div class="task">
      <div>
        <p>Spazieren gehen</p>
        <p><span>20 Minuten lang</span></p>
        <p><span>Abend</span></p>
      </div>
      <div>
        <img src="/SF_Play.svg" alt="Play Button" style="width: 60%; height: 60%;">
      </div>
    </div>
  </div>
  <div class="title">
    Erledigt
  </div>
  <div class="task-list">
    <p class="no-task-title">Noch keine Übungen erledigt!</p>
    <p class="no-task-subtitle"><span>Fang jetzt mit deiner ersten Übung heute an</span></p>
  </div>
</div>