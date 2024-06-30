<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AppBar from '../../lib/AppBar.svelte'; // Assuming you have the AppBar component

  // You can keep other necessary imports or logic here
</script>

<div class="container">
  <div class="header">
    <img src="/Rehub.svg" alt="Logo" style="height: 48px; margin-bottom: 12px; margin-top: 60px; margin-left: 16px;" />
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
  <div class="title">Beinstrecker</div>
  <div class="stats-image">
    <img src="/stats.svg" alt="Stats" />
  </div>
</div>
<div class="title">Erledigt</div>
  <div class="task-list">
    <p class="no-task-title">Noch keine Übungen erledigt</p>
  </div>

<AppBar currentPage="stats" />

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
  }

  .container {
    width: 100%;
    max-width: 390px;
    background: #fafffe;
    padding: 0;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .header-text {
    font-size: 36px;
    color: var(--Akzentfarbe, #343434);
    font-family: "SF Pro", sans-serif;
    font-weight: 590;
    line-height: normal;
  }
  .header-text {
    font-size: 36px;
    color: var(--Akzentfarbe, #343434);
    font-family: "SF Pro", sans-serif;
    font-weight: 590;
    line-height: normal;
  }
  .date-switcher-container {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px;
  }
  .date-switcher {
    margin-top: 20px;
    margin-bottom: 8px;
    display: inline-flex;
    gap: 20px;
    padding: 0 16px;
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
    font-family: "SF Pro", sans-serif;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .title {
    margin-left: 20px;
    margin-top: 12px;
    margin-bottom: 8px;
    color: var(--Schwarz, #343434);
    font-size: 16px;
    font-family: "SF Pro", sans-serif;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  .stats-image {
    text-align: center;
    margin-top: 20px;
  }
  .stats-image img {
    max-width: 100%;
    height: auto;
  }
  .task {
    padding: 10px;
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
  
</style>
