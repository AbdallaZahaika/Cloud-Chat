import { chatTypes, MESSAGE } from "./chatRoomTypes";
import { CHAT_ROOM_INFO } from "./chatRoomTypes";
import { letMessage, set_friend_status_from_server } from "./chatRoomActions";
import { setLastMessageInCard } from "../chatList/chatListActions";
import socket from "../socket";
import store from "../index";
interface DefaultState {
  room: CHAT_ROOM_INFO;
  loding: boolean;
}
const initialState: DefaultState = {
  room: {
    chatInfo: { _id: "", messages: [] },
    friendInfo: {
      name: "",
      avatar: "",
      _id: "",
      block: false,
      friendStatus: false,
    },
  },
  loding: false,
};

const io = socket();
///// _id this the room Id
io.on("message-output", (dataBody: { _id: string; message: MESSAGE }) => {
  const { user, chatRoom } = store.getState();

  store.dispatch<any>(setLastMessageInCard(dataBody));
  if (dataBody.message.userId === user.user._id) {
    return;
  }
  if (chatRoom.room.chatInfo._id === dataBody._id) {
    store.dispatch<any>(letMessage(dataBody.message));
  }
});

io.on("refresh-friend-status", (dataBody) => {
  const { chatRoom } = store.getState();
  if (chatRoom.room.friendInfo._id === dataBody._id) {
    store.dispatch<any>(set_friend_status_from_server(dataBody));
  }
});

const chatReducer = (state: DefaultState = initialState, action: chatTypes) => {
  switch (action.type) {
    case "FAIL": {
      return { ...state, loding: false };
    }
    case "LOADING_CHAT_ROOM": {
      return {
        ...state,
        loding: true,
      };
    }
    case "SET_CHAT_INFO_SUCCESS": {
      return { ...state, room: action.payload, loding: false };
    }
    case "CLEAR_CHAT_ROOM": {
      return { room: initialState.room, loding: false };
    }
    case "CLEAR_ROOM": {
      return {
        ...state,
        room: {
          chatInfo: { _id: "", messages: [] },
          friendInfo: {
            name: "",
            avatar: "",
            _id: "",
          },
        },
        loding: false,
      };
    }
    case "NEW_MESSAGE": {
      return {
        ...state,
        room: {
          ...state.room,
          chatInfo: {
            ...state.room.chatInfo,
            messages: [...state.room.chatInfo.messages, action.payload],
          },
        },
        loding: false,
      };
    }
    case "GET_LAST_MESSAGE": {
      return {
        ...state,
        room: {
          ...state.room,
          chatInfo: {
            ...state.room.chatInfo,
            messages: [...state.room.chatInfo.messages, action.payload],
          },
        },
        loding: false,
      };
    }
    case "SET_FRIEND_STATUS_FROM_SERVER": {
      return {
        ...state,
        room: {
          ...state.room,
          friendInfo: {
            ...state.room.friendInfo,
            block:
              action.payload.answer === "blockOrUnblock"
                ? !state.room.friendInfo.block
                : state.room.friendInfo.block,
            friendStatus:
              action.payload.answer === "remove"
                ? !state.room.friendInfo.friendStatus
                : state.room.friendInfo.friendStatus,
          },
        },
        loding: false,
      };
    }

    default:
      return { ...state };
  }
};

export default chatReducer;
