import NotificationCard from "./NotificationCard";
import {
  Container,
  makeStyles,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React from "react";
import { RootStore } from "../../store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ADDFRIEND } from "../../store/user/userTypes";

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

const NotificationsContainer: React.FC<LeftSideChatsProps> = () => {
  // const dispatch = useDispatch();
  const userState = useSelector((state: RootStore) => state.user);

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
            Notifications
          </Typography>
          <Box></Box>
        </Box>
      </Box>
      <Container maxWidth="lg" className={classes.container}>
        {userState.user.requestFriend.length
          ? userState.user.requestFriend.map(
              (requestFriend: ADDFRIEND, i: number) => (
                <NotificationCard
                  key={i}
                  requestFriendInfo={{
                    _id: requestFriend._id,
                    name: requestFriend.name,
                    avatar: requestFriend.avatar,
                    date: requestFriend.date,
                    message: requestFriend.message,
                  }}
                />
              )
            )
          : ""}
      </Container>
    </>
  );
};

export default NotificationsContainer;
