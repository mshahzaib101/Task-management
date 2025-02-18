import { act } from "@testing-library/react";
import useTodoStore from "./todoStore";

describe("Todo Store", () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useTodoStore.setState({ todos: [] });
    });
  });

  describe("addTodo", () => {
    it("should add a new todo", () => {
      act(() => {
        useTodoStore.getState().addTodo("Test Todo", "Test Description");
      });

      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        title: "Test Todo",
        description: "Test Description",
        completed: false,
      });
      expect(todos[0].id).toBeDefined();
      expect(todos[0].createdAt).toBeInstanceOf(Date);
    });
  });

  describe("toggleTodo", () => {
    it("should toggle todo completion status", () => {
      let todoId: string;

      act(() => {
        useTodoStore.getState().addTodo("Test Todo", "Test Description");
        todoId = useTodoStore.getState().todos[0].id;
      });

      act(() => {
        useTodoStore.getState().toggleTodo(todoId);
      });

      expect(useTodoStore.getState().todos[0].completed).toBe(true);

      act(() => {
        useTodoStore.getState().toggleTodo(todoId);
      });

      expect(useTodoStore.getState().todos[0].completed).toBe(false);
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", () => {
      let todoId: string;

      act(() => {
        useTodoStore.getState().addTodo("Test Todo", "Test Description");
        todoId = useTodoStore.getState().todos[0].id;
      });

      act(() => {
        useTodoStore.getState().deleteTodo(todoId);
      });

      expect(useTodoStore.getState().todos).toHaveLength(0);
    });
  });

  describe("editTodo", () => {
    it("should edit a todo", () => {
      let todoId: string;

      act(() => {
        useTodoStore.getState().addTodo("Test Todo", "Test Description");
        todoId = useTodoStore.getState().todos[0].id;
      });

      act(() => {
        useTodoStore
          .getState()
          .editTodo(todoId, "Updated Todo", "Updated Description");
      });

      const editedTodo = useTodoStore.getState().todos[0];
      expect(editedTodo.title).toBe("Updated Todo");
      expect(editedTodo.description).toBe("Updated Description");
    });
  });

  describe("reorderTodos", () => {
    it("should reorder todos", () => {
      // Add two todos
      act(() => {
        useTodoStore.getState().addTodo("First Todo", "First Description");
        useTodoStore.getState().addTodo("Second Todo", "Second Description");
      });

      const todos = useTodoStore.getState().todos;
      const sourceId = todos[0].id;
      const destinationId = todos[1].id;

      act(() => {
        useTodoStore.getState().reorderTodos(sourceId, destinationId);
      });

      const reorderedTodos = useTodoStore.getState().todos;
      expect(reorderedTodos[0].title).toBe("First Todo");
      expect(reorderedTodos[1].title).toBe("Second Todo");
    });
  });
});
