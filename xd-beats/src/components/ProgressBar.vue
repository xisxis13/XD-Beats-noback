<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  computed: {
    progressPercentage() {
      if (this.duration === 0) return 0;
      return (this.progress / this.duration) * 100;
    },
  },
  methods: {
    formatTime(ms) {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },
    onSeek(event) {
      const newPosition = Math.floor((event.target.value / 100) * this.duration);
      this.$emit('seek', newPosition);
    },
    updateProgressStyle() {
      const input = this.$refs.progressBar;
      if (input) {
        input.style.setProperty('--progress-percentage', `${this.progressPercentage}%`);
      }
    },
  },
  watch: {
    progressPercentage() {
      this.updateProgressStyle();
    },
  },
  mounted() {
    this.updateProgressStyle();
  },
};
</script>

<template>
  <div class="progress-bar-container">
    <div class="time-display">
      <h6 class="light">{{ formatTime(progress) }}</h6>
      <input
        ref="progressBar"
        type="range"
        min="0"
        max="100"
        :value="progressPercentage"
        @input="onSeek"
        class="progress-bar"
      />
      <h6 class="light">{{ formatTime(duration) }}</h6>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-container {
  width: 100%;
  max-width: 600px;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  cursor: pointer;
  -webkit-appearance: none;
  background: var(--light-content);
  border-radius: 4px;
  background: linear-gradient(
    to right,
    var(--orange) 0%,
    var(--orange) var(--progress-percentage, 0%),
    var(--light-content) var(--progress-percentage, 0%),
    var(--light-content) 100%
  );
  position: relative;
}

/* Style de la piste pour Webkit */
.progress-bar::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
}

/* Style du curseur (thumb) pour Webkit */
.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--orange);
  border-radius: 50%;
  cursor: pointer;
  margin-top: -2px;
}

/* Style de la piste pour Firefox */
.progress-bar::-moz-range-track {
  height: 8px;
  background: var(--light-content);
  border-radius: 4px;
}

/* Style de la progression pour Firefox */
.progress-bar::-moz-range-progress {
  background-color: var(--orange);
  height: 8px;
  border-radius: 4px;
}

/* Style du curseur (thumb) pour Firefox */
.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--orange);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
