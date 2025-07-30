<script setup lang="ts">
import { ref } from "vue";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, PenLine, X, Check } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

const items = ref<
    {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        isEditing: boolean;
    }[]
>([
    {
        id: 1,
        name: "珍珠奶茶",
        description: "香濃奶茶搭配QQ珍珠",
        price: 50,
        stock: 20,
        isEditing: false,
    },
    {
        id: 2,
        name: "冬瓜檸檬",
        description: "清新冬瓜配上新鮮檸檬",
        price: 45,
        stock: 18,
        isEditing: false,
    },
    {
        id: 3,
        name: "翡翠檸檬",
        description: "綠茶與檸檬的完美結合",
        price: 55,
        stock: 34,
        isEditing: false,
    },
    {
        id: 4,
        name: "四季春茶",
        description: "香醇四季春茶，回甘無比",
        price: 45,
        stock: 10,
        isEditing: false,
    },
    {
        id: 5,
        name: "阿薩姆奶茶",
        description: "阿薩姆紅茶搭配香醇鮮奶",
        price: 50,
        stock: 25,
        isEditing: false,
    },
    {
        id: 6,
        name: "檸檬冰茶",
        description: "檸檬與冰茶的清新組合",
        price: 45,
        stock: 20,
        isEditing: false,
    },
    {
        id: 7,
        name: "芒果綠茶",
        description: "芒果與綠茶的獨特風味",
        price: 55,
        stock: 18,
        isEditing: false,
    },
    {
        id: 8,
        name: "抹茶拿鐵",
        description: "抹茶與鮮奶的絕配",
        price: 60,
        stock: 20,
        isEditing: false,
    },
]);

const editingItems = ref<Record<string, string>>({});

function stockHandler(id: number, amount: number) {
    items.value = items.value.map((item) => {
        if (item.id === id) {
            return { ...item, stock: item.stock + amount };
        }
        return item;
    });
}

function editHandler(id: number) {
    const editTarget = items.value.find((item) => item.id === id);
    if (editTarget) {
        editingItems.value = { ...editingItems.value, [`${editTarget.id}`]: editTarget.name };
    }
    items.value = items.value.map((item) => {
        if (item.id === id) {
            return { ...item, isEditing: !item.isEditing };
        }
        return item;
    });
}

function cancelHandler(id: number) {
    items.value = items.value.map((item) => {
        if (item.id === id) {
            return { ...item, isEditing: false };
        }
        return item;
    });
}

function saveHandler(id: number) {
    items.value = items.value.map((item) => {
        if (item.id === id) {
            return { ...item, isEditing: false, name: editingItems.value[`${item.id}`] };
        }
        return item;
    });
}
</script>
<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead class="w-[100px] font-bold text-black min-w-[120px]">品項</TableHead>
                <TableHead class="font-bold text-black">描述</TableHead>
                <TableHead class="font-bold text-black">價格</TableHead>
                <TableHead class="text-center font-bold text-black">庫存</TableHead>
                <TableHead class="text-center font-bold text-black min-w-[120px]">編輯</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="item in items" :key="item.id" class="[&_td]:px-4">
                <TableCell class="font-medium min-w-[120px]">
                    <template v-if="item.isEditing">
                        <Input v-model="editingItems[item.id + '']" />
                    </template>
                    <template v-else>
                        {{ item.name }}
                    </template>
                </TableCell>
                <TableCell>{{ item.description }}</TableCell>
                <TableCell class="text-right">{{ item.price }}</TableCell>
                <TableCell class="text-center">
                    <div class="flex items-center gap-2">
                        <Button variant="outline" size="icon" @click="stockHandler(item.id, -1)">
                            <Minus />
                        </Button>
                        {{ item.stock }}
                        <Button variant="outline" size="icon" @click="stockHandler(item.id, 1)">
                            <Plus />
                        </Button>
                    </div>
                </TableCell>
                <TableCell class="text-center min-w-[120px]">
                    <template v-if="item.isEditing">
                        <Button
                            variant="outline"
                            size="icon"
                            @click="cancelHandler(item.id)"
                            class="mx-0.5 bg-red-400 hover:bg-red-500 text-white hover:text-white"
                        >
                            <X />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            @click="saveHandler(item.id)"
                            class="mx-0.5 bg-green-400 hover:bg-green-500 text-white hover:text-white"
                        >
                            <Check />
                        </Button>
                    </template>
                    <template v-else>
                        <Button variant="outline" size="icon" @click="editHandler(item.id)">
                            <PenLine />
                        </Button>
                    </template>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
