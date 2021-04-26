/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Form, Formik, ErrorMessage } from "formik";
import InputFormikMarerialUi from "../common/inputs/InputFormikMarerialUi";
import { serverUrl } from "../../services/serverUrl.json";
import { toast } from "react-toastify";
import {
  makeStyles,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import {
  PhotoCamera,
  ArrowBack,
  Check,
  Close,
  VpnKey,
} from "@material-ui/icons";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../store";
import {
  updateUserInfo,
  deleteAvatar,
  uploadImage,
} from "../../store/user/userActions";
interface MyFormValues {
  name: string;
  avatar: string;
}
export interface SettingsProps {}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, `name must be longer than 2 characters`)
    .max(125, `name must be shorter than 125 characters`)
    .required(`this required`),
});

const useStyles = makeStyles({
  form: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    flexDirection: "column",
    height: "79vh",
  },
  avatarContainer: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "default",

    "&:hover $addAPhotoContaienr": {
      display: "flex",
    },
  },
  addAPhotoContaienr: {
    display: "none",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    transition: "all 0.3s ease-in-out",
  },
});

const Settings: React.FC<SettingsProps> = () => {
  const dispatch = useDispatch();
  const { user, loding } = useSelector((state: RootStore) => state.user);

  /////////// Formik initialValues state
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    name: user.name,
    avatar: user.avatar,
  });

  const [oldImage, setOldImage] = useState<string>(user.avatar);

  ///// this preview Image
  const [{ src }, setImg] = React.useState({
    src: "",
  });

  const history = useHistory();

  //// this fucntion handle new image
  //// 1:change src : preview image
  //// 2:change the vlaue of avatar in formik Values
  const handleNewImage = (
    e: any,
    setFieldValue: (field: string, value: object) => void
  ) => {
    if (e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
      });
      /// this new image
      setFieldValue("avatar", e.target.files[0]);
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
            style={{ color: "white", fontWeight: "lighter", marginRight: 60 }}
          >
            Profile
          </Typography>
          <Box></Box>
        </Box>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldError }) => {
          const dataBody = {
            name: values.name,
            avatar: values.avatar,
          };
          if (typeof values.avatar !== "string") {
            let formData = new FormData();
            formData.append("image", values.avatar);
            const resUploadImage: any = await dispatch(uploadImage(formData));
            if (
              resUploadImage.response &&
              resUploadImage.response.status === 400
            ) {
              if (resUploadImage.response.data.errors) {
                setFieldError("avatar", resUploadImage.response.data.errors);
              }
              return toast.error("errors occurred!");
            }
            dataBody.avatar = resUploadImage;

            const resDeleteImage: any = await dispatch(deleteAvatar(oldImage));
            if (resDeleteImage.error) {
              return setFieldError("avatar", resDeleteImage.error);
            }
          }
          const res: any = await dispatch(updateUserInfo(dataBody));

          if (
            (res.response && res.response.status === 400) ||
            (res.response && res.response === undefined)
          ) {
            if (res.response && res.response.data.errors.name) {
              setFieldError("name", res.response.data.errors.name);
            }
            if (res.response && res.response.data.errors.avatar) {
              setFieldError("avatar", res.response.data.errors.avatar);
            }
            return toast.error("errors occurred!");
          }

          history.push("/");
        }}
      >
        {({
          handleSubmit,
          isValid,
          dirty,
          errors,
          touched,
          setFieldValue,
          values,
        }) => (
          <Form onSubmit={handleSubmit} className={classes.form}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                width="200px"
                height="200px"
                borderRadius="50%"
                className={classes.avatarContainer}
                mt={3}
                style={{
                  backgroundImage: src
                    ? `url(${src})`
                    : `url(${serverUrl}${values.avatar})`,
                }}
              >
                <Box
                  className={classes.addAPhotoContaienr}
                  width="200px"
                  height="200px"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <IconButton component="label">
                    <PhotoCamera htmlColor="white" fontSize="large" />
                    <input
                      type="file"
                      name="avatar"
                      hidden
                      ///we need to give e: the real type
                      onChange={(e) => handleNewImage(e, setFieldValue)}
                      disabled={loding}
                    />
                  </IconButton>
                  <Typography variant="body2">CHANGE</Typography>
                  <Typography variant="body2">PROFILE PHOTO</Typography>
                </Box>
              </Box>
              <Box mt={2}>
                <ErrorMessage name="avatar">
                  {(msg) => (
                    <Typography variant="body2" color="error" align="center">
                      {msg}
                    </Typography>
                  )}
                </ErrorMessage>
              </Box>
            </Box>
            <Box
              width="100%"
              height="100px"
              bgcolor="#e9ecef"
              mt={-26}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <InputFormikMarerialUi
                name="name"
                label="Name"
                placeholder="Write new Message"
                style={{ width: "80%", color: "white" }}
                error={errors.name && touched.name}
                disabled={loding}
              />
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box ml={2}>
                {loding ? (
                  <CircularProgress />
                ) : (
                  <IconButton
                    type="submit"
                    disabled={!isValid || !dirty || loding}
                  >
                    <Check
                      htmlColor={!isValid || !dirty ? "black" : "green"}
                      fontSize="large"
                    />
                  </IconButton>
                )}
                <IconButton component={Link} to="/" disabled={loding}>
                  <Close color="error" fontSize="large" />
                </IconButton>
              </Box>
              <Box mr={2}>
                <IconButton
                  component={Link}
                  to="/profile/change-password"
                  disabled={loding}
                >
                  <Typography variant="body2">Change Password</Typography>
                  <VpnKey htmlColor="	rgba(255,220,0,0.9)" fontSize="large" />
                </IconButton>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Settings;
