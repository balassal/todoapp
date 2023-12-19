<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { TodoItem } from '$lib/todo';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	const todoMeta: TodoItem = $modalStore[0].meta.todo;
	const formData = {
		todo: todoMeta.todo,
		missingTodo: false,
		notes: todoMeta.notes,
		completed: todoMeta.completed
	};

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	function onFormSubmit(): void {
		if (formData.todo === '') {
			formData.missingTodo = true;
			return;
		}
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	function onTodoChanged() {
		if (formData.todo !== '' && formData.missingTodo) {
			formData.missingTodo = false;
		}
	}

	function onClose() {
		modalStore.close();
	}

	function onKeyDown(event) {
		if (event.key.toLowerCase() === 'escape') {
			event.preventDefault();
			onClose();
		} else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'enter') {
			event.preventDefault();
			onFormSubmit();
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} />

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Todo</span>
				<textarea
					class="textarea"
					rows="4"
					bind:value={formData.todo}
					class:input-error={formData.missingTodo}
					on:input={() => onTodoChanged()}
					placeholder="Enter todo..."
				></textarea>
				<span
					class="float-right mt-0 text-sm"
					class:text-red-500={formData.missingTodo}
					class:text-gray-600={!formData.missingTodo}
				>
					Required
				</span>
			</label>
			<label class="label">
				<span>Notes (optional)</span>
				<textarea class="textarea" rows="3" bind:value={formData.notes} placeholder="Enter notes..."
				></textarea>
			</label>
			<label class="flex items-center space-x-2">
				<input class="checkbox" type="checkbox" bind:checked={formData.completed} />
				<p>Completed?</p>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={onClose}>Cancel (Esc)</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit (Ctrl + Enter)</button>
    </footer>
	</div>
{/if}
