<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUp from "@/components/SignUp.vue";
import SignIn from "@/components/SignIn.vue";
import TodoList from "@/components/ToDoList.vue";
import { LoaderCircle } from "lucide-vue-next";
import { getAuthToken } from "@/lib/cookie";
import axios from "axios";
import { API_DOMAIN } from "@/configs/api";

interface CheckoutResponse {
    status: boolean;
    uid: string;
}

const tabValue = ref<string>("sign-in");
const isCheckingToken = ref<boolean>(true);
const authToken = ref<string | null>(null);

const isLoggedIn = computed(() => {
    return authToken.value && !isCheckingToken.value;
});

const checkToken = async () => {
    try {
        isCheckingToken.value = true;
        const token = getAuthToken();
        if (token) {
            const response = await axios.get<CheckoutResponse>(`${API_DOMAIN}/users/checkout`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data.status) {
                authToken.value = token;
            } else {
                authToken.value = null;
            }
        } else {
            authToken.value = null;
        }
    } catch (error: any) {
        console.log(error);
        authToken.value = null;
    } finally {
        isCheckingToken.value = false;
    }
};

// 處理登出事件
const handleSignOut = () => {
    authToken.value = null;
};

onMounted(() => {
    checkToken();
});
</script>

<template>
    <div v-if="isCheckingToken" class="flex justify-center items-center h-[calc(100vh-36px)]">
        <LoaderCircle class="animate-spin mr-2" :size="36" />
    </div>
    <Tabs
        v-else-if="!isLoggedIn"
        default-value="sign-in"
        class="w-[400px] shadow-lg p-4 rounded-lg flex mx-auto"
        :model-value="tabValue"
    >
        <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in" @click="tabValue = 'sign-in'">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up" @click="tabValue = 'sign-up'">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
            <SignIn @sign-in-success="checkToken()" />
        </TabsContent>
        <TabsContent value="sign-up">
            <SignUp @sign-up-success="tabValue = 'sign-in'" />
        </TabsContent>
    </Tabs>
    <div v-else>
        <TodoList @sign-out-success="handleSignOut" />
    </div>
</template>
