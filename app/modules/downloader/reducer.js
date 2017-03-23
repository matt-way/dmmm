import { handlers } from './actions'

const initialState = {}

export default (state = initialState, action) => {
  const handler = handlers[action.type]
  return handler ? handler(state, action) : state
}
