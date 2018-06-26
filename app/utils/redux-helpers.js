/**
 * Utilities for helping with reducing redux boilerplate
 */

const createModel = (prefix, initialState, actionHandlers) => {

  const constants = {}
  const actions = {}
  const handlers = {}

  Object.keys(actionHandlers).forEach(name => {
    // setup the action constant naming
    const constant = `${prefix}_${name}`
    constants[constant] = constant

    // this is the args plus handler function given in definition
    var args = actionHandlers[name]
    
    // set the handler to the provided function
    if(Array.isArray(args)){
      handlers[constant] = args.pop()
    }else{
      handlers[constant] = args
      args = []
    }
    
    // build the exportable action
    // NOTE: type and arg checking could be added here
    actions[name] = (...values) => {
      const payload = {
        type: constant
      }
      args.forEach((a, i) => payload[a] = values[i])
      return payload
    }
  })

  const reducer = (state = initialState, action) => {
    const handler = handlers[action.type]
    return handler ? handler(state, action) : state
  }

  return {
    constants,
    actions,
    handlers,
    reducer
  }
}

export {
  createModel
}