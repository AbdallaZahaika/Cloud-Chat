/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  ExitToApp,
  Chat,
  PersonAdd,
  NotificationsActive,
  Notifications,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUserInfo,
  cheackUser,
  clearUserState,
} from "../store/user/userActions";
import { clearChatListState } from "../store/chatList/chatListActions";
import { clearChatRoomState } from "../store/chatRoom/chatRoomActions";
import { useHistory } from "react-router-dom";
import { RootStore } from "../store";
import { refreshRequestToken } from "../services/http";
import { serverUrl } from "../services/serverUrl.json";
export interface Props {}

const useStyles = makeStyles({
  Box: {
    width: "100%",
    height: 80,
    backgroundColor: "rgb(237,237,237)",
  },
  Avatar: {
    width: 50,
    height: 50,
  },
  marginLeft: {
    marginLeft: 10,
  },
});

const NavBarLeft: React.FC<Props> = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user, userActive } = useSelector((state: RootStore) => state.user);

  React.useEffect(() => {
    const cheack = async () => {
      await dispatch(cheackUser());
      if (userActive) {
        await dispatch(setUserInfo());
      }
    };
    cheack();
  }, [userActive]);
  const handleLogOut = () => {
    dispatch(logout());
    dispatch(cheackUser());
    dispatch(clearUserState());
    dispatch(clearChatListState());
    dispatch(clearChatRoomState());
    refreshRequestToken();
    history.replace("/login");
  };
  return (
    <>
      {userActive ? (
        <Box
          className={classes.Box}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <IconButton
              className={classes.marginLeft}
              component={Link}
              to="/profile"
            >
              <Avatar
                src={user.avatar ? `${serverUrl}${user.avatar}` : ""}
                className={classes.Avatar}
              />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              className={classes.marginLeft}
              component={Link}
              to="/new-chat"
            >
              <Chat fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.marginLeft}
              component={Link}
              to="/add-friend"
            >
              <PersonAdd fontSize="large" />
            </IconButton>
            {user.requestFriend.length ? (
              <IconButton
                className={classes.marginLeft}
                component={Link}
                to="/notifications"
              >
                <NotificationsActive fontSize="large" />
                <Typography variant="body2">
                  {user.requestFriend.length}
                </Typography>
              </IconButton>
            ) : (
              <IconButton
                className={classes.marginLeft}
                component={Link}
                to="/notifications"
              >
                <Notifications fontSize="large" />
              </IconButton>
            )}

            <IconButton className={classes.marginLeft} onClick={handleLogOut}>
              <ExitToApp fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default NavBarLeft;
