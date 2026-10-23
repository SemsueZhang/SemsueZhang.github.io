export interface TodoStep {
  text: string;
  done: boolean;
}

export interface TodoDate {
  value: string;
  timestamp: number;
  label: string;
}

export interface TodoProgress {
  completed: number;
  total: number;
  percent: number;
}

export interface TodoItem {
  url: string;
  title: string;
  date: TodoDate;
  duration: string;
  steps: TodoStep[];
  progress: TodoProgress;
  example: boolean;
  draft: boolean;
  layout: 'todo';
}

export interface TodosData {
  todos: TodoItem[];
}

type FrontmatterRecord = Record<string, unknown>;

function invalidTodo(source: string, message: string): never {
  throw new Error(`[todos] 计划 ${source}：${message}`);
}

function asRecord(value: unknown, source: string): FrontmatterRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return invalidTodo(source, 'frontmatter 必须是对象。');
  }

  return value as FrontmatterRecord;
}

function requiredString(data: FrontmatterRecord, field: string, source: string): string {
  const value = data[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    return invalidTodo(source, `字段 ${field} 必须是非空字符串。`);
  }

  return value.trim();
}

function optionalBoolean(data: FrontmatterRecord, field: string, source: string): boolean {
  const value = data[field];
  if (value === undefined) return false;
  if (typeof value !== 'boolean') {
    return invalidTodo(source, `字段 ${field} 必须为 true 或 false。`);
  }

  return value;
}

function parseDate(value: unknown, source: string): TodoDate {
  // YAML 会自动纠正未加引号的无效日期；要求字符串以保留原值并严格校验。
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return invalidTodo(source, "字段 date 必须是带引号的 YYYY-MM-DD 字符串，例如 '2026-10-23'。");
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  const timestamp = parsed.getTime();
  if (
    !Number.isFinite(timestamp) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return invalidTodo(source, `字段 date 不是有效日期：${value}。`);
  }

  return { value, timestamp, label: `${year} 年 ${month} 月 ${day} 日` };
}

function parseSteps(value: unknown, source: string): TodoStep[] {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidTodo(source, '字段 steps 必须是至少包含一项的清单。');
  }

  return value.map((step, index) => {
    const field = `steps 的第 ${index + 1} 项`;
    if (typeof step !== 'object' || step === null || Array.isArray(step)) {
      return invalidTodo(source, `${field} 必须包含 text 和 done。`);
    }

    const record = step as FrontmatterRecord;
    if (typeof record.text !== 'string' || record.text.trim().length === 0) {
      return invalidTodo(source, `${field}的 text 必须是非空字符串。`);
    }
    if (typeof record.done !== 'boolean') {
      return invalidTodo(source, `${field}的 done 必须为 true 或 false。`);
    }

    return { text: record.text.trim(), done: record.done };
  });
}

export function getTodoProgress(steps: readonly TodoStep[]): TodoProgress {
  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round(completed / total * 100)
  };
}

export function normalizeTodo(entry: { url: string; frontmatter: unknown }): TodoItem {
  const source = entry.url;
  const data = asRecord(entry.frontmatter, source);
  if (data.layout !== 'todo') {
    return invalidTodo(source, '字段 layout 必须为 todo。');
  }

  const steps = parseSteps(data.steps, source);
  return {
    url: source,
    title: requiredString(data, 'title', source),
    date: parseDate(data.date, source),
    duration: requiredString(data, 'duration', source),
    steps,
    progress: getTodoProgress(steps),
    example: optionalBoolean(data, 'example', source),
    draft: optionalBoolean(data, 'draft', source),
    layout: 'todo'
  };
}
