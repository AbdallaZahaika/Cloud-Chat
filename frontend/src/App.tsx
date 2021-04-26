import { Box, Container, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import ChatContainer from "./components/chatRoom/ChatContainer";
import NavBarLeft from "./components/NavBarLeft";
import ChatListContainer from "./components/chatList/ChatListContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";
import NotificationsContainer from "./components/notifications/NotificationsContainer";
import NewChatContainer from "./components/newChat/NewChatContainer";
import AddFriendContainer from "./components/addFriend/AddFriendContainer";
import Settings from "./components/settings/Settings";
import ChangePassWord from "./components/settings/ChangePassword";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ConfirmEmail from "./components/ConfirmEmail";
import SendForgotPassowrdEmail from "./components/forgotPassword/SendForgotPassowrdEmail";
import ResetPassword from "./components/forgotPassword/ResetPassword";
import ProtectedRouter from "./components/common/protectedRouter";
const useStyles = makeStyles({
  container: {
    backgroundColor: "#E3ECD5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  maxWidthXl: {
    width: "100vw",
    height: "100vh",
  },
  minicontainer: {
    backgroundColor: "white",
    height: "93vh",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
    borderRadius: 5,
    margin: 0,
    padding: 0,
  },
  rightSideBox: {
    height: "93vh",
    backgroundImage:
      "url(https://i.pinimg.com/originals/7b/1d/8e/7b1d8e865da2c11b788a21a0fb51d542.jpg)",
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <Container
      className={`${classes.container} ${classes.maxWidthXl}`}
      maxWidth="xl"
    >
      <ToastContainer />
      <Provider store={store}>
        <Container maxWidth="lg" fixed className={classes.minicontainer}>
          <Grid container>
            <Grid item lg={4} md={4}>
              <Box>
                <NavBarLeft></NavBarLeft>
                <Switch>
                  {/* NO USER  */}
                  <Route path="/login" component={Login} />
                  <Route path="/signUp" component={SignUp} />
                  <Route
                    path="/confirm-email/:token"
                    component={ConfirmEmail}
                  />
                  <Route
                    path="/send-forgotPassowrd-email"
                    component={SendForgotPassowrdEmail}
                  />
                  <Route
                    path="/reset-password/:resetLink"
                    component={ResetPassword}
                  />
                  {/* ///////////////////////////////////////////////////////////////////////////// */}
                  <ProtectedRouter
                    path="/"
                    exact
                    component={ChatListContainer}
                  />
                  <ProtectedRouter
                    path="/notifications"
                    component={NotificationsContainer}
                  />
                  <ProtectedRouter
                    path="/new-chat"
                    component={NewChatContainer}
                  />
                  <ProtectedRouter
                    path="/add-friend"
                    component={AddFriendContainer}
                  />
                  <ProtectedRouter
                    path="/profile/change-password"
                    component={ChangePassWord}
                  />
                  <ProtectedRouter path="/profile" component={Settings} />
                </Switch>
              </Box>
            </Grid>
            <Grid item lg={8} md={8}>
              <Box
                display="flex"
                flexDirection="column"
                className={classes.rightSideBox}
              >
                <ChatContainer />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Provider>
    </Container>
  );
};

export default App;
