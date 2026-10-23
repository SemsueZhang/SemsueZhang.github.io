import { createContentLoader } from 'vitepress';
import { normalizeTodo, type TodosData } from './.vitepress/utils/todos';

export type { TodoDate, TodoItem, TodoProgress, TodoStep, TodosData } from './.vitepress/utils/todos';

// VitePress 在导入 .data.ts 时提供该运行时导出；此声明供 TypeScript 使用。
export declare const data: TodosData;

export default createContentLoader<TodosData>('todo/**/*.md', {
  transform(entries) {
    const todos = entries
      .filter((entry) => entry.url !== '/todo/')
      .map((entry) => normalizeTodo(entry))
      .filter((todo) => !todo.draft)
      .sort((left, right) => {
        const dateOrder = left.date.timestamp - right.date.timestamp;
        if (dateOrder !== 0) return dateOrder;
        return left.url < right.url ? -1 : left.url > right.url ? 1 : 0;
      });

    return { todos };
  }
});
