import React from "react";
import { Container, Box, Typography } from "@material-ui/core";
import { MESSAGE } from "../../store/chatList/chatListTypes";
import { useSelector } from "react-redux";
import { RootStore } from "../../store";
import getDate from "../../services/date";
import { makeStyles } from "@material-ui/core";

export interface ChatProps {
  messages: Array<MESSAGE>;
}
const Chat: React.FC<ChatProps> = ({ messages }) => {
  const { user } = useSelector((state: RootStore) => state.user);
  const useStyles = makeStyles({
    container: {
      flex: 1,
      display: "inline-flex",
      flexDirection: "column-reverse",
      overflowY: "auto",
      padding: "5px 0px 5px 0px",
      wordBreak: "break-all",
    },
    message: {
      fontFamily: "system-ui",
      fontSize: 17,
      paddingRight: 18,
      fontWeight: 0,
    },
  });
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box>
        {messages.length
          ? messages.map((message, i) => (
              <Box
                marginBottom="12px"
                padding="0px 9% 0px 9%"
                style={{
                  textAlign: user._id === message.userId ? "end" : "start",
                  marginTop: 5,
                }}
                key={i}
              >
                <Box
                  minWidth="90px"
                  minHeight="50px"
                  padding="6px 9px 8px 7px"
                  borderRadius="7px"
                  display="inline-flex"
                  flexDirection="column"
                  maxWidth="60%"
                  style={{
                    backgroundColor:
                      user._id === message.userId ? "#DCF8C6" : "#fff",
                  }}
                >
                  <Typography variant="body2" className={classes.message}>
                    {message.message}
                  </Typography>
                  <Box
                    padding="3px 0px 3px 0px"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <small>{getDate("return-date", message.date)}</small>
                  </Box>
                </Box>
              </Box>
            ))
          : ""}
      </Box>
    </Container>
  );
};

export default Chat;
