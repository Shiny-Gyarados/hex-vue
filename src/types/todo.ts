export interface TodoItem {
    id: string;
    createTime: number;
    content: string;
    status: boolean;
}

export interface TodoResponse {
    status: boolean;
    data: TodoItem[];
}

export interface CreateTodoRequest {
    content: string;
}

export interface UpdateTodoRequest {
    content: string;
}
