<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    const timer = setTimeout(() => {
      goto("/");
    }, 3000);

    return () => {
      clearTimeout(timer); // Clear timeout if the component is destroyed before the timeout completes
    };
  });

  function handleButtonClick() {
    goto("/dashboard");
  }
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fafffe;
    font-family: "SF Pro", sans-serif;
  }

  .icon {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  .message {
    font-size: 2.5em;
    font-weight: bold;
    margin-bottom: 30px;
    text-align: center;
  }
</style>

<main>
  <img src="/finished.png" alt="Finished Icon" class="icon" />
  <div class="message">Geschafft!</div>
</main>
