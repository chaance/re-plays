import React from 'react';
import { unstable_createResource } from 'react-cache';

export const VideoResource = unstable_createResource((src: string) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = src;
    video.oncanplay = () => {
      resolve(video);
    };
    video.onerror = reject;
  }) as Promise<HTMLVideoElement>;
});

export const Video: React.FC<
  React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
> = props => {
  if (props.src) {
    VideoResource.read(props.src);
    return <video {...props} />;
  }
  return null;
};

export default Video;
