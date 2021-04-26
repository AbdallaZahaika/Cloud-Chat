import http from "../../services/http";
import { Dispatch } from "redux";
import jwtDecode from "jwt-decode";
import socket from "../socket";

import {
  LOADING_USER,
  FAIL,
  SET_USER_IFNO,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  NEWUSER_SUCCESS,
  CHECK_USER_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  UPDATEUSER_INFO_SUCCESS,
  ADD_FRIEND_SUCCESS,
  userTypes,
  ADDFRIEND,
  LOGIN,
  NEWUSER,
  CHANGEPASSWORD,
  UPDATEUSER,
  SEARCH_ADD_FRIEND_SUCCESS,
  ACCEPT,
  REMOVE_FRIEND_OR_BLOCK,
  DENIED,
  CONFIR_MEMAIL,
  UPLOADIMAGE,
  DELETE_AVATAR,
  SEND_EMAIL_FORGOTEPASSOWRD,
  REST_PASSWROD,
  NotificationAnswerBody,
  GET_FRIENDS_LIST,
  SEARCH_IN_FRIENDS_LIST,
  CLEAR_USER,
  REFRESH_NOTIFICATIONS,
} from "./userTypes";

const tokenKey: string = "tokenKey";
const refreshTokenKey: string = "refreshTokenKey";
const io = socket();
export const setUserInfo = () => async (dispatch: Dispatch<userTypes>) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const { data } = await http.get("/users/me");
    dispatch({
      type: SET_USER_IFNO,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
  }
};

export const login = (dataBody: LOGIN) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const { data } = await http.post("/auth", dataBody);

    dispatch({
      type: LOGIN_SUCCESS,
    });

    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(refreshTokenKey, data.refreshToken);
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const logout = () => async (dispatch: Dispatch<userTypes>) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    dispatch({
      type: LOGOUT_SUCCESS,
    });
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const cheackUser = () => async (dispatch: Dispatch<userTypes>) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const jwt: string = localStorage.getItem(tokenKey) || "";
    dispatch({
      type: CHECK_USER_SUCCESS,
      payload: jwtDecode(jwt),
    });
  } catch (err) {
    dispatch({
      type: CHECK_USER_SUCCESS,
      payload: "",
    });
  }
};

export const newUser = (data: NEWUSER) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const res = await http.post("/users/", data);
    dispatch({
      type: NEWUSER_SUCCESS,
    });
    return res;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const uploadImage = (dataBody: any) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const res = await http.post("/uploadImage", dataBody);
    const data = res.data;
    dispatch({
      type: UPLOADIMAGE,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const deleteAvatar = (avatar: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const res = await http.put("/uploadImage", { avatar });
    const data = res.data;
    dispatch({
      type: DELETE_AVATAR,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const confirmEmail = (token: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const res = await http.put(`/users/confirm-email/${token}`);
    const data = res.data;
    dispatch({
      type: CONFIR_MEMAIL,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const updateUserInfo = (dataBody: UPDATEUSER) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const { data } = await http.put("/users/edit", dataBody);
    dispatch({
      type: UPDATEUSER_INFO_SUCCESS,
      payload: dataBody,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const chagnePassword = (dataBody: CHANGEPASSWORD) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const { data } = await http.put("/users/changePassword", dataBody);
    dispatch({
      type: CHANGE_PASSWORD_SUCCESS,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const sendEmailForgotPassword = (email: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const { data } = await http.put("/users/forgotPassword", { email });
    dispatch({
      type: SEND_EMAIL_FORGOTEPASSOWRD,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });

    return err;
  }
};
export const restPasswrod = (newPassword: string, resetLink: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    const { data } = await http.put("/users/reset-password", {
      resetLink,
      newPassword,
    });
    dispatch({
      type: REST_PASSWROD,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });

    return err;
  }
};

export const addFriend = (dataBody: ADDFRIEND) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    dataBody.token = localStorage.getItem(tokenKey);
    await io.emit("add-friend", dataBody);

    dispatch({
      type: ADD_FRIEND_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const setFriendsList = () => async (dispatch: Dispatch<userTypes>) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const { data } = await http.get("/users/get-friends-list");

    dispatch({
      type: GET_FRIENDS_LIST,
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

export const serchInFrindsList = (searchValue: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const { data } = await http.get(
      `/users/search-in-friend-list/?searchValue=${searchValue}`
    );
    dispatch({
      type: SEARCH_IN_FRIENDS_LIST,
      payload: data.friends ? data.friends : data,
    });
    return data;
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const removeORblock = (
  _id: string,
  answer: "remove" | "blockOrUnblock"
) => async (dispatch: Dispatch<userTypes>) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    let token = localStorage.getItem(tokenKey);
    io.emit("remove-or-block", { _id, answer, token });
    dispatch({
      type: REMOVE_FRIEND_OR_BLOCK,
    });
    return "success";
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};

export const serchAddFrind = (name: string) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    const { data } = await http.get(
      `/users/newFriendsSearch/?searchValue=${name}`
    );
    dispatch({
      type: SEARCH_ADD_FRIEND_SUCCESS,
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

export const answerNotification = (dataBody: NotificationAnswerBody) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });

    if (dataBody.answer) {
      await http.put("/users/requestanswer", dataBody);
      dispatch({
        type: ACCEPT,
      });
    } else {
      await http.put("/users/requestanswer", dataBody);
      dispatch({
        type: DENIED,
      });
    }
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
export const clearUserState = () => async (dispatch: Dispatch<userTypes>) => {
  dispatch({
    type: LOADING_USER,
  });

  dispatch({
    type: CLEAR_USER,
  });

  dispatch({
    type: FAIL,
  });
};

export const refresh_notifications = (dataBody: any) => async (
  dispatch: Dispatch<userTypes>
) => {
  try {
    dispatch({
      type: LOADING_USER,
    });
    dispatch({
      type: REFRESH_NOTIFICATIONS,
      payload: dataBody.requestFriend,
    });
  } catch (err) {
    dispatch({
      type: FAIL,
    });
    return err;
  }
};
