<script lang="ts">
  import { onMount } from 'svelte';
  import { loadCalculator, evaluateExpression, type CalcStatus, type WasmAPI } from '$lib/wasm';

  let wasm: WasmAPI | null = null;
  let error = '';
  let input = '5 * 3';    
  let answer = '';

  onMount(async () => {
    try {
      wasm = await loadCalculator();
    } catch (e: any) {
      error = e.message || e;
    }
  });
  function compute() {
    if (!wasm) return;
    answer = evaluateExpression(wasm, input);
  }
</script>
<h1>Zig Calculator (WASM)</h1>
{#if error}
  <p style="color:red">Load error: {error}</p>
{:else if wasm}
  <input bind:value={input} placeholder="e.g. 5 * 3 or sin 1.2" />
  <button on:click={compute}>=</button>
  <p>Result: <strong>{answer}</strong></p>
{:else}
  <p>Loading WASM…</p>
{/if}