import { chatListTypes } from "./chatListTypes";
import { CHAT } from "./chatListTypes";

interface DefaultState {
  chatList: Array<CHAT>;
  loding: boolean;
}
const initialState: DefaultState = {
  chatList: [],
  loding: false,
};

const chatListReducer = (
  state: DefaultState = initialState,
  action: chatListTypes
) => {
  switch (action.type) {
    case "FAIL": {
      return { ...state, loding: false };
    }
    case "LOADING_CHATLIST": {
      return {
        ...state,
        loding: true,
      };
    }
    case "CLEAR_CHAT_LIST": {
      return { chatList: [], loding: false };
    }
    case "GETCHATLIST_SUCCESS": {
      return { ...state, loding: false, chatList: action.payload };
    }
    case "DELETECHAT_SUCCESS": {
      return { ...state, loding: false };
    }
    case "NEWCHAT_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }
    case "SEARCH_IN_CHAT_LIST": {
      return {
        ...state,
        loding: false,
        chatList: action.payload,
      };
    }
    case "LEST_MESSAGE_SUCCESS": {
      const data = state.chatList.map((chat) => {
        if (chat.chatInfo._id === action.payload._id) {
          return {
            ...chat,
            chatInfo: {
              ...chat.chatInfo,
              lestMessage: action.payload.message.message,
              timeForTheLastMessage: action.payload.message.date,
            },
          };
        }
        return chat;
      });
      return {
        ...state,
        chatList: data,
      };
    }
    default:
      return { ...state };
  }
};

export default chatListReducer;
