import { useTaskContext } from '../context/TaskContext'

/**
 * Convenience hook that re-exports everything from TaskContext.
 * Can be extended with additional derived state.
 */
export function useTasks() {
  return useTaskContext()
}
