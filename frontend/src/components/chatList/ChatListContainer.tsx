/* eslint-disable react-hooks/exhaustive-deps */
import SearchBar from "../common/searchBar";
import ChatCard from "./ChatCard";
import { Container, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { RootStore } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  search_in_chat_list,
  setChatList,
} from "../../store/chatList/chatListActions";

export interface LeftSideChatsProps {}

const useStyles = makeStyles({
  container: {
    width: "100%",
    margin: 0,
    padding: 0,
    wordBreak: "break-all",
    overflow: "auto",
    height: "77.7vh",
    flex: 1,
  },
});

const ChatListContainer: React.FC<LeftSideChatsProps> = () => {
  const dispatch = useDispatch();
  const { chatList } = useSelector((state: RootStore) => state.chatList);
  const handelSearch = (searchValue: string) => {
    dispatch(search_in_chat_list(searchValue));
  };

  useEffect(() => {
    dispatch(setChatList());
  }, []);

  const classes = useStyles();
  return (
    <>
      <SearchBar placeholder="Search" searchV={handelSearch} />
      <Container maxWidth="lg" className={classes.container}>
        {chatList?.length ? (
          chatList.map((chatCard, i) => (
            <ChatCard key={i} chatCard={chatCard} />
          ))
        ) : (
          <Typography variant="body1" align="center" style={{ marginTop: 5 }}>
            chat not found
          </Typography>
        )}
      </Container>
    </>
  );
};

export default ChatListContainer;
