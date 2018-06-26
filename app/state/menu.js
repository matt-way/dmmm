import { createModel } from '../utils/redux-helpers'

const initialState = {
  open: false
}

const { actions, reducer } = createModel('MENU', initialState, {
  open: state => ({
    open: true
  }),
  close: state => ({
    open: false
  })
})

export {
  actions,
  reducer
}