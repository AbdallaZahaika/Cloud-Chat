import { ErrorMessage, Field } from "formik";
import { TextField, makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
  name: string;
  label: string;
  className?: string;
  type?: string;
  placeholder?: string;
  variant?: string;
  style?: object;
  error?: boolean | "" | undefined;
  disabled?: boolean;
}

const useStyles = makeStyles({
  field: {
    marginBottom: 10,
  },
});

const InputFormikMaterialUi: React.FC<Props> = ({
  name,
  label,
  type = "text",
  className,
  placeholder,
  variant = "standard",
  style,
  error,
  disabled,
}) => {
  const classes = useStyles();
  return (
    <Field
      className={`${classes.field} ${className}`}
      autoComplete="off"
      as={TextField}
      helperText={<ErrorMessage name={name} />}
      fullWidth
      label={label}
      name={name}
      type={type}
      variant={variant}
      placeholder={placeholder}
      style={style}
      error={error}
      disabled={disabled}
    />
  );
};

export default InputFormikMaterialUi;
