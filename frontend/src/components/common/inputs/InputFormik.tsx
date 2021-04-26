import { Field, ErrorMessage } from "formik";
import { makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
  name: string;
  className?: string;
  placeholder?: string;
  hidden?: boolean | undefined;
  type?: string;
}

const useStyles = makeStyles({
  field: {
    marginBottom: 10,
    width: "100%",
    height: 38,
    borderRadius: 17,
    margin: "5px 5px 0px 5px",
    padding: 5,
    outline: "none",
    border: "none",
    fontSize: "1.3em",
  },
});

const InputFormik: React.FC<Props> = ({
  name,
  type = "text",
  className,
  placeholder,
  hidden,
}) => {
  const classes = useStyles();
  return (
    <>
      <Field
        name={name}
        type={type}
        hidden={hidden}
        id={name}
        className={`${classes.field} ${className}`}
        dir="auto"
        autoComplete="off"
        placeholder={placeholder}
      />
      <ErrorMessage name={name}>
        {(msg) => (
          <small style={{ color: "red", marginBottom: -20 }}>{msg}</small>
        )}
      </ErrorMessage>
    </>
  );
};

export default InputFormik;
