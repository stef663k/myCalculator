<script lang="ts">
  import { onMount } from 'svelte';
  import { loadCalculator, evaluateExpression, type CalcStatus, type WasmAPI } from '$lib/wasm';

  let wasm: WasmAPI | null = null;
  let error = '';
<<<<<<< HEAD
  let input = '';    
  let answer = '';
  let justEvaluated = false;
=======
  let input = '5 * 3';    
  let answer = '';
>>>>>>> f1ae37561c9d079745ea82f5949466d3c1629013

  onMount(async () => {
    try {
      wasm = await loadCalculator();
    } catch (e: any) {
      error = e.message || e;
    }
  });
<<<<<<< HEAD
  
  function compute() {
    if (!wasm || !input.trim()) return;
    const result = evaluateExpression(wasm, input);
    answer = result;
    justEvaluated = true;
    if (!Number.isNaN(Number(result))) {
      input = result;
    }
  }

  function pressDigit(d: string) {
    if (justEvaluated) {
      input = d;
      answer = '';
      justEvaluated = false;
    } else {
      input += d;
    }
  }

  function pressDot() {
    if (justEvaluated) {
      input = '0.';
      answer = '';
      justEvaluated = false;
      return;
    }
    input += '.';
  }

  function pressOp(op: string) {
    if (!input.trim()) return;
    justEvaluated = false;
    if (/\s[+\-*/]\s$/.test(input)) {
      input = input.slice(0, -3);
    }
    input += ` ${op} `;
  }

  function pressUnary(fn: 'sin' | 'cos' | 'tan' | 'sqrt') {
    const value = input.trim() || '0';
    input = `${fn} ${value}`;
    compute();
  }

  function clearAll() {
    input = '';
    answer = '';
    justEvaluated = false;
  }
</script>
{#if error}
  <p style="color:red">Load error: {error}</p>
{:else if !wasm}
  <p>Loading WASM…</p>
{:else}
  <div class="page">
    <div class="calculator">
      <div class="calc-header">
        <h1>Zig Calculator</h1>
        <span class="chip">WASM</span>
      </div>

      <div class="display">
        <div class="expression">{input || '0'}</div>
        <div class="result">{answer}</div>
      </div>

      <div class="buttons">
        <button class="btn fn" on:click={clearAll}>AC</button>
        <button class="btn fn" on:click={() => pressUnary('sqrt')}>√</button>
        <button class="btn fn" on:click={() => pressUnary('sin')}>sin</button>
        <button class="btn fn" on:click={() => pressUnary('cos')}>cos</button>

        <button class="btn" on:click={() => pressDigit('7')}>7</button>
        <button class="btn" on:click={() => pressDigit('8')}>8</button>
        <button class="btn" on:click={() => pressDigit('9')}>9</button>
        <button class="btn op" on:click={() => pressOp('/')}>÷</button>

        <button class="btn" on:click={() => pressDigit('4')}>4</button>
        <button class="btn" on:click={() => pressDigit('5')}>5</button>
        <button class="btn" on:click={() => pressDigit('6')}>6</button>
        <button class="btn op" on:click={() => pressOp('*')}>×</button>

        <button class="btn" on:click={() => pressDigit('1')}>1</button>
        <button class="btn" on:click={() => pressDigit('2')}>2</button>
        <button class="btn" on:click={() => pressDigit('3')}>3</button>
        <button class="btn op" on:click={() => pressOp('-')}>−</button>

        <button class="btn wide" on:click={() => pressDigit('0')}>0</button>
        <button class="btn" on:click={pressDot}>.</button>
        <button class="btn op" on:click={() => pressOp('+')}>+</button>
        <button class="btn equals" on:click={compute}>=</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    color: black;
    padding: 1.5rem;
    box-sizing: border-box;
  }

  .calculator {
    width: 320px;
    border-radius: 1.5rem;
    padding: 1.25rem 1.25rem 1.5rem;
    background: linear-gradient(145deg, #111827 0%, #020617 60%, #0b1120 100%);
    box-shadow:
      0 18px 45px rgba(0, 0, 0, 0.75),
      0 0 0 1px rgba(148, 163, 184, 0.12);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  }

  .calc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .calc-header h1 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9ca3af;
    margin: 0;
  }

  .chip {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    background: rgba(56, 189, 248, 0.12);
    color: #67e8f9;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    border: 1px solid rgba(56, 189, 248, 0.4);
  }

  .display {
    border-radius: 1rem;
    padding: 0.75rem 0.9rem;
    background: radial-gradient(circle at top left, #111827 0, #020617 45%, #000 100%);
    box-shadow:
      inset 0 0 0 1px rgba(15, 23, 42, 0.85),
      inset 0 16px 40px rgba(15, 23, 42, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    min-height: 72px;
  }

  .expression {
    font-size: 0.8rem;
    color: #6b7280;
    min-height: 1.2em;
    word-break: break-all;
  }

  .result {
    font-size: 1.7rem;
    font-weight: 500;
    color: #f9fafb;
    min-height: 1.4em;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .btn {
    border: none;
    border-radius: 999px;
    padding: 0.6rem 0.4rem;
    font-size: 1rem;
    font-weight: 500;
    color: #e5e7eb;
    background: radial-gradient(circle at top, #111827 0, #020617 70%);
    box-shadow:
      0 3px 0 rgba(15, 23, 42, 0.9),
      0 0 0 1px rgba(15, 23, 42, 0.9);
    cursor: pointer;
    transition:
      transform 0.08s ease,
      box-shadow 0.08s ease,
      background 0.15s ease,
      color 0.15s ease;
  }

  .btn:active {
    transform: translateY(1px);
    box-shadow:
      0 1px 0 rgba(15, 23, 42, 0.9),
      0 0 0 1px rgba(15, 23, 42, 0.9);
    background: radial-gradient(circle at top, #020617 0, #020617 70%);
  }

  .btn.fn {
    background: radial-gradient(circle at top, #1f2937 0, #020617 70%);
    color: #bfdbfe;
  }

  .btn.op {
    background: radial-gradient(circle at top, #f97316 0, #ea580c 40%, #b45309 100%);
    color: #fff7ed;
    box-shadow:
      0 3px 0 rgba(124, 45, 18, 0.9),
      0 0 0 1px rgba(248, 250, 252, 0.04);
  }

  .btn.op:active {
    background: radial-gradient(circle at top, #ea580c 0, #c2410c 60%, #9a3412 100%);
  }

  .btn.equals {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 40%, #15803d 100%);
    color: #ecfdf5;
    box-shadow:
      0 3px 0 rgba(22, 101, 52, 0.95),
      0 0 0 1px rgba(187, 247, 208, 0.18);
  }

  .btn.equals:active {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 55%, #166534 100%);
  }

  .btn.wide {
    grid-column: span 2;
    text-align: left;
    padding-left: 0.9rem;
  }

  .btn:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    .calculator {
      width: 100%;
      max-width: 360px;
    }
  }
</style>
=======
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
>>>>>>> f1ae37561c9d079745ea82f5949466d3c1629013
