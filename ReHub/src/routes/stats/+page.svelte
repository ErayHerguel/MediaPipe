<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AppBar from '../../lib/AppBar.svelte';
</script>

<div class="container">
  <div class="header">
    <img src="/Rehub.svg" alt="Logo" style="height: 48px; margin-bottom: 12px; margin-top: 60px; margin-left: 16px;" />
    <div>
    </div>
  </div>
  <div class="date-switcher-container">
    <div class="date-switcher">
      <button class="inactive">Gestern</button>
      <button class="active">Heute</button>
      <button class="inactive">Morgen</button>
    </div>
  </div>
  <div class="exercise">
  <div class="title">Beinstrecker</div>
  <div class="skip-l">&lt;</div>
  <div class="sets">Satz 1</div>
  <div class="skip-r">&gt;</div>
  </div>
  <div class="stats-image">
    <img src="/stats.svg" alt="Stats" />
  </div>
</div>
<div class="points">
    <div class="one"></div>
    <div class="two"></div>
    <div class="three"></div>
</div>
  <div class="task-list">
    <p class="no-task-title">Keine weiteren Übungen erledigt</p>
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
  .date-switcher-container {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px; /* Optional, to ensure space for scrollbar */
    margin-bottom: 2em;
    margin-top: 1px;
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
  .points {
    display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2em;
  }
  .one {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 100px;
    background: var(--Rehub, #00E6BD);
    margin-right: 1.5em;
  }
  .two {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 100px;
    background: var(--Rehub, #999);
    margin-right: 1.5em;
  }
  .three {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 100px;
    background: var(--Rehub, #999);
  }
  .task-list {
    width: calc(100% - 24px);
    padding: 1em;
    background: #ffffff;
    font-family: "SF Pro", sans-serif;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  .exercise {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px; 
}

.title {
  margin: 0em 20px;
  color: var(--Schwarz, #343434);
  font-size: 16px;
  font-family: "SF Pro", sans-serif;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.skip-l {
  display: flex;
  align-items: center;
  color: var(--Schwarz, #343434);
  font-family: "SF Pro";
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  padding-bottom: 1px;
  margin-left: 5.5em;
}
.skip-r {
  display: flex;
  align-items: center;
  color: var(--Schwarz, #343434);
  font-family: "SF Pro";
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  padding-bottom: 1px;
  margin-right: 0.5em;
}
.sets {
  color: var(--Schwarz, #343434);
  margin: 0 0px;
  font-size: 16px;
  font-family: "SF Pro", sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
  .stats-image {
    text-align: center;
    margin-top: 0px;
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
    width: 100%; 
    margin-bottom: 12px;
    cursor: pointer;
  }
  .task:last-child {
    margin-bottom: 0;
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
