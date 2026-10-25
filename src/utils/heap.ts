import { RescueCase } from '../types';

export class BinaryMaxHeap<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  /**
   * @param comparator Returns > 0 if a has higher priority than b,
   *                   < 0 if b has higher priority than a,
   *                   0 if equal.
   */
  constructor(comparator: (a: T, b: T) => number, initialItems?: T[]) {
    this.comparator = comparator;
    if (initialItems && initialItems.length > 0) {
      this.buildHeap(initialItems);
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  public toArray(): T[] {
    return [...this.heap];
  }

  public insert(item: T): void {
    this.heap.push(item);
    this.siftUp(this.heap.length - 1);
  }

  public extractMax(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    const last = this.heap.pop()!;
    this.heap[0] = last;
    this.siftDown(0);
    return max;
  }

  public remove(predicate: (item: T) => boolean): boolean {
    const index = this.heap.findIndex(predicate);
    if (index === -1) return false;

    if (index === this.heap.length - 1) {
      this.heap.pop();
      return true;
    }

    const removedItem = this.heap[index];
    const last = this.heap.pop()!;
    this.heap[index] = last;

    if (this.comparator(last, removedItem) > 0) {
      this.siftUp(index);
    } else {
      this.siftDown(index);
    }
    return true;
  }

  public buildHeap(items: T[]): void {
    this.heap = [...items];
    const startIdx = Math.floor(this.heap.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.comparator(this.heap[current], this.heap[parent]) > 0) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      const leftChild = 2 * current + 1;
      const rightChild = 2 * current + 2;
      let largest = current;

      if (
        leftChild < length &&
        this.comparator(this.heap[leftChild], this.heap[largest]) > 0
      ) {
        largest = leftChild;
      }

      if (
        rightChild < length &&
        this.comparator(this.heap[rightChild], this.heap[largest]) > 0
      ) {
        largest = rightChild;
      }

      if (largest !== current) {
        this.swap(current, largest);
        current = largest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Helper to inspect the tree levels for UI rendering
   */
  public getLevels(): { level: number; nodes: { item: T; index: number; parentIndex: number | null }[] }[] {
    const levels: { level: number; nodes: { item: T; index: number; parentIndex: number | null }[] }[] = [];
    if (this.heap.length === 0) return levels;

    let currentLevel = 0;
    let index = 0;

    while (index < this.heap.length) {
      const nodesInLevel = Math.pow(2, currentLevel);
      const levelNodes: { item: T; index: number; parentIndex: number | null }[] = [];

      for (let i = 0; i < nodesInLevel && index < this.heap.length; i++) {
        const parentIndex = index === 0 ? null : Math.floor((index - 1) / 2);
        levelNodes.push({
          item: this.heap[index],
          index,
          parentIndex,
        });
        index++;
      }

      levels.push({
        level: currentLevel,
        nodes: levelNodes,
      });

      currentLevel++;
    }

    return levels;
  }
}

/**
 * Compares two rescue cases according to the specification:
 * 1. Critical cases must be handled first (higher priorityScore).
 * 2. When priorities are equal, older cases come first (smaller createdAt).
 */
export function compareRescueCases(a: RescueCase, b: RescueCase): number {
  if (a.priorityScore !== b.priorityScore) {
    return a.priorityScore - b.priorityScore;
  }
  // Tie-breaker: older case comes first (smaller timestamp value is older)
  return b.createdAt - a.createdAt;
}

export function priorityToScore(priority: RescueCase['priority']): number {
  switch (priority) {
    case 'Critical':
      return 4;
    case 'High':
      return 3;
    case 'Medium':
      return 2;
    case 'Low':
      return 1;
    default:
      return 1;
  }
}
