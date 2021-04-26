/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Button, Typography } from "@material-ui/core";
import { VerifiedUser, NewReleases } from "@material-ui/icons";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { confirmEmail } from "../store/user/userActions";
export interface ConfirmEmailProps {}

const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  const dispatch = useDispatch();
  const params: any = useParams();
  const [errors, setErrors] = useState<boolean>(false);
  useEffect(() => {
    const confirm = async () => {
      const res: any = await dispatch(confirmEmail(params.token));
      if (res.response && res.response.status === 400) {
        if (res.response.data.error) {
          setErrors(true);
        }
        return toast.error("errors occurred!");
      }
    };
    confirm();
  }, []);
  return (
    <Box
      width="100%"
      display="flex"
      height="93vh"
      justifyContent="center"
      mt={15}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        {!errors ? (
          <>
            <VerifiedUser style={{ fontSize: 300 }} htmlColor="green" />
            <Typography
              variant="h6"
              align="center"
              style={{ margin: "20px 0px 35px 0px" }}
            >
              Your email has been confirmed, we'm glad you're joining us. Log in
              and start talking to friends from anywhere at any time
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              component={Link}
              to="/login"
            >
              Log in
            </Button>
          </>
        ) : (
          <>
            <NewReleases style={{ fontSize: 300 }} htmlColor="red" />
            <Typography
              variant="h6"
              align="center"
              style={{ margin: "20px 0px 35px 0px" }}
            >
              Error occurred in confirming email contact us
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              component={Link}
              to="/contact-us"
            >
              Contact Us
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
