import { userTypes } from "./userTypes";
import { USER, NEWFRIEND } from "./userTypes";
import socket from "../socket";
import store from "../index";
import { refresh_notifications } from "./userActions";
interface DefaultState {
  user: USER;
  loding: boolean;
  userActive: boolean;
  searchResult: Array<NEWFRIEND>;
  friendsList: Array<NEWFRIEND>;
  errors: any;
}
const initialState: DefaultState = {
  user: {
    name: "",
    avatar: "",
    friends: [],
    _id: "",
    chats: "",
    requestFriend: [
      {
        _id: "0",
        date: { time: "", date: "", day: "" },
        message: "",
        name: "",
        avatar: "",
      },
    ],
  },
  friendsList: [],
  searchResult: [],
  errors: "",
  userActive: false,
  loding: false,
};

const io = socket();

io.on("refresh-notifications", (dataBody) => {
  const { user } = store.getState();
  if (user.user._id === dataBody._id) {
    store.dispatch<any>(refresh_notifications(dataBody));
  }
});

const chatReducer = (state: DefaultState = initialState, action: userTypes) => {
  switch (action.type) {
    case "FAIL": {
      return { ...state, loding: false };
    }

    case "LOADING_USER": {
      return {
        ...state,
        loding: true,
        errors: "",
      };
    }
    case "CLEAR_USER": {
      return {
        user: {
          name: "",
          avatar: "",
          friends: [],
          _id: "",
          chats: "",
          requestFriend: [
            {
              _id: "0",
              date: { time: "", date: "", day: "" },
              message: "",
              name: "",
              avatar: "",
            },
          ],
        },
        friendsList: [],
        searchResult: [],
        errors: "",
        userActive: false,
        loding: false,
      };
    }
    case "NEWUSER_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }
    case "REFRESH_NOTIFICATIONS": {
      return {
        ...state,
        loding: false,
        user: {
          friends: state.user.friends,
          _id: state.user._id,
          chats: state.user.chats,
          requestFriend: [...state.user.requestFriend, action.payload],
          name: state.user.name,
          avatar: state.user.avatar,
        },
      };
    }
    case "UPLOADIMAGE": {
      return {
        ...state,
        loding: false,
      };
    }
    case "DELETE_AVATAR": {
      return {
        ...state,
        loding: false,
      };
    }
    case "CONFIR_MEMAIL": {
      return {
        ...state,
        loding: false,
      };
    }
    case "LOGIN_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }
    case "GET_FRIENDS_LIST": {
      return {
        ...state,
        loding: false,
        friendsList: action.payload,
      };
    }
    case "SEARCH_IN_FRIENDS_LIST": {
      return {
        ...state,
        loding: false,
        friendsList: action.payload,
      };
    }
    case "LOGOUT_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }
    case "SEND_EMAIL_FORGOTEPASSOWRD": {
      return {
        ...state,
        loding: false,
      };
    }
    case "REST_PASSWROD": {
      return {
        ...state,
        loding: false,
      };
    }
    case "CHECK_USER_SUCCESS": {
      return {
        ...state,
        loding: false,
        userActive: Boolean(action.payload),
      };
    }
    case "SET_USER_IFNO": {
      return {
        ...state,
        loding: false,
        user: action.payload,
      };
    }
    case "UPDATEUSER_INFO_SUCCESS": {
      return {
        ...state,
        loding: false,
        user: {
          friends: state.user.friends,
          _id: state.user._id,
          chats: state.user.chats,
          requestFriend: state.user.requestFriend,
          name: action.payload.name,
          avatar: action.payload.avatar,
        },
      };
    }
    case "CHANGE_PASSWORD_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }
    case "ADD_FRIEND_SUCCESS": {
      return {
        ...state,
        loding: false,
      };
    }

    case "SEARCH_ADD_FRIEND_SUCCESS": {
      return {
        ...state,
        loding: false,
        searchResult: action.payload,
      };
    }
    case "ACCEPT": {
      return {
        ...state,
        loding: false,
      };
    }
    case "DENIED": {
      return {
        ...state,
        loding: false,
      };
    }
    case "REMOVE_FRIEND_OR_BLOCK": {
      return {
        ...state,
        loding: false,
      };
    }

    default:
      return { ...state };
  }
};

export default chatReducer;
