<template>
  <div class="filter-bar">
    <div class="spacer" />
    <button class="filter-btn" @click="emit('open')">
      <span class="filter-label">{{ filterLabel }}</span>
      <span class="chevron">∨</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  period: { type: String, default: "1개월" },
  type: { type: String, default: "전체" },
});

const emit = defineEmits(["open"]);

const filterLabel = computed(() =>
  [props.period, props.type, props.sort].filter(Boolean).join(" · "),
);
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}

.spacer {
  width: 24px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
}

.filter-label {
  font-size: 15px;
  color: #333;
  letter-spacing: -0.2px;
}

.chevron {
  font-size: 13px;
  color: #555;
  margin-top: 1px;
}
</style>
