<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>

<template>
    <SidebarProvider>
        <AppSidebar />
        <main class="flex-1">
            <SidebarTrigger />
            <RouterView />
        </main>
        <Toaster />
    </SidebarProvider>
</template>
