export interface VideoObjIntf {
  url?: string;
  type?: string;
}
export interface GifObjIntf {
  url?: string;
  size?: number;
}
export interface FramesPickerIntf {
  framesPicker?: number;
}
export interface TransformStateIntf {
  videoStat: VideoObjIntf;
  gifStat: GifObjIntf;
  framesOptions: FramesPickerIntf;
}

export const defaultTransformState = {
  videoStat: {
    url: "",
    type: "",
  },
  gifStat: {
    url: "",
    size: 0,
  },
  framesOptions: {
    framesPicker: 1,
  },
};
const ACTION_GIF = "gifStat";
const ACTION_VIDEO = "videoStat";
const ACTION_FRAMES = "framesOptions";

export const transformDispatch = (
  state = defaultTransformState,
  action: {
    type: typeof ACTION_GIF | typeof ACTION_VIDEO | typeof ACTION_FRAMES;
    payload: any;
  }
) => {
  switch (action.type) {
    case ACTION_GIF:
      return { ...state, gifStat: action.payload };
    case ACTION_VIDEO:
      return { ...state, videoStat: action.payload };
    case ACTION_FRAMES:
      return { ...state, framesOptions: action.payload };
    default:
      return state;
  }
};
