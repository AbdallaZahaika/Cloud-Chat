import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStore } from "../../store";

interface Props {
  component: Function;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({
  component: Component,
  path,
  exact,
}) => {
  const { userActive } = useSelector((state: RootStore) => state.user);
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) => {
        if (!userActive) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
