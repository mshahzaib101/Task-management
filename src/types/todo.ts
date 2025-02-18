declare global {
  interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    position: number;
  }

  interface TodoStore {
    todos: Todo[];
    addTodo: (title: string, description: string) => void;
    deleteTodo: (id: string) => void;
    toggleTodo: (id: string) => void;
    editTodo: (id: string, title: string, description: string) => void;
    reorderTodos: (activeId: string, overId: string) => void;
  }
  
  interface EditingTodo {
    id: string;
    title: string;
    description: string;
  }
}

export {};
