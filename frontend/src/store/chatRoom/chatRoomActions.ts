import { Dispatch } from "redux";
import {
  LOADING_CHAT_ROOM,
  FAIL,
  SET_CHAT_INFO_SUCCESS,
  chatTypes,
  FriendInfo,
  NEW_MESSAGE,
  MESSAGE,
  GET_LAST_MESSAGE,
  CLEAR_CHAT_ROOM,
  SET_FRIEND_STATUS_FROM_SERVER,
} from "./chatRoomTypes";
import socket from "../socket";
const io = socket();
export const setChatInfo = (friendInfo: FriendInfo) => async (
  dispatch: Dispatch<chatTypes>
) => {
  try {
    dispatch({
      type: LOADING_CHAT_ROOM,
    });
    let token = localStorage.getItem("tokenKey");
    io.emit("get-room-info", {
      friendId: friendInfo._id,
      token,
    });
    io.on("output-room-info", (data) => {
      const { chatInfo, blockStatus, friendStatus } = data;
      friendInfo.block = blockStatus;
      friendInfo.friendStatus = friendStatus;
      dispatch({
        type: SET_CHAT_INFO_SUCCESS,
        payload: { chatInfo, friendInfo },
      });
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
  }
};

export const newMessage = (_id: string, message: MESSAGE) => async (
  dispatch: Dispatch<chatTypes>
) => {
  let token = localStorage.getItem("tokenKey");
  io.emit("new-message", { message, _id, token });

  try {
    dispatch({
      type: LOADING_CHAT_ROOM,
    });

    dispatch({
      type: NEW_MESSAGE,
      payload: message,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const letMessage = (message: MESSAGE) => async (
  dispatch: Dispatch<chatTypes>
) => {
  try {
    dispatch({
      type: LOADING_CHAT_ROOM,
    });

    dispatch({
      type: GET_LAST_MESSAGE,
      payload: message,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const clearChatRoomState = () => async (
  dispatch: Dispatch<chatTypes>
) => {
  dispatch({
    type: LOADING_CHAT_ROOM,
  });

  dispatch({
    type: CLEAR_CHAT_ROOM,
  });

  dispatch({
    type: FAIL,
  });
};

export const set_friend_status_from_server = (dataBody: {
  _id: string;
  answer: string;
}) => async (dispatch: Dispatch<chatTypes>) => {
  try {
    dispatch({
      type: LOADING_CHAT_ROOM,
    });
    dispatch({
      type: SET_FRIEND_STATUS_FROM_SERVER,
      payload: dataBody,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
