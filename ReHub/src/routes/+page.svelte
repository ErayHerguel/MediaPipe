<script>
  import { page } from '$app/stores';
  import Dashboard from './Dashboard.svelte';
  import Stats from './stats/+page.svelte';
  import ExercisePage from './exercise/+page.svelte';
  import AppBar from '../lib/AppBar.svelte';
  import { onMount } from 'svelte';

  let currentPage = 'dashboard';
  $: currentPage = $page.url.pathname === '/stats' ? 'stats' :
                   $page.url.pathname === '/exercise' ? 'exercise' :
                   $page.url.pathname === '/settings' ? 'settings' :
                   'dashboard';

  onMount(() => {
    currentPage = $page.url.pathname === '/stats' ? 'stats' :
                  $page.url.pathname === '/exercise' ? 'exercise' :
                  $page.url.pathname === '/settings' ? 'settings' :
                  'dashboard';
  });
</script>

<main>
  {#if currentPage === 'dashboard'}
    <Dashboard />
  {/if}
  {#if currentPage === 'stats'}
    <Stats />
  {/if}
  {#if currentPage === 'exercise'}
    <ExercisePage />
  {/if}
  {#if currentPage === 'settings'}
  {/if}
</main>

<AppBar {currentPage} />

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
  }
</style>
