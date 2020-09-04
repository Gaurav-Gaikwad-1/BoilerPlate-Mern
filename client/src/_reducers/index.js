import { combineReducers } from 'redux';

import user from './chat_reducer';
import chats from './user_reducer';

const rootReducer = combineReducers({
    user,
    chats
})

export default rootReducer;