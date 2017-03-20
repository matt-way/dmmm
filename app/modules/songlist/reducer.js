import { handlers as initHandlers } from './init'
import { handlers as addHandlers } from './add'

const initialState = {}

const handlers = {
  ...initHandlers,
  ...addHandlers
}

export default (state = initialState, action) => {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}
