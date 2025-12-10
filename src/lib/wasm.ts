export type CalcStatus = 0 | 1 | 2 | 3;

export interface WasmAPI {
  memory: WebAssembly.Memory;
  calc: (opPtr: number, opLen: number, a: number, b: number, out: number) => CalcStatus;
  calc_modulo: (a: number, b: number, out: number) => CalcStatus;
  calc_divide: (a: number, b: number, out: number) => CalcStatus;
  calc_sin: (x: number) => number;
  calc_cos: (x: number) => number;
  calc_tan: (x: number) => number;
  calc_asin: (x: number, out: number) => CalcStatus;
  calc_acos: (x: number, out: number) => CalcStatus;
  calc_atan: (x: number) => number;
  calc_atan2: (y: number, x: number) => number;
  calc_hypot: (x: number, y: number) => number;
  calc_expm1: (x: number) => number;
  calc_sqrt: (x: number, out: number) => CalcStatus;
}

export async function loadCalculator(path = '/zigCalculator.wasm'): Promise<WasmAPI> {
  const response = await fetch(path);

  if ('instantiateStreaming' in WebAssembly) {
    try {
      const { instance } = await WebAssembly.instantiateStreaming(response.clone(), {});
      return instance.exports as unknown as WasmAPI;
    } catch (err) {
      console.warn('Failed to instantiate streaming; retrying with arrayBuffer', err);
    }
  }

  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, {});
  return instance.exports as unknown as WasmAPI;
}

const encoder = new TextEncoder();
const SCRATCH = 0;

function writeStr(wasm: WasmAPI, s: string): [ptr: number, len: number] {
  const bytes = encoder.encode(s);
  const need = bytes.length + (8 - (bytes.length & 7));
  const pages = Math.ceil(need / 65536);
  if (pages > 0) wasm.memory.grow(pages);
  const mem = new Uint8Array(wasm.memory.buffer);
  const off = wasm.memory.buffer.byteLength - need;
  mem.set(bytes, off);
  return [off, bytes.length];
}

function readF64(wasm: WasmAPI, ptr: number): number {
  return new Float64Array(wasm.memory.buffer, ptr, 1)[0];
}

export function evaluateExpression(wasm: WasmAPI, input: string): string {
  const tokens = input.trim().split(/\s+/);
  if (tokens.length === 3) {
    const a = Number(tokens[0]);
    const op = tokens[1];
    const b = Number(tokens[2]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 'Bad number';
    const outPtr = 8;
    const [opPtr, opLen] = writeStr(wasm, op);
    const status = wasm.calc(opPtr, opLen, a, b, outPtr);
    if (status === 0) return String(readF64(wasm, outPtr));
    return ['ok', 'bad op', '÷0', 'domain'][status] ?? 'error';
  }

  if (tokens.length === 2 && tokens[0] === 'sin') {
    return String(wasm.calc_sin(Number(tokens[1])));
  }
  if (tokens.length === 2 && tokens[0] === 'cos') {
    return String(wasm.calc_cos(Number(tokens[1])));
  }
  if (tokens.length === 2 && tokens[0] === 'tan') {
    return String(wasm.calc_tan(Number(tokens[1])));
  }
  if (tokens.length === 2 && tokens[0] === 'sqrt') {
    const x = Number(tokens[1]);
    const out = 8;
    const st = wasm.calc_sqrt(x, out);
    return st === 0 ? String(readF64(wasm, out)) : 'domain';
  }

  return 'Usage: 3 + 4   OR  sin 1.2   OR  sqrt 2 …';
}
