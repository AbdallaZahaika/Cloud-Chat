import Chat from "./Chat";
import NavBarRight from "./NavBarRight";
import FooterChat from "./FooterChat";
import React from "react";
import { RootStore } from "../../store";
import { useSelector } from "react-redux";
import { Typography, Box } from "@material-ui/core";
import { CloudCircle } from "@material-ui/icons";

export interface ChatContainerProps {}

const ChatContainer: React.FC<ChatContainerProps> = () => {
  const { room } = useSelector((state: RootStore) => state.chatRoom);
  const { userActive } = useSelector((state: RootStore) => state.user);

  return (
    <>
      {room.chatInfo._id && userActive ? (
        <>
          <NavBarRight />
          <Chat messages={room.chatInfo.messages} />
          {room.friendInfo.block || !room.friendInfo.friendStatus ? (
            <Box
              width="100%"
              bgcolor="#fff"
              display="flex"
              justifyContent="center"
              height="60px"
            >
              <Typography
                align="center"
                variant="h4"
                style={{ fontWeight: "bold" }}
                color="error"
              >
                {!room.friendInfo.friendStatus
                  ? "YOU ARE NOT FRIENDS"
                  : "USER BLOCKED"}
              </Typography>
            </Box>
          ) : (
            <FooterChat _id={room.chatInfo._id} />
          )}
        </>
      ) : (
        <Box
          height="93vh"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
        >
          <CloudCircle
            fontSize="large"
            style={{ fontSize: 150, marginTop: 10 }}
          />

          <Typography variant="h3"> Welcome To ClodChat</Typography>
          <Box
            display="flex"
            mt={5}
            flexDirection="column"
            width="100%"
            justifyContent="space-around"
            ml={2}
            height="70vh"
          >
            <Box>
              <Typography variant="h4">About Us:</Typography>
              <ul
                style={{
                  marginLeft: "14px",
                }}
              >
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    This web-application was built by two students as full stack
                    developer
                  </Typography>
                </li>

                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    this web-appliction is for lerning only
                  </Typography>
                </li>

                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    We mostly learned how to work in a team
                  </Typography>
                </li>
              </ul>
            </Box>
            <Box>
              <Typography variant="h4">About the web-application:</Typography>
              <ul style={{ marginLeft: "14px" }}>
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    The web-appliction is not responsive (will be soon)
                  </Typography>
                </li>
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    to use in this appliction you need to sigUp and verify your
                    email
                  </Typography>
                </li>
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    you can add a new friend that signUp and you can talk with
                    them
                  </Typography>
                </li>
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    The messages you send are encrypted
                  </Typography>
                </li>
                <li style={{ marginTop: 5 }}>
                  <Typography variant="h5">
                    When you receive a friend request you get a notification in
                    the application
                  </Typography>
                </li>
              </ul>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatContainer;
