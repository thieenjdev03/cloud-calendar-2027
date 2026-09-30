import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
}
