import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
  editingTodo: EditingTodo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<EditingTodo | null>>;
}

const EditTodoForm = React.memo(
  ({
    editingTodo,
    setEditingTodo,
    onEdit,
    todo,
  }: {
    editingTodo: EditingTodo;
    setEditingTodo: React.Dispatch<React.SetStateAction<EditingTodo | null>>;
    onEdit: (id: string, title: string, description: string) => void;
    todo: Todo;
  }) => {
    const handleSave = React.useCallback(() => {
      onEdit(todo.id, editingTodo.title, editingTodo.description);
    }, [todo.id, editingTodo.title, editingTodo.description, onEdit]);

    return (
      <>
        <div className="space-y-2">
          <input
            type="text"
            value={editingTodo.title}
            onChange={(e) =>
              setEditingTodo({ ...editingTodo, title: e.target.value })
            }
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <textarea
            value={editingTodo.description}
            onChange={(e) =>
              setEditingTodo({
                ...editingTodo,
                description: e.target.value,
              })
            }
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <div className="flex gap-2 items-center mt-3 ml-auto">
          <button
            onClick={() => setEditingTodo(null)}
            className="rounded bg-gray-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Save
          </button>
        </div>
      </>
    );
  }
);

const StaticTodo = React.memo(
  ({
    todo,
    onToggle,
    onDelete,
    setEditingTodo,
    attributes,
    listeners,
  }: {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    setEditingTodo: React.Dispatch<React.SetStateAction<EditingTodo | null>>;
    attributes: any;
    listeners: any;
  }) => {
    const handleDelete = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(todo.id);
      },
      [todo.id, onDelete]
    );

    const handleToggle = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggle(todo.id);
      },
      [todo.id, onToggle]
    );

    const handleEdit = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTodo({
          id: todo.id,
          title: todo.title,
          description: todo.description,
        });
      },
      [todo, setEditingTodo]
    );

    return (
      <>
        <div {...attributes} {...listeners} className="cursor-grab">
          <h3
            className={`text-base text-gray-900 font-semibold ${
              todo.completed ? "line-through" : ""
            }`}
          >
            {todo.title}
          </h3>
          <p className="text-sm text-gray-500">{todo.description}</p>
        </div>
        <div className="flex justify-between border-t border-gray-100 mt-3 pt-2">
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggle}
              />
              <span className="text-xs text-gray-500 ml-2">Mark Completed</span>
            </label>
          </div>

          <div className="flex justify-end gap-1">
            <button
              type="button"
              className="rounded-md p-1"
              onClick={handleDelete}
            >
              <TrashIcon
                aria-hidden="true"
                className="w-5 h-5 text-red-400 hover:text-red-500"
              />
            </button>

            <button
              type="button"
              className="rounded-md p-1"
              onClick={handleEdit}
            >
              <PencilSquareIcon
                aria-hidden="true"
                className="w-6 h-6 text-blue-400 hover:text-blue-500"
              />
            </button>
          </div>
        </div>
      </>
    );
  }
);

const TodoItem = React.memo(
  ({
    todo,
    onDelete,
    onToggle,
    onEdit,
    editingTodo,
    setEditingTodo,
  }: TodoItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: todo.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const isEditing = editingTodo?.id === todo.id;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 rounded-xl bg-white shadow flex flex-col justify-between border border-gray-100"
      >
        {isEditing ? (
          <EditTodoForm
            editingTodo={editingTodo}
            setEditingTodo={setEditingTodo}
            onEdit={onEdit}
            todo={todo}
          />
        ) : (
          <StaticTodo
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            setEditingTodo={setEditingTodo}
            attributes={attributes}
            listeners={listeners}
          />
        )}
      </div>
    );
  }
);

export default TodoItem;
