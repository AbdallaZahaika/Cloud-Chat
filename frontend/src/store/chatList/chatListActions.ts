import http from "../../services/http";
import { Dispatch } from "redux";
import {
  chatListTypes,
  LOADING_CHATLIST,
  GETCHATLIST_SUCCESS,
  FAIL,
  DELETECHAT_SUCCESS,
  NEWCHAT_SUCCESS,
  LEST_MESSAGE_SUCCESS,
  LESTMESSAGE,
  SEARCH_IN_CHAT_LIST,
  CLEAR_CHAT_LIST,
  CHAT,
} from "./chatListTypes";

export const setChatList = () => async (dispatch: Dispatch<chatListTypes>) => {
  try {
    dispatch({
      type: LOADING_CHATLIST,
    });

    const { data } = await http.get("/chat");
    dispatch({
      type: GETCHATLIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
  }
};

export const deleteChat = (_id: string) => async (
  dispatch: Dispatch<chatListTypes>
) => {
  try {
    dispatch({
      type: LOADING_CHATLIST,
    });
    const { data } = await http.delete(`/chat/${_id}`);
    dispatch({
      type: DELETECHAT_SUCCESS,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
//// idUser2 this the friend id
export const newChat = (idUser2: string) => async (
  dispatch: Dispatch<chatListTypes>
) => {
  try {
    dispatch({
      type: LOADING_CHATLIST,
    });

    const { data } = await http.post("/chat/", { idUser2 });
    dispatch({
      type: NEWCHAT_SUCCESS,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const setLastMessageInCard = (data: LESTMESSAGE) => async (
  dispatch: Dispatch<chatListTypes>
) => {
  try {
    dispatch({
      type: LOADING_CHATLIST,
    });
    dispatch({
      type: LEST_MESSAGE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
  }
};
export const clearChatListState = () => async (
  dispatch: Dispatch<chatListTypes>
) => {
  dispatch({
    type: LOADING_CHATLIST,
  });

  dispatch({
    type: CLEAR_CHAT_LIST,
  });

  dispatch({
    type: FAIL,
  });
};

export const search_in_chat_list = (searchValue: string) => async (
  dispatch: Dispatch<chatListTypes>
) => {
  try {
    const { data } = await http.get(
      `/chat/search-in-chat-list/?searchValue=${searchValue}`
    );

    dispatch({
      type: LOADING_CHATLIST,
    });
    dispatch({
      type: SEARCH_IN_CHAT_LIST,
      payload: data,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
