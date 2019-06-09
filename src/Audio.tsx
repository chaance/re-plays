import React from 'react';
import { unstable_createResource } from 'react-cache';

export const AudioResource = unstable_createResource((src: string) => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.onloadeddata = () => resolve(audio);
    audio.onerror = reject;
    document.body.append(audio);
  }) as Promise<HTMLAudioElement>;
});

export const Audio: React.FC<
  React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >
> = props => {
  if (props.src) {
    AudioResource.read(props.src);
    return <audio {...props} />;
  }
  return null;
};

export default Audio;
