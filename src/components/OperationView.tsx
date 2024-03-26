import React from "react";

interface OperationViewProps {
  children?: React.ReactNode;
}
export const OperationView: React.FC<OperationViewProps> = (props) => {
  const { children } = props;
  return <div>{children}</div>;
};
