<script lang="ts">
	import { filtered, todos, type TodoItem } from '$lib/todo';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	function removeTodo(uuid: string) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: 'Are you sure to remove todo?',
			response: (r: boolean) => {
				if (r) {
					const newTodos = $todos.filter((t) => t.uuid !== uuid);
					$todos = newTodos;
				}
			}
		};
		modalStore.trigger(modal);
	}

	function editTodo(uuid: string) {
		const todo = $todos.find((t) => t.uuid === uuid);
		if (todo) {
			const modal: ModalSettings = {
				type: 'component',
				component: 'editTodoModal',
				title: 'Edit Todo',
				meta: { todo: todo },
				response: (resp) => {
					if (resp) {
						todos.update((items) => {
							const findTodo = items.find((t) => t.uuid === todo.uuid);
							if (findTodo) {
								findTodo.todo = resp.todo;
								findTodo.notes = resp.notes;
								findTodo.completed = resp.completed;
								findTodo.modified = new Date().toLocaleString();

								if (resp.completed === true) {
									findTodo.completedAt = new Date().toLocaleString();
								}
							}
							return items;
						});
					}
				}
			};
			modalStore.trigger(modal);
		}
	}

	function completeTodo(uuid: string) {
		const newTodos: TodoItem[] = JSON.parse(JSON.stringify($todos));
		newTodos.forEach((t) => {
			if (t.uuid === uuid) {
				t.completed = true;
				t.completedAt = new Date().toLocaleString();
			}
		});
		todos.set(newTodos);
	}

	function unCompleteTodo(uuid: string) {
		const newTodos: TodoItem[] = JSON.parse(JSON.stringify($todos));
		newTodos.forEach((t) => {
			if (t.uuid === uuid) {
				t.completed = false;
			}
		});
		todos.set(newTodos);
	}
</script>

<div class="h-full mx-auto justify-center">
	<div class="text-center flex flex-col mt-4 px-8">
		{#each $filtered as todo}
			{#if !todo.completed}
				<div class="card mb-6">
					<section class="p-4">
						<div class="text-left" style="white-space: pre-line;">
							{todo.todo}
						</div>
						{#if todo.notes && todo.notes !== ''}
							<hr class="my-4" />
							<div class="mt-2 italic justify-start text-left" style="white-space: pre-line;">
								{todo.notes}
							</div>
						{/if}
					</section>
					<footer class="card-footer">
						<div class="flex justify-between items-center mt-2 text-sm">
							<div class="flex item-center space-x-4">
								<div class="flex">
									<span class="italic">Created:</span>
									<span class="ml-3 text-gray-400">{todo.created}</span>
								</div>
								<div class="flex">
									<span class="italic">Last modified:</span>
									<span class="ml-3 text-gray-400">{todo.modified}</span>
								</div>
								{#if todo.completedAt && todo.completedAt != ''}
									<div class="flex">
										<span class="italic">Completed At:</span>
										<span class="ml-3 text-gray-400">{todo.completedAt}</span>
									</div>
								{/if}
							</div>
							<div class="flex space-x-6">
								<button type="button" on:click={() => completeTodo(todo.uuid)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										data-slot="icon"
										class="w-8 h-8 text-green-500"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m4.5 12.75 6 6 9-13.5"
										/>
									</svg>
								</button>
								<button type="button" on:click={() => editTodo(todo.uuid)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-8 h-8 text-amber-500 cursor-pointer"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
										/>
									</svg>
								</button>
								<button type="button" on:click={() => removeTodo(todo.uuid)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-8 h-8 text-red-600 cursor-pointer"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</button>
							</div>
						</div>
					</footer>
				</div>
			{/if}
		{/each}
		<hr class="my-2" />
		<h3 class="h3 mb-4 text-center">Completed</h3>
		{#each $filtered as todo}
			{#if todo.completed}
				<div class="card mb-6">
					<section class="p-4">
						<div class="text-left" style="white-space: pre-line;">
							{todo.todo}
						</div>
						{#if todo.notes && todo.notes !== ''}
							<hr class="my-4" />
							<div class="mt-2 italic justify-start text-left" style="white-space: pre-line;">
								{todo.notes}
							</div>
						{/if}
					</section>
					<footer class="card-footer">
						<div class="flex justify-between items-center mt-2 text-sm">
							<div class="flex item-center space-x-4">
								<div class="flex">
									<span class="italic">Created:</span>
									<span class="ml-3 text-gray-400">{todo.created}</span>
								</div>
								<div class="flex">
									<span class="italic">Last modified:</span>
									<span class="ml-3 text-gray-400">{todo.modified}</span>
								</div>
								{#if todo.completedAt && todo.completedAt != ''}
									<div class="flex">
										<span class="italic">Completed At:</span>
										<span class="ml-3 text-gray-400">{todo.completedAt}</span>
									</div>
								{/if}
							</div>
							<div class="flex space-x-6">
								<button type="button" on:click={() => unCompleteTodo(todo.uuid)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										data-slot="icon"
										class="w-8 h-8 text-gray-500"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m4.5 18.75 7.5-7.5 7.5 7.5"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m4.5 12.75 7.5-7.5 7.5 7.5"
										/>
									</svg>
								</button>
								<button type="button" on:click={() => removeTodo(todo.uuid)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-8 h-8 text-red-600 cursor-pointer"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</button>
							</div>
						</div>
					</footer>
				</div>
			{/if}
		{/each}
	</div>
</div>
