<script setup lang="ts">
import { Home, BadgeInfo, BookOpenText } from "lucide-vue-next";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "About",
        url: "/about",
        icon: BadgeInfo,
    },
    {
        title: "Week1",
        url: "/week1",
        icon: BookOpenText,
    },
    {
        title: "Week2",
        url: "/week2",
        icon: BookOpenText,
    },
];

// 檢查路由是否為當前active路由
const isActiveRoute = (url: string) => {
    return route.path === url;
};
</script>

<template>
    <Sidebar>
        <SidebarHeader />
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item of items" :key="item.title">
                            <SidebarMenuButton asChild :isActive="isActiveRoute(item.url)">
                                <RouterLink :to="item.url">
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </RouterLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
</template>
