<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, RefreshRight } from '@element-plus/icons-vue'

const emit = defineEmits<{
  unlock: []
}>()

const passcode = ['拼', '图', '开', '始']
const picked = ref<string[]>([])
const isWrong = ref(false)
const isComplete = computed(() => picked.value.length === passcode.length)

function pickToken(token: string): void {
  const expected = passcode[picked.value.length]

  if (token !== expected) {
    isWrong.value = true
    window.setTimeout(reset, 420)
    return
  }

  picked.value.push(token)

  if (picked.value.length === passcode.length) {
    window.setTimeout(() => emit('unlock'), 520)
  }
}

function reset(): void {
  picked.value = []
  isWrong.value = false
}
</script>

<template>
  <main class="first-gate">
    <section class="first-gate__panel" :class="{ 'is-wrong': isWrong, 'is-complete': isComplete }">
      <div class="first-gate__orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div class="first-gate__brand">
        <span>AI ToolBox</span>
        <h1>点亮工具盒子</h1>
        <p>按顺序点亮「拼 图 开 始」，第一次成功后会记住这台浏览器。</p>
      </div>

      <div class="first-gate__sequence" aria-label="解锁进度">
        <span v-for="token in passcode" :key="token" :class="{ active: picked.includes(token) }">{{ token }}</span>
      </div>

      <div class="first-gate__tokens">
        <button
          v-for="token in ['开', '拼', '始', '图']"
          :key="token"
          type="button"
          :disabled="isComplete"
          @click="pickToken(token)"
        >
          {{ token }}
        </button>
      </div>

      <div class="first-gate__actions">
        <el-button :icon="RefreshRight" round @click="reset">重来</el-button>
        <el-button type="primary" :icon="Check" round :disabled="!isComplete" @click="emit('unlock')">进入</el-button>
      </div>
    </section>
  </main>
</template>
