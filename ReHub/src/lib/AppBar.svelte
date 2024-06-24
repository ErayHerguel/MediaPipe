<script>
    export let currentPage = 'dashboard';
  </script>
  
  <style>
    .app-bar {
      display: flex;
      width: 100%;
      max-width: 390px;
      padding: 24px; /* Keep the existing padding */
      justify-content: space-between;
      align-items: center;
      background: #EFEFEF;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 40px; /* Add larger margin to bring icons towards the center */
    }
    .icon img {
      width: 24px; /* Ensure icon size */
      height: 24px; /* Ensure icon size */
    }
    .active img {
      filter: brightness(0) saturate(100%) invert(28%) sepia(72%) saturate(2182%) hue-rotate(127deg) brightness(91%) contrast(88%); /* Set the color for the active icon */
    }
  </style>
  
  <div class="app-bar">
    <div class="icon {currentPage === 'dashboard' ? 'active' : ''}">
      <img src="/SF_Run.svg" alt="Run Icon" />
    </div>
    <div class="icon {currentPage === 'stats' ? 'active' : ''}">
      <img src="/SF_Stats.svg" alt="Stats Icon" />
    </div>
    <div class="icon {currentPage === 'settings' ? 'active' : ''}">
      <img src="/SF_Settings.svg" alt="Settings Icon" />
    </div>
  </div>
  