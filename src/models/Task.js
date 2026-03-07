/**
 * Task model
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} links
 * @property {string} notes
 * @property {string|null} projectId
 * @property {string|null} dueDate  - ISO date string
 * @property {'todo'|'in-progress'|'done'} status
 * @property {string} createdAt - ISO date string
 */

export function createTask(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    links: [],
    notes: '',
    projectId: null,
    dueDate: null,
    status: 'todo',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}
