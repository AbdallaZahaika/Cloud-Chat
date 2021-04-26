/* eslint-disable react-hooks/exhaustive-deps */
import SearchBar from "../common/searchBar";
import NewChatCard from "./NewChatCard";
import {
  Container,
  makeStyles,
  IconButton,
  Typography,
  Box,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { RootStore } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setFriendsList,
  serchInFrindsList,
} from "../../store/user/userActions";
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

const NewChatContainer: React.FC<LeftSideChatsProps> = () => {
  const dispatch = useDispatch();
  const { friendsList, user } = useSelector((state: RootStore) => state.user);
  const [noResult, setNoResult] = useState<boolean>(false);
  useEffect(() => {
    dispatch(setFriendsList());
  }, [user]);
  const handelSearch = async (searchValue: string) => {
    const data = await dispatch(serchInFrindsList(searchValue));
    if (!data.length) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  };
  const classes = useStyles();
  return (
    <>
      <Box
        bgcolor="rgb(0,191,165)"
        width="100%"
        height="50px"
        display="flex"
        alignItems="flex-end"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <IconButton component={Link} to="/">
            <ArrowBack htmlColor="black" />
          </IconButton>
          <Typography
            variant="h6"
            align="center"
            style={{ color: "white", fontWeight: "lighter", marginRight: 30 }}
          >
            New Chat
          </Typography>
          <Box></Box>
        </Box>
      </Box>
      <SearchBar placeholder="Search In Friend List" searchV={handelSearch} />
      <Container maxWidth="lg" className={classes.container}>
        {friendsList.length ? (
          friendsList.map((friend) => (
            <NewChatCard
              key={friend._id}
              friendInfo={{
                _id: friend._id,
                avatar: friend.avatar,
                name: friend.name,
              }}
            />
          ))
        ) : (
          <>
            {noResult ? (
              <Typography
                variant="body1"
                align="center"
                style={{ marginTop: 5 }}
              >
                no Result try another name
              </Typography>
            ) : (
              <Typography
                variant="body1"
                align="center"
                style={{ marginTop: 5 }}
              >
                you don't have a friends
              </Typography>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default NewChatContainer;
