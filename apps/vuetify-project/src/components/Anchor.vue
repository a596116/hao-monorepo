<script lang="ts" setup>
withDefaults(
  defineProps<{
    text?: string
    to?: string | Record<string, unknown>
    href?: string
    target?: "_blank" | "_self" | "_parent" | "_top"
    duration?: boolean
    hover?: boolean
  }>(),
  {
    text: "",
    to: undefined,
    href: "",
    duration: true,
    hover: false
  }
)
</script>
<template>
  <RouterLink
    v-if="to"
    :to="to"
    :target="target || '_self'"
    class="cursor-pointer outline-none transition-colors"
    :class="{ 'duration-150': duration, 'hover:text-hd-primary-hover': hover }"
  >
    <slot>{{ text }}</slot>
  </RouterLink>
  <a
    v-else-if="href"
    class="cursor-pointer outline-none transition-colors"
    :class="{ 'duration-150': duration, 'hover:text-hd-primary-hover': hover }"
    :href="href"
    :target="target || '_blank'"
  >
    <slot>{{ text }}</slot>
  </a>
  <span
    v-else
    class="outline-none transition-colors"
    :class="{ 'duration-150': duration, 'hover:text-hd-primary-hover': hover }"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
