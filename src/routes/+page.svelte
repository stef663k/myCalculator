<script lang="ts">
	import { onMount } from 'svelte';
	import wasmUrl from '$lib/assets/zigCalculator.wasm?url';

	let wasmExports: WebAssembly.Exports | null = null;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch(wasmUrl);
			const buffer = await response.arrayBuffer();
			const { instance } = await WebAssembly.instantiate(buffer, {});
			wasmExports = instance.exports;
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		}
	});
</script>

