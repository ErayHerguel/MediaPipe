<script>
    import { onMount } from 'svelte';
    import { exerciseStore } from '../lib/exerciseStore';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';
  
    let exercise = { title: '', gif: '', instructions: '', sets: 0, reps: 0 };
  
    onMount(() => {
        exercise = get(exerciseStore); // Get the current exercise data from the store
    });
  
    function goBack() {
        goto('/'); // navigate back to the dashboard
    }
</script>

<style>
    .exercise-container {
        padding: 16px;
        background: #FAFFFE;
        max-width: 390px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
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
        color: #006B58;
        font-family: 'SF Pro', sans-serif;
    }

    .title {
        margin-left: 8px;
        margin-top: 12px;
        margin-bottom: 8px;
        color: var(--Schwarz, #343434);
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }

    .content-block {
        text-align: center;
        margin-bottom: 16px;
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
    }

    .content-block img {
        max-width: 100%;
        border-radius: 10px;
        margin-bottom: 16px;
    }

    .content-block p {
        font-size: 14px;
        color: #333;
    }

    .details {
        background: #FFFFFF;
        box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
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
        background: #00C896;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
    }
</style>

<div class="exercise-container">
    <div class="header">
        <img src="/SF_Back.svg" alt="Back" on:click={goBack} />
        <h1>{exercise.title}</h1>
    </div>

    <div class="title">Anleitung</div>
    <div class="content-block">
        <img src={exercise.gif} alt={exercise.title} />
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
        <button>Übung starten</button>
    </div>
</div>
