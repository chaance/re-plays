//import React from 'react';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Caption = Omit<HTMLTrackElement, 'kind'>;

export type MediaSource = string | string[] | HTMLSourceElement[];

export interface RePlaysProps extends Omit<HTMLAudioElement, 'src'> {
  src: MediaSource;
  captions?: Caption[];
  autoPlay?: HTMLMediaElement['autoplay'];
}
