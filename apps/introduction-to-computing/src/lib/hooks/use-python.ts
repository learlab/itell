import { useContext } from "react";
import { PythonContext } from "@webpy/react";

export const usePython = () => {
  return useContext(PythonContext);
};
