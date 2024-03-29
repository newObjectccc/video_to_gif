export interface VideoObjIntf {
  url?: string;
  type?: string;
}
export interface VideoRectIntf {
  width?: number;
  height?: number;
}
export interface GifObjIntf {
  url?: string;
  size?: number;
}
export interface FramesPickerIntf {
  framesPicker?: number;
  framesDelay?: number;
}
export interface CanvasRectIntf {
  width?: number;
  height?: number;
}
export interface TransformStateIntf {
  videoStat: VideoObjIntf;
  gifStat: GifObjIntf;
  framesOptions: FramesPickerIntf;
  canvasRect: CanvasRectIntf;
  videoRect: VideoRectIntf;
}

export const defaultTransformState = {
  videoStat: {
    url: "",
    type: "",
  },
  videoRect: { width: 640, height: 320 },
  gifStat: {
    url: "",
    size: 0,
  },
  framesOptions: {
    framesPicker: 1,
    framesDelay: 100,
  },
  canvasRect: {
    width: 640,
    height: 320,
  },
};
const ACTION_GIF = "gifStat";
const ACTION_VIDEO = "videoStat";
const ACTION_FRAMES = "framesOptions";
const ACTION_CANVAS = "canvasRect";
const ACTION_VIDEO_RECT = "videoRect";

export const transformDispatch = (
  state = defaultTransformState,
  action: {
    type:
      | typeof ACTION_VIDEO_RECT
      | typeof ACTION_GIF
      | typeof ACTION_VIDEO
      | typeof ACTION_FRAMES
      | typeof ACTION_CANVAS;
    payload: any;
  }
) => {
  switch (action.type) {
    case ACTION_GIF:
      return { ...state, gifStat: { ...state.gifStat, ...action.payload } };
    case ACTION_VIDEO:
      return { ...state, videoStat: { ...state.videoStat, ...action.payload } };
    case ACTION_FRAMES:
      return {
        ...state,
        framesOptions: { ...state.framesOptions, ...action.payload },
      };
    case ACTION_CANVAS:
      return {
        ...state,
        canvasRect: { ...state.canvasRect, ...action.payload },
      };
    case ACTION_VIDEO_RECT:
      return {
        ...state,
        videoRect: { ...state.videoRect, ...action.payload },
      };
    default:
      return state;
  }
};
