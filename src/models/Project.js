/**
 * Project model
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string|null} parentId  - null for top-level projects
 */

export function createProject(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    parentId: null,
    ...overrides,
  }
}
