<script>
  import { createEventDispatcher } from 'svelte';

  // Props for score and time survived
  export let score = 0;
  export let timeSurvived = '00:00';

  const dispatch = createEventDispatcher();

  // Restart event
  const restartGame = () => {
    dispatch('restart');
  };
</script>

<div class="overlay">
  <div class="game-over-box">
    <div class="title">Game Over</div>
    <div class="stats">Score: {score}</div>
    <div class="stats">Time Survived: {timeSurvived}</div>
    <button class="restart-btn" on:click={restartGame}>Restart</button>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');

  /* Fullscreen overlay */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); /* Dark semi-transparent overlay */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Game Over Box */
  .game-over-box {
    background: rgba(255, 255, 255, 0.9);
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    width: 90%;
    max-width: 400px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  }

  /* Title */
  .title {
    font-family: 'Roboto', sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: #ff3b3b;
    margin-bottom: 20px;
  }

  /* Score and Time */
  .stats {
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
  }

  /* Restart Button */
  .restart-btn {
    background: #ff3b3b;
    color: white;
    font-size: 20px;
    font-weight: bold;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
  }

  .restart-btn:hover {
    background: #d32f2f;
  }
</style>
