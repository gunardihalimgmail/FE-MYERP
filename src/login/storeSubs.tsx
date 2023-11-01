// contoh redux store (subscribe / listening dan dispatch)

import { combineReducers, configureStore } from '@reduxjs/toolkit'

function todos(state = [], action){
    switch(action.type){
        case 'ADD_TODO':
            return state.concat(action.text);
        default :
            return state
    }   
}

// * lebih dari satu store
let reducers = combineReducers({
    todos
})

// * hanya satu store
export const store = configureStore({reducer: {reducers}})

// export const store = configureStore({ reducer: {todos}})

// store.dispatch({
//     type: "ADD_TODO",
//     text: "Read the docs"
// })

// console.log(store.getState())

// store.dispatch({type:'ADD_TODO', text:'HASIL TOTAL'})