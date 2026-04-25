// Jest/Vitest setup file - extends Jest DOM matchers
declare global {
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}
}

import '@testing-library/jest-dom';

// Mock localStorage for tests
class LocalStorageMock {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Reset localStorage before each test
beforeEach(() => {
  window.localStorage.clear();
});