<script>
    import { onMount } from 'svelte';
    import { exerciseStore } from '../lib/exerciseStore';
    import { goto } from '$app/navigation';
    import { get } from 'svelte/store';

    let exercise = { title: '', gif: '', instructions: '', sets: 0, reps: 0 };

    onMount(() => {
        const storedExercise = get(exerciseStore);
        if (storedExercise) {
            exercise = storedExercise;
        } else {
            // Set a default gif if none is provided
            exercise.gif = '/exercise.gif';
        }
    });

    function goBack() {
        goto('/'); // navigate back to the dashboard
    }

    function startExercise() {
        goto('/tracking'); // navigate to the tracking page
    }
</script>

<style>
    .exercise-container {
        padding: 16px;
        background: #FAFFFE;
        max-width: 390px;
        margin: 0 auto;
        font-family: 'SF Pro', sans-serif;
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
    }

    .title {
        margin-left: 20px;
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
        box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
    }

    .content-block img {
        max-width: 100%;
        border-radius: 10px;
        margin-bottom: 16px;
    }

    .content-block p {
        font-size: 16px;
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
        background: #006B58;
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 30px;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0px 4px 20px 4px rgba(0, 0, 0, 0.10);
        display: flex;
        align-items: center;
        gap: 8px;
        color: #FFFFFF;
        font-weight: 600;
    }

    .start-button button svg {
        width: 16px;
        height: 16px;
        fill: white;
    }
</style>

<div class="exercise-container">
    <div class="header">
        <img src="/static/back_arrow.svg" alt="Back" on:click={goBack} />
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
        <button on:click={startExercise}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Übung starten
        </button>
    </div>
</div>
