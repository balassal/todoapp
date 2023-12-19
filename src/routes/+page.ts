import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { invoke } from '@tauri-apps/api/tauri';
import { todos } from "$lib/todo";
import { theme } from "$lib/themes";

export const load: PageLoad = () => {
  invoke("load_json").then((message: any) => {
    const todoData = JSON.parse(message);
    todos.set(todoData.todos);
    theme.set(todoData.theme);
  });

  error(404, "Not Found");
}