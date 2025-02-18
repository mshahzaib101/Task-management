import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      reorderTodos: (activeId: string, overId: string) => {
        set((state) => {
          const oldIndex = state.todos.findIndex(
            (todo) => todo.id === activeId
          );
          const newIndex = state.todos.findIndex((todo) => todo.id === overId);

          if (oldIndex === -1 || newIndex === -1) return state;

          const newTodos = [...state.todos];
          const [movedItem] = newTodos.splice(oldIndex, 1);
          newTodos.splice(newIndex, 0, movedItem);

          return { todos: newTodos };
        });
      },

      addTodo: (title: string, description: string) => {
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              title,
              description,
              completed: false,
              createdAt: new Date(),
              position: state.todos.length,
            },
          ],
        }));
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      editTodo: (id: string, title: string, description: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, title, description } : todo
          ),
        }));
      },
    }),
    {
      name: "todo-storage",
    }
  )
);

export default useTodoStore;
