<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { todoApi } from "@/api/todos";
import { authApi } from "@/api/auth";
import type { TodoItem } from "@/types/todo";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit3, Plus, X, Check, LoaderCircle, LogOut } from "lucide-vue-next";
import { toast } from "vue-sonner";

// 定義 emits
const emit = defineEmits<{
    "sign-out-success": [];
}>();

// 狀態管理
const todos = ref<TodoItem[]>([]);
const loading = ref(false);
const initialLoading = ref(true); // 專門用於初始載入的狀態
const error = ref<string | null>(null);
const newTodoContent = ref("");
const editingTodo = ref<string | null>(null);
const editingContent = ref("");
const signingOut = ref(false);

// 輸入框 ref
const newTodoInput = ref<InstanceType<typeof Input> | null>(null);

// 計算屬性
const completedTodos = computed(() => todos.value.filter((todo) => todo.status));
const activeTodos = computed(() => todos.value.filter((todo) => !todo.status));
const totalTodos = computed(() => todos.value.length);

// 排序後的 todos：未完成的在上方（按建立時間由新到舊），完成的在下方
const sortedTodos = computed(() => {
    const completed = todos.value.filter((todo) => todo.status);
    const active = todos.value.filter((todo) => !todo.status);

    // 未完成的按建立時間排序（較新的在上方）
    const sortedActive = active.sort((a, b) => b.createTime - a.createTime);

    // 完成的按建立時間排序（較新的在上方）
    const sortedCompleted = completed.sort((a, b) => b.createTime - a.createTime);

    // 合併：未完成的在上方，完成的在下方
    return [...sortedActive, ...sortedCompleted];
});

// API 調用函數
async function fetchTodos() {
    try {
        // 如果是空列表則使用 initialLoading，否則使用 loading
        // if (todos.value.length === 0) {
        //     initialLoading.value = true;
        // } else {
        // }
        loading.value = true;
        error.value = null;
        const response = await todoApi.getTodos();
        if (response.status) {
            todos.value = response.data;
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to fetch todos";
        console.error("Error fetching todos:", err);
    } finally {
        initialLoading.value = false;
        loading.value = false;
    }
}

// 載入 todos
onMounted(() => {
    fetchTodos();
});

// 新增 todo
async function addTodo() {
    if (!newTodoContent.value.trim()) return;

    try {
        loading.value = true;
        error.value = null;
        await todoApi.createTodo({ content: newTodoContent.value });
        newTodoContent.value = "";
        // 重新載入列表
        await fetchTodos();
        toast.success("Todo 已新增成功！");

        // 聚焦回輸入框
        await nextTick();
        if (newTodoInput.value && newTodoInput.value.$el) {
            newTodoInput.value.$el.focus();
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to create todo";
        toast.error("新增 Todo 失敗");
    } finally {
        loading.value = false;
    }
}

// 開始編輯
function startEdit(id: string, content: string) {
    editingTodo.value = id;
    editingContent.value = content;
}

// 取消編輯
function cancelEdit() {
    editingTodo.value = null;
    editingContent.value = "";
}

// 儲存編輯
async function saveEdit(id: string) {
    if (!editingContent.value.trim()) return;

    try {
        loading.value = true;
        error.value = null;
        await todoApi.updateTodo(id, { content: editingContent.value });
        // 更新本地狀態
        const todoIndex = todos.value.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
            todos.value[todoIndex].content = editingContent.value;
        }
        editingTodo.value = null;
        editingContent.value = "";
        toast.success("Todo 已更新成功！");
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to update todo";
        toast.error("更新 Todo 失敗");
    } finally {
        loading.value = false;
    }
}

// 刪除 todo
async function deleteTodo(id: string) {
    try {
        loading.value = true;
        error.value = null;
        await todoApi.deleteTodo(id);
        // 從本地狀態移除
        todos.value = todos.value.filter((todo) => todo.id !== id);
        toast.success("Todo 已刪除成功！");
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to delete todo";
        toast.error("刪除 Todo 失敗");
    } finally {
        loading.value = false;
    }
}

// 切換 todo 狀態
async function toggleTodo(id: string) {
    try {
        loading.value = true;
        error.value = null;
        await todoApi.toggleTodo(id);
        // 更新本地狀態
        const todoIndex = todos.value.findIndex((todo) => todo.id === id);
        if (todoIndex !== -1) {
            todos.value[todoIndex].status = !todos.value[todoIndex].status;
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to toggle todo";
        toast.error("更新 Todo 狀態失敗");
    } finally {
        loading.value = false;
    }
}

// 按 Enter 新增 todo
function handleAddKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTodo();
    }
}

// 按 Enter 儲存編輯
function handleEditKeyPress(event: KeyboardEvent, id: string) {
    if (event.key === "Enter") {
        saveEdit(id);
    } else if (event.key === "Escape") {
        cancelEdit();
    }
}

// 登出功能
async function handleSignOut() {
    try {
        signingOut.value = true;
        await authApi.signOut();
        toast.success("登出成功");
        emit("sign-out-success");
    } catch (err) {
        console.error("登出失敗:", err);
        toast.error("登出失敗，請稍後再試");
    } finally {
        signingOut.value = false;
    }
}
</script>

<template>
    <div class="w-full max-w-2xl mx-auto p-6 space-y-6">
        <!-- 標題和登出按鈕 -->
        <div class="relative text-center">
            <!-- 登出按鈕 (右上角) -->
            <div class="absolute top-0 right-0">
                <Button
                    variant="outline"
                    size="sm"
                    @click="handleSignOut"
                    :disabled="signingOut"
                    class="text-muted-foreground hover:text-foreground"
                >
                    <LoaderCircle v-if="signingOut" class="animate-spin h-4 w-4 mr-2" />
                    <LogOut v-else class="w-4 h-4 mr-2" />
                    登出
                </Button>
            </div>

            <h1 class="text-3xl font-bold text-foreground">Todo List</h1>
            <p class="text-muted-foreground mt-2">管理您的待辦事項</p>
        </div>

        <!-- 統計資訊 -->
        <div class="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div>
                總計: <span class="font-medium text-foreground">{{ totalTodos }}</span>
            </div>
            <div>
                進行中: <span class="font-medium text-blue-600">{{ activeTodos.length }}</span>
            </div>
            <div>
                已完成: <span class="font-medium text-green-600">{{ completedTodos.length }}</span>
            </div>
        </div>

        <!-- 新增 Todo 輸入框 -->
        <div class="flex gap-2">
            <Input
                ref="newTodoInput"
                v-model="newTodoContent"
                placeholder="輸入新的待辦事項..."
                class="flex-1"
                :disabled="loading"
                @keypress="handleAddKeyPress"
            />
            <Button @click="addTodo" class="hover:bg-gray-600" :disabled="loading || !newTodoContent.trim()">
                <LoaderCircle v-if="loading" class="animate-spin h-4 w-4 mr-2" />
                <Plus v-else class="w-4 h-4 mr-2" />
                新增
            </Button>
        </div>

        <Separator />
        <!-- 初始載入狀態 -->
        <div v-if="initialLoading" class="space-y-3">
            <Skeleton class="h-12 w-full" />
            <Skeleton class="h-12 w-full" />
            <Skeleton class="h-12 w-full" />
            <Skeleton class="h-12 w-full" />
            <Skeleton class="h-12 w-full" />
        </div>

        <!-- 錯誤訊息 -->
        <div v-else-if="error && !initialLoading" class="text-center py-8">
            <p class="text-destructive">{{ error }}</p>
            <Button variant="outline" @click="fetchTodos()" class="mt-4">重新載入</Button>
        </div>

        <!-- Todo 列表 -->
        <div v-else-if="todos.length > 0" class="space-y-2">
            <div
                v-for="todo in sortedTodos"
                :key="todo.id"
                class="flex items-center gap-3 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                :class="{
                    'opacity-75': todo.status,
                }"
            >
                <!-- Checkbox -->
                <Checkbox
                    :model-value="todo.status"
                    @update:model-value="() => toggleTodo(todo.id)"
                    :disabled="loading"
                />

                <!-- Todo 內容 -->
                <div class="flex-1">
                    <!-- 編輯模式 -->
                    <div v-if="editingTodo === todo.id" class="flex gap-2">
                        <Input
                            v-model="editingContent"
                            class="flex-1"
                            @keypress="(e: KeyboardEvent) => handleEditKeyPress(e, todo.id)"
                            autofocus
                        />
                        <Button
                            size="sm"
                            class="bg-green-400 hover:bg-green-500"
                            @click="saveEdit(todo.id)"
                            :disabled="!editingContent.trim()"
                        >
                            <Check class="w-4 h-4" />
                        </Button>
                        <Button size="sm" class="bg-red-400 hover:bg-red-500" @click="cancelEdit">
                            <X class="w-4 h-4" />
                        </Button>
                    </div>

                    <!-- 顯示模式 -->
                    <div v-else>
                        <p
                            class="text-foreground"
                            :class="{
                                'line-through text-muted-foreground': todo.status,
                            }"
                        >
                            {{ todo.content }}
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                            建立於: {{ new Date(todo.createTime * 1000).toLocaleString("zh-TW") }}
                        </p>
                    </div>
                </div>

                <!-- 操作按鈕 -->
                <div v-if="editingTodo !== todo.id" class="flex gap-1">
                    <Button size="sm" variant="ghost" @click="startEdit(todo.id, todo.content)" :disabled="loading">
                        <Edit3 class="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        @click="deleteTodo(todo.id)"
                        :disabled="loading"
                        class="text-destructive hover:text-destructive"
                    >
                        <Trash2 class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="text-center py-12">
            <div class="text-muted-foreground mb-4">
                <p class="text-lg font-medium">沒有待辦事項</p>
                <p class="text-sm">開始新增您的第一個待辦事項吧！</p>
            </div>
        </div>
    </div>
</template>
