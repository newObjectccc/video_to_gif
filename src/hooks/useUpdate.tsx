import React from "react";

export const useUpdate = () => {
  const [, setValue] = React.useState({});
  return () => setValue({});
};
