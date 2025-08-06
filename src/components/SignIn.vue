<script setup lang="ts">
import { ref, markRaw } from "vue";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import LoadingButton from "@/components/LoadingButton.vue";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ToastMessageTitle from "@/components/ToastMessageTitle.vue";
import axios from "axios";

import { API_DOMAIN } from "@/configs/api";
import { setAuthCookies } from "@/lib/cookie";

export interface SignInResponse {
    status: boolean;
    exp: number;
    token: string;
}

const isLoading = ref<boolean>(false);

const formSchema = toTypedSchema(
    z.object({
        email: z.email({ message: "請輸入正確的 email 格式" }),
        password: z.string().min(6, { message: "密碼至少需要 6 個字元" }),
    }),
);

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: "",
        password: "",
    },
});

// 清除指定欄位的錯誤訊息
const clearFieldError = (fieldName: "email" | "password") => {
    form.setFieldError(fieldName, undefined);
};

const onSubmit = form.handleSubmit(async (values) => {
    try {
        isLoading.value = true;
        const response = await axios.post<SignInResponse>(`${API_DOMAIN}/users/sign_in`, values);
        if (response.data.status && response.data.token && response.data.exp) {
            setAuthCookies(response.data.token, response.data.exp);
        }

        form.resetForm();
        toast(markRaw(ToastMessageTitle), {
            componentProps: {
                variant: "success",
                title: "登入成功",
            },
            description: "歡迎使用 Todo List 服務",
        });
        emit("sign-in-success");
    } catch (error: any) {
        toast(markRaw(ToastMessageTitle), {
            componentProps: {
                variant: "error",
                title: "登入失敗",
            },
            description: error?.response?.data?.message ?? error?.message ?? "未知的錯誤",
        });
    } finally {
        isLoading.value = false;
    }
});

const emit = defineEmits(["sign-in-success"]);
</script>

<template>
    <form @submit="onSubmit" class="w-full">
        <FormField
            v-slot="{ componentField }"
            name="email"
            :validate-on-blur="false"
            :validate-on-change="false"
            :validate-on-input="false"
            :validate-on-model-update="false"
            :validate-on-mount="false"
        >
            <FormItem class="gap-0 w-full mb-4">
                <FormLabel class="mb-1">帳號</FormLabel>
                <FormControl>
                    <Input
                        type="email"
                        placeholder="請輸入 Email"
                        v-bind="componentField"
                        @input="clearFieldError('email')"
                    />
                </FormControl>
                <div class="min-h-5">
                    <FormMessage />
                </div>
            </FormItem>
        </FormField>
        <FormField
            v-slot="{ componentField }"
            name="password"
            :validate-on-blur="false"
            :validate-on-change="false"
            :validate-on-input="false"
            :validate-on-model-update="false"
            :validate-on-mount="false"
        >
            <FormItem class="gap-0 w-full mb-4">
                <FormLabel class="mb-1">密碼</FormLabel>
                <FormControl>
                    <Input type="password" v-bind="componentField" @input="clearFieldError('password')" />
                </FormControl>
                <div class="min-h-5">
                    <FormMessage />
                </div>
            </FormItem>
        </FormField>
        <LoadingButton type="submit" class="hover:bg-gray-600 w-full" :is-loading="isLoading">登入</LoadingButton>
    </form>
</template>
