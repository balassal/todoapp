<script lang="ts">
	import EditTodoForm from '$lib/modals/EditTodoForm.svelte';
	import NewTodoForm from '$lib/modals/NewTodoForm.svelte';
	import { todos, type TodoItem, term } from '$lib/todo';
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		initializeStores,
		Modal,
		type ModalComponent,
		type ModalSettings,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { v4 as uuidv4 } from 'uuid';
	import { invoke } from '@tauri-apps/api/tauri';
	import { theme, themes } from '$lib/themes';

	// // Floating UI for Popups
	// import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	// import { storePopup } from '@skeletonlabs/skeleton';
	// storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();

	const modalStore = getModalStore();
	const modalRegistry: Record<string, ModalComponent> = {
		newTodoModal: { ref: NewTodoForm },
		editTodoModal: { ref: EditTodoForm }
	};

	let search: string = '';
	let searchInput;

	$: {
		term.set(search);
		document.body.dataset.theme = $theme;
	}

	function newTodo() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'newTodoModal',
			title: 'Add Todo',
			response: (resp) => {
				if (!resp) return;
				const newTodo: TodoItem = {
					uuid: uuidv4(),
					todo: resp.todo,
					notes: resp.notes,
					completed: false,
					created: new Date().toLocaleString(),
					modified: new Date().toLocaleString()
				};
				$todos = [newTodo, ...$todos];
			}
		};
		modalStore.trigger(modal);
	}

	function saveTodos() {
		const exp = `{"todos": ${JSON.stringify($todos)}, "theme": "${$theme}"}`;
		invoke('save_json', { todos: exp });
		const modal: ModalSettings = {
			type: 'alert',
			title: 'Info',
			body: 'Todos saved!'
		};
		modalStore.trigger(modal);
	}

	function onKeydown(event) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			searchInput.focus();
		} else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'n') {
			event.preventDefault();
			newTodo();
		} else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
			event.preventDefault();
			saveTodos();
		}
	}

	function onSearchKeydown(event) {
		if (event.key.toLowerCase() === 'escape') {
			search = '';
		}
	}

	function themeSelected(event) {
		const newTheme = event.target.value;
		theme.set(newTheme);
	}
</script>

<svelte:window on:keydown={onKeydown} />

<!-- App Shell -->
<Modal components={modalRegistry} />
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">TodoApp</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<input
					class="input"
					type="text"
					placeholder="Ctrl + k or Search"
					bind:value={search}
					bind:this={searchInput}
					on:keydown={onSearchKeydown}
				/>
				<button type="button" class="btn variant-filled-surface btn-sm" on:click={() => newTodo()}>
					<svg xmlns="http://www.w3.org/2000/svg" height="24" width="16" viewBox="0 0 448 512"
						><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
						<path
							d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
						>
						</path></svg
					>
				</button>
				<button
					type="button"
					class="btn variant-filled-warning btn-sm"
					on:click={() => saveTodos()}
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="24" width="16" viewBox="0 0 448 512">
						<!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
							d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
						/></svg
					>
				</button>
				<select class="select" bind:value={$theme} on:change={themeSelected}>
					{#each themes as theme}
						<option value={theme.name}>{theme.title}</option>
					{/each}
				</select>
				<div>
					<LightSwitch />
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
