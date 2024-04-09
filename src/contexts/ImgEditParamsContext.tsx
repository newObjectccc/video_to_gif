import React, { Dispatch } from "react";

const defaultImgEditParams = {
  brightness: 100,
  blur: 0,
  opacity: 100,
  textInfo: {
    x: 0,
    y: 0,
    text: "",
    fontSize: 16,
    fontColor: "#000000",
    fontFamily: "Arial",
  },
  isApplyAll: true,
};

const ACTION_BRIGHTNESS = "brightness";
const ACTION_BLUR = "blur";
const ACTION_OPACITY = "opacity";
const ACTION_TEXT_INFO = "textInfo";
const ACTION_APPLY_ALL = "isApplyAll";

const imgEditParamsDispatch = (
  state = defaultImgEditParams,
  action: {
    type:
      | typeof ACTION_BRIGHTNESS
      | typeof ACTION_BLUR
      | typeof ACTION_OPACITY
      | typeof ACTION_TEXT_INFO
      | typeof ACTION_APPLY_ALL;
    payload: any;
  }
) => {
  switch (action.type) {
    case ACTION_BRIGHTNESS:
      return { ...state, brightness: action.payload };
    case ACTION_BLUR:
      return { ...state, blur: action.payload };
    case ACTION_OPACITY:
      return { ...state, opacity: action.payload };
    case ACTION_TEXT_INFO:
      return { ...state, textInfo: { ...state.textInfo, ...action.payload } };
    case ACTION_APPLY_ALL:
      return { ...state, isApplyAll: action.payload };
    default:
      return state;
  }
};

export const ImgEditParamsContext = React.createContext<
  [typeof defaultImgEditParams, Dispatch<typeof imgEditParamsDispatch>]
>([defaultImgEditParams, () => {}]);

export const ImgEditProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [defaultState, dispatch] = React.useReducer(
    imgEditParamsDispatch,
    defaultImgEditParams
  );

  return (
    <ImgEditParamsContext.Provider value={[defaultState, dispatch as any]}>
      {children}
    </ImgEditParamsContext.Provider>
  );
};
