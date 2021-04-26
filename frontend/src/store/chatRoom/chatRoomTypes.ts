/* eslint-disable @typescript-eslint/no-redeclare */
export const LOADING_CHAT_ROOM = "LOADING_CHAT_ROOM";
export const FAIL = "FAIL";
export const SET_CHAT_INFO_SUCCESS = "SET_CHAT_INFO_SUCCESS";
export const CLEAR_ROOM = "CLEAR_ROOM";
export const NEW_MESSAGE = "NEW_MESSAGE";
export const GET_LAST_MESSAGE = "GET_LAST_MESSAGE";
export const CLEAR_CHAT_ROOM = "CLEAR_CHAT_ROOM";
export const SET_FRIEND_STATUS_FROM_SERVER = "SET_FRIEND_STATUS_FROM_SERVER";

export interface DATE {
  time: string;
  day: string | number;
  date: string;
}

export interface MESSAGE {
  message: string;
  date: DATE;
  userId?: string;
}

export interface ChatInfo {
  _id: string;
  messages: Array<MESSAGE>;
}
export interface FriendInfo {
  name: string;
  avatar: string;
  _id: string;
  block?: boolean;
  friendStatus?: boolean;
}

export interface CHAT_ROOM_INFO {
  chatInfo: ChatInfo;
  friendInfo: FriendInfo;
}

export interface LOADING_CHAT_ROOM {
  type: typeof LOADING_CHAT_ROOM;
}
export interface CLEAR_ROOM {
  type: typeof CLEAR_ROOM;
}
export interface FAIL {
  type: typeof FAIL;
}
export interface GET_LAST_MESSAGE {
  type: typeof GET_LAST_MESSAGE;
  payload: MESSAGE;
}
export interface SET_CHAT_INFO_SUCCESS {
  type: typeof SET_CHAT_INFO_SUCCESS;
  payload: CHAT_ROOM_INFO;
}
export interface NEW_MESSAGE {
  type: typeof NEW_MESSAGE;
  payload: MESSAGE;
}
export interface CLEAR_CHAT_ROOM {
  type: typeof CLEAR_CHAT_ROOM;
}
export interface SET_FRIEND_STATUS_FROM_SERVER {
  type: typeof SET_FRIEND_STATUS_FROM_SERVER;
  payload: { _id: string; answer: string };
}
export type chatTypes =
  | LOADING_CHAT_ROOM
  | FAIL
  | SET_CHAT_INFO_SUCCESS
  | CLEAR_ROOM
  | NEW_MESSAGE
  | CLEAR_CHAT_ROOM
  | GET_LAST_MESSAGE
  | SET_FRIEND_STATUS_FROM_SERVER;
