<script>
  import { page } from "$app/stores";
  import Dashboard from "./Dashboard.svelte";
  import AppBar from "../lib/AppBar.svelte";

  let currentPage = "dashboard";
  $: currentPage =
    $page.url.pathname === "/exercise" ? "exercise" : "dashboard";
</script>

<main>
  {#if currentPage === "dashboard"}
    <Dashboard />
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
