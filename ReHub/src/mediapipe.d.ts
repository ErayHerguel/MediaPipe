declare module '@mediapipe/pose' {
  export class Pose {
    constructor(config: { locateFile: (path: string) => string });
    setOptions(options: {
      modelComplexity?: number;
      smoothLandmarks?: boolean;
      enableSegmentation?: boolean;
      smoothSegmentation?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;
    onResults(callback: (results: any) => void): void;
    send(inputs: { image: HTMLVideoElement }): Promise<void>;
  }
  export const POSE_CONNECTIONS: any[];
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(videoElement: HTMLVideoElement, config: { onFrame: () => void; width: number; height: number });
    start(): void;
  }
}
