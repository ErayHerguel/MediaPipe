<script>
  import { goto } from "$app/navigation";
  export let currentPage = "dashboard";

  /**
   * @param {string | URL} path
   */
  function navigateTo(path) {
    goto(path);
  }
</script>

<div class="app-bar">
  <div
    class="icon {currentPage === 'dashboard' ? 'active' : ''}"
    on:click={() => navigateTo("/")}
  >
    <img src="/SF_Run.svg" alt="Run Icon" />
  </div>
  <div
    class="icon {currentPage === 'stats' ? 'active' : ''}"
    on:click={() => navigateTo("/stats")}
  >
    <img src="/SF_Stats.svg" alt="Stats Icon" />
  </div>
  <div
    class="icon {currentPage === 'settings' ? 'active' : ''}"
    on:click={() => navigateTo("/settings")}
  >
    <img src="/SF_Settings.svg" alt="Settings Icon" />
  </div>
</div>

<style>
  .app-bar {
    display: flex;
    width: 100%;
    max-width: 390px;
    padding: 24px;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.6);
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 10;
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 40px;
  }
  .icon img {
    width: 24px;
    height: 24px;
  }
  .active img {
    filter: brightness(0) saturate(100%) invert(72%) sepia(50%) saturate(1250%)
      hue-rotate(110deg) brightness(90%) contrast(85%);
  }
</style>
