<script setup lang="ts">
interface Props {
    variant: "success" | "error" | "warning" | "info";
    title?: string;
}

withDefaults(defineProps<Props>(), {
    title: "",
});

const variantClasses = {
    success: "text-green-600 font-semibold",
    error: "text-red-600 font-semibold",
    warning: "text-yellow-600 font-semibold",
    info: "text-blue-600 font-semibold",
};
</script>

<template>
    <span :class="variantClasses[variant]">
        {{ title || $slots.default?.() }}
        <slot v-if="!title" />
    </span>
</template>
