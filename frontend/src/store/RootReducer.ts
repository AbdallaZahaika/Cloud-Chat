import { combineReducers } from "redux";
import chatListReducer from "./chatList/chatListReducer";
import chatReducer from "./chatRoom/chatReducer";
import userReducer from "./user/userReducer";
const RootReducer = combineReducers({
  chatList: chatListReducer,
  chatRoom: chatReducer,
  user: userReducer,
});

export default RootReducer;
