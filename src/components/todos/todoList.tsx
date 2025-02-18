"use client";

import { useState, useMemo, useCallback } from "react";
import useTodoStore from "@/store/todoStore";
import ConfirmationModal from "@/components/todos/confirmationModal";
import TodoItem from "@/components/todos/todoItem";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TodoList = () => {
  // Combine drag-related state
  const [dragState, setDragState] = useState<{
    activeId: string | null;
    draggedTodo: Todo | null;
  }>({
    activeId: null,
    draggedTodo: null,
  });

  const { todos, deleteTodo, toggleTodo, editTodo, reorderTodos } =
    useTodoStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<EditingTodo | null>(null);

  // Memoize derived values
  const { activeTodos, completedTodos } = useMemo(
    () => ({
      activeTodos: todos.filter((todo) => !todo.completed),
      completedTodos: todos.filter((todo) => todo.completed),
    }),
    [todos]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { setNodeRef: setActiveDropRef } = useDroppable({
    id: "active-list",
  });

  const { setNodeRef: setCompletedDropRef } = useDroppable({
    id: "completed-list",
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTodo(deleteId);
      setDeleteId(null);

      toast.success("Task deleted successfully");
    }
  };

  const handleEdit = (id: string, title: string, description: string) => {
    if (title.trim() && description.trim()) {
      const duplicateTodo = todos.find(
        (todo) =>
          todo.title.toLowerCase() === title.trim().toLowerCase() &&
          todo.id !== id
      );

      if (duplicateTodo) {
        toast.error("A task with this title already exists!");
        return;
      }

      editTodo(id, title.trim(), description.trim());
      setEditingTodo(null);
      toast.success("Task updated successfully");
    } else {
      toast.error("Title and description cannot be empty");
    }
  };

  // Memoize handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id as string;
      const todo = todos.find((t) => t.id === id);
      setDragState({ activeId: id, draggedTodo: todo || null });
    },
    [todos]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDragState({ activeId: null, draggedTodo: null });

      if (!over) return;

      const activeItem = todos.find((todo) => todo.id === active.id);
      if (!activeItem) return;

      if (over.id === "active-list" || over.id === "completed-list") {
        const targetCompleted = over.id === "completed-list";
        if (activeItem.completed !== targetCompleted) {
          toggleTodo(activeItem.id);
        }
        return;
      }

      const overItem = todos.find((todo) => todo.id === over.id);
      if (!overItem) return;

      if (activeItem.completed !== overItem.completed) {
        toggleTodo(activeItem.id);
        reorderTodos(active.id as string, over.id as string);
      } else if (active.id !== over.id) {
        reorderTodos(active.id as string, over.id as string);
      }
    },
    [todos, toggleTodo, reorderTodos]
  );

  return (
    <div className="space-y-8 mt-10">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div>
          <h2 className="text-sm font-semibold mb-4 text-gray-900">
            Active Tasks
          </h2>
          <div
            ref={setActiveDropRef}
            className={`grid grid-cols-1 gap-4 p-4 sm:p-6 bg-gray-100 rounded-xl min-h-[100px] transition-colors duration-200 ${
              dragState.draggedTodo?.completed
                ? "border-2 border-dashed border-gray-300"
                : ""
            }`}
          >
            <SortableContext
              items={activeTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {activeTodos.length === 0 ? (
                <p className="text-gray-500 flex items-center justify-center">
                  No active tasks
                </p>
              ) : (
                activeTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDelete}
                    onToggle={toggleTodo}
                    onEdit={handleEdit}
                    editingTodo={editingTodo}
                    setEditingTodo={setEditingTodo}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-4 text-gray-900">
            Completed Tasks
          </h2>
          <div
            ref={setCompletedDropRef}
            className={`grid grid-cols-1 gap-4 p-4 sm:p-6 bg-gray-100 rounded-xl min-h-[100px] transition-colors duration-200 ${
              dragState.draggedTodo && !dragState.draggedTodo.completed
                ? "border-2 border-dashed border-gray-300"
                : ""
            }`}
          >
            <SortableContext
              items={completedTodos.map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              {completedTodos.length === 0 ? (
                <p className="text-gray-500 flex items-center justify-center">
                  No completed tasks
                </p>
              ) : (
                completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDelete}
                    onToggle={toggleTodo}
                    onEdit={handleEdit}
                    editingTodo={editingTodo}
                    setEditingTodo={setEditingTodo}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {dragState.draggedTodo ? (
            <div className="w-full">
              <TodoItem
                todo={dragState.draggedTodo}
                onDelete={handleDelete}
                onToggle={toggleTodo}
                onEdit={handleEdit}
                editingTodo={editingTodo}
                setEditingTodo={setEditingTodo}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TodoList;
