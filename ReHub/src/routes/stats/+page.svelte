<script>
  import { onMount } from 'svelte';
  import { exerciseStore } from '../../lib/exerciseStore';
  import { Line } from 'svelte-chartjs';
  import { Chart, registerables } from 'chart.js';
  import AppBar from '../../lib/AppBar.svelte';

  Chart.register(...registerables);

  let exerciseData = [];
  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Winkel pro Wiederholung',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  let currentSetIndex = 0;
  let currentSet = {};

  onMount(() => {
    exerciseStore.subscribe(data => {
      exerciseData = data;
      if (exerciseData.length > 0) {
        currentSet = exerciseData[0].sets[currentSetIndex];
        updateChartData();
      }
    });
  });

  function updateChartData() {
    if (currentSet.repsData.length > 0) {
      chartData.labels = currentSet.repsData.map((_, i) => `Rep ${i + 1}`);
      chartData.datasets[0].data = currentSet.repsData;
    }
  }

  function nextSet() {
    if (currentSetIndex < exerciseData[0].sets.length - 1) {
      currentSetIndex++;
      currentSet = exerciseData[0].sets[currentSetIndex];
      updateChartData();
    }
  }

  function previousSet() {
    if (currentSetIndex > 0) {
      currentSetIndex--;
      currentSet = exerciseData[0].sets[currentSetIndex];
      updateChartData();
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'SF Pro', sans-serif;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 10px;
  }

  .header img {
    height: 48px;
    margin-bottom: 12px;
  }

  .date-switcher-container {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px;
    width: 110%;
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

  .chart-container {
    width: 100%;
    max-width: 390px;
    margin-top: 20px;
  }

  .chart-container h2 {
    font-size: 16px;
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

  .task-list {
    width: 100%;
    padding: 12px;
    background: #ffffff;
    box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin-bottom: 20px;
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

<div class="container">
  <div class="header">
    <img src="/Rehub.svg" alt="Logo" />
  </div>
  
  <div class="date-switcher-container">
    <div class="date-switcher">
      <button class="inactive">Gestern</button>
      <button class="active">Heute</button>
      <button class="inactive">Morgen</button>
    </div>
  </div>

  {#if exerciseData.length > 0}
    <div class="chart-container">
      <h2>{exerciseData[0].title}</h2>
      <button on:click={previousSet}>&lt; Satz {currentSetIndex + 1}</button>
      <Line {chartData} />
      <button on:click={nextSet}>Satz {currentSetIndex + 1} &gt;</button>
    </div>
  {/if}

  <div class="task-list">
    <p class="no-task-title">Keine weiteren Übungen erledigt</p>
  </div>
</div>

<AppBar currentPage="stats" />
