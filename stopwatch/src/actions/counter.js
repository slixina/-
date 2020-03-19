import {
  ADD,
  CLEAR,
} from '../constants/counter'

export const add = () => {
  return {
    type: ADD
  }
}
export const clear = () => {
  return {
    type: CLEAR
  }
}

