/* eslint-disable react-hooks/exhaustive-deps */
import SearchBar from "../common/searchBar";
import AddFriendCard from "./AddFriendCard";
import {
  Container,
  makeStyles,
  IconButton,
  Typography,
  Box,
} from "@material-ui/core";

import { ArrowBack } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RootStore } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { serchAddFrind } from "../../store/user/userActions";
import { SEARCH_ADD_FRIEND_SUCCESS } from "../../store/user/userTypes";
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

const AddFriendContainer: React.FC<LeftSideChatsProps> = () => {
  const dispatch = useDispatch();
  const { searchResult } = useSelector((state: RootStore) => state.user);
  const [noResult, setNoResult] = useState<boolean>(false);
  const handelSearch = async (searchValue: string) => {
    const data = await dispatch(serchAddFrind(searchValue));

    if (!data.length) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  };
  useEffect(() => {
    return () => {
      dispatch({
        type: SEARCH_ADD_FRIEND_SUCCESS,
        payload: [],
      });
    };
  }, []);
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
            Add Friend
          </Typography>
          <Box></Box>
        </Box>
      </Box>
      <SearchBar placeholder="Search......" searchV={handelSearch} />
      <Container maxWidth="lg" className={classes.container}>
        {searchResult.length ? (
          searchResult.map((user, i) => (
            <AddFriendCard
              key={i}
              userInfo={{
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
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
                search for new friend
              </Typography>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default AddFriendContainer;
