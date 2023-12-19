import { derived, writable } from "svelte/store";

export interface TodoItem {
  uuid: string;
  todo: string;
  notes: string;
  completed: boolean;
  created: string;
  modified: string;
  completedAt?: string;
}

export const term = writable("");
export const todos = writable([]);
export const filtered = derived(
  [term, todos],
  ([$term, $todos]) => {
    if ($term.trim() === "") return $todos;
    return $todos.filter((t: TodoItem) => {
      return t.todo.toLowerCase().includes($term.toLowerCase()) ||
        t.notes.toLowerCase().includes($term.toLowerCase()) ||
        t.created.includes($term) ||
        t.modified.includes($term);
    })
  }
)
