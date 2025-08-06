<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-vue-next";
import { type ButtonVariants } from "@/components/ui/button";

interface Props {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: HTMLAttributes["class"];
    isLoading?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
    type: "button",
    isLoading: false,
    disabled: false,
});
</script>

<template>
    <Button
        :variant="props.variant"
        :size="props.size"
        :class="props.class"
        :disabled="props.isLoading || props.disabled"
        :type="props.type"
    >
        <LoaderCircle v-if="props.isLoading" class="animate-spin h-4 w-4 mr-2" />
        <slot />
    </Button>
</template>
