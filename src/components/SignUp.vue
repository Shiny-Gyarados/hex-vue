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

export interface SignUpResponse {
    status: boolean;
    uid: string;
}

const isLoading = ref<boolean>(false);

const formSchema = toTypedSchema(
    z.object({
        email: z.email({ message: "請輸入正確的 email 格式" }),
        password: z.string().min(6, { message: "密碼至少需要 6 個字元" }),
        nickname: z.string().min(1, { message: "暱稱至少需要 1 個字元" }),
    }),
);

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: "",
        password: "",
        nickname: "",
    },
});

// 清除指定欄位的錯誤訊息
const clearFieldError = (fieldName: "email" | "password" | "nickname") => {
    form.setFieldError(fieldName, undefined);
};

const onSubmit = form.handleSubmit(async (values) => {
    try {
        isLoading.value = true;
        const response = await axios.post<SignUpResponse>(`${API_DOMAIN}/users/sign_up`, values);
        if (response.data.status) {
            form.resetForm();
            toast(markRaw(ToastMessageTitle), {
                componentProps: {
                    variant: "success",
                    title: "註冊成功",
                },
                description: "請登入後，繼續使用",
            });
            emit("sign-up-success");
        }
    } catch (error: any) {
        // toast("註冊失敗", {
        //     description: error?.response?.data?.message ?? error?.message ?? "未知的錯誤",
        // });
        toast(markRaw(ToastMessageTitle), {
            componentProps: {
                variant: "error",
                title: "註冊失敗",
            },
            description: error?.response?.data?.message ?? error?.message ?? "未知的錯誤",
        });
    } finally {
        isLoading.value = false;
    }
});

const emit = defineEmits(["sign-up-success"]);
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
        <FormField
            v-slot="{ componentField }"
            name="nickname"
            :validate-on-blur="false"
            :validate-on-change="false"
            :validate-on-input="false"
            :validate-on-model-update="false"
            :validate-on-mount="false"
        >
            <FormItem class="gap-0 w-full mb-4">
                <FormLabel class="mb-1">暱稱</FormLabel>
                <FormControl>
                    <Input type="text" v-bind="componentField" @input="clearFieldError('nickname')" />
                </FormControl>
                <div class="min-h-5">
                    <FormMessage />
                </div>
            </FormItem>
        </FormField>
        <LoadingButton type="submit" class="hover:bg-gray-600 min-w-25" :is-loading="isLoading">註冊</LoadingButton>
    </form>
</template>
