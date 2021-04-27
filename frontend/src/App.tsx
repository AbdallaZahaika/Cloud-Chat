import {
  Box,
  Container,
  Grid,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
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
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#E3ECD5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
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
    [theme.breakpoints.down("sm")]: {
      height: "100vh",
      borderRadius: 0,
    },
  },
  rightSideBox: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const App: React.FC = () => {
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Container
      className={`${classes.container} ${classes.maxWidthXl}`}
      maxWidth="xl"
    >
      <ToastContainer />
      <Provider store={store}>
        <Container maxWidth="lg" fixed className={classes.minicontainer}>
          <Grid container>
            <Grid item lg={4} md={4} xs={12}>
              <Box>
                {location.pathname !== "/room" ? <NavBarLeft /> : ""}

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
                  {matches ? (
                    <ProtectedRouter path="/room" component={ChatContainer} />
                  ) : (
                    ""
                  )}
                </Switch>
              </Box>
            </Grid>
            <Grid item lg={8} md={8}>
              <Box className={classes.rightSideBox}>
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
