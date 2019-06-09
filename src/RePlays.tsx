import React, { useReducer, useEffect } from 'react';
import cx from 'classnames';
import Audio from './Audio';
import Video from './Video';
import { toTime } from './utils';
import { usePrevious } from './hooks';

import { MediaSource, RePlaysProps, RePlaysState, ActionTypes } from './types';

// const LANGUAGE_CODE = 'https://r12a.github.io/app-subtags/'; // << GET LIST FOR THIS TYPE

const renderSource = (src: MediaSource) =>
  Array.isArray(src)
    ? (src as (string | HTMLSourceElement)[]).map((source, i) => (
        <source
          key={i}
          src={typeof source === 'string' ? source : source.src}
          type={typeof source === 'string' ? undefined : source.type}
        />
      ))
    : null;

export const initialState: RePlaysState = {
  elapsedTime: 0,
  isPlaying: false,
  isScrubbing: false,
  volumeControlIsActive: false,
  volumeLevel: 1,
  loop: false,
};

export const actionTypes: ActionTypes = {
  SET_PLAYING: 'SET_PLAYING',
  SET_PAUSE: 'SET_PAUSE',
  SET_SCRUBBING: 'SET_SCRUBBING',
  SET_ELAPSED_TIME: 'SET_ELAPSED_TIME',
  SET_TO_BEGINNING: 'SET_TO_BEGINNING',
  PLAY_FROM_BEGINNING: 'PLAY_FROM_BEGINNING',
  TOGGLE_LOOP: 'TOGGLE_LOOP',
  TOGGLE_PLAYING: 'TOGGLE_PLAYING',
  MUTE: 'MUTE',
  SET_VOLUME: 'SET_VOLUME',
};

function reducer(
  state: RePlaysState,
  action: { type: string; time?: number; volumeLevel?: number }
): RePlaysState {
  switch (action.type) {
    case actionTypes.SET_PLAYING:
      return { ...state, isPlaying: true };
    case actionTypes.SET_PAUSE:
      return { ...state, isPlaying: false };
    case actionTypes.TOGGLE_PLAYING:
      return { ...state, isPlaying: !state.isPlaying };
    case actionTypes.SET_SCRUBBING:
      return {
        ...state,
        isScrubbing: true,
        elapsedTime: action.time || 0,
      };
    case actionTypes.STOP_SCRUBBING:
      return {
        ...state,
        isScrubbing: false,
        elapsedTime: action.time || 0,
      };
    case actionTypes.SET_ELAPSED_TIME:
      return { ...state, elapsedTime: action.time || 0 };
    case actionTypes.TOGGLE_LOOP:
      return { ...state, loop: !state.loop };
    case actionTypes.MUTE:
      return { ...state, volumeLevel: 0 };
    case actionTypes.SET_VOLUME:
      return { ...state, volumeLevel: action.volumeLevel || 0 };
    case actionTypes.SET_TO_BEGINNING:
      return {
        ...state,
        isScrubbing: false,
        isPlaying: false,
        elapsedTime: 0,
      };
    case actionTypes.PLAY_FROM_BEGINNING:
      return {
        ...state,
        isScrubbing: false,
        isPlaying: true,
        elapsedTime: 0,
      };
    default: {
      return state;
    }
  }
}

export const RePlays: React.FC<RePlaysProps> = ({
  src,
  duration = 100,
  captions,
  crossOrigin,
  autoPlay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isPlaying,
    isScrubbing,
    volumeControlIsActive,
    volumeLevel,
    loop: loopState,
  } = state;
  const elapsedTime = toTime(state.elapsedTime);
  const remainingTime = toTime(duration - state.elapsedTime);

  const previousVolume = usePrevious(volumeLevel);

  // Trigger autoplay + mute
  useEffect(() => {
    if (muted) dispatch({ type: actionTypes.MUTE });
    if (autoPlay) dispatch({ type: actionTypes.SET_PLAYING });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger loop
  useEffect(() => {
    if (state.elapsedTime === duration)
      dispatch({ type: actionTypes.PLAY_FROM_BEGINNING });
  }, [state.elapsedTime, duration]);

  // Reconcile state with props
  if (loop !== loopState) {
    dispatch({ type: actionTypes.TOOGLE_LOOP });
  }

  const setVolume = (level: number) =>
    dispatch({ type: actionTypes.SET_VOLUME, volumeLevel: level });

  const handlePlay = () => dispatch({ type: actionTypes.SET_PLAYING });

  const handlePause = () => dispatch({ type: actionTypes.SET_PAUSE });

  const togglePlaying = () => dispatch({ type: actionTypes.TOGGLE_PLAYING });

  const toggleMute = () => {
    if (volumeLevel === 0) {
      dispatch({ type: actionTypes.SET_VOLUME, volumeLevel: previousVolume });
    } else {
      dispatch({ type: actionTypes.MUTE });
    }
  };

  const toggleLoop = () => {
    dispatch({ type: actionTypes.TOGGLE_LOOP });
  };

  const handleSeekMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    dispatch({
      type: actionTypes.SET_SCRUBBING,
      time: parseFloat(value || '0'),
    });
  };

  const handleSeeking = (e: React.MouseEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    dispatch({
      type: actionTypes.STOP_SCRUBBING,
      time: parseFloat(value || '0'),
    });
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    dispatch({
      type: actionTypes.STOP_SCRUBBING,
      time: parseFloat(value || '0'),
    });
  };

  return (
    <div
      // pseudo="-webkit-media-controls"
      className={cx(
        'phase-ready',
        `state-${isScrubbing ? 'scrubbing' : isPlaying ? 'playing' : 'stopped'}`
      )}
    >
      {/* some props should stay false and remain controlled by the state */}
      {/* autoPlay, loop, muted */}
      <Audio
        className="HIDE_ME"
        autoPlay={
          false /* This should be controled by component state, so always keep it false here */
        }
        crossOrigin={crossOrigin ? crossOrigin : undefined}
        loop={false}
        muted={false}
        preload={preload}
        src={typeof src === 'string' ? src : undefined}
      >
        {renderSource(src)}
      </Audio>
      {captions
        ? captions.map((caption, i) => (
            <Video
              key={i}
              controls={false}
              width="MAKE_DYNAMIC_INT"
              height="MAKE_DYNAMIC_INT"
              src={typeof src === 'string' ? src : undefined}
              muted={true} // sync with audio state
              preload="none" // should be handled by audio preload? Will need to test this.
              loop={false} // sync with audio state
              autoPlay={false} // sync with audio state
            >
              {renderSource(src)}
              <track kind="subtitles" {...caption} />
            </Video>
          ))
        : null}
      <div /* pseudo="-webkit-media-controls-enclosure" */>
        <div /* pseudo="-webkit-media-controls-panel" */>
          <button
            type="button"
            // pseudo="-webkit-media-controls-play-button"
            className={cx({ pause: !isPlaying })}
          >
            <span className="HIDE_ME">{isPlaying ? 'pause' : 'play'}</span>
            <div /* pseudo="-internal-media-controls-button-hover-background" */
            />
          </button>
          {elapsedTime ? (
            <div
              aria-label={`elapsed time: ${elapsedTime}`}
              //pseudo="-webkit-media-controls-current-time-display"
            >
              <span>{elapsedTime}</span>
            </div>
          ) : null}
          {remainingTime ? (
            <div
              aria-label={`remaining time: / ${remainingTime}`}
              // pseudo="-webkit-media-controls-time-remaining-display"
            >
              <span>
                {elapsedTime ? '/ ' : null}
                {remainingTime}
              </span>
            </div>
          ) : null}
          <input
            type="range"
            step="any"
            //pseudo="-webkit-media-controls-timeline"
            max={duration / 100}
            aria-valuetext="0:00"
            className="HIDE_ME"
          />
          <div className="VISUAL_TRACK" aria-hidden>
            <div
              // pseudo="-internal-media-controls-segmented-track"
              id="track"
            >
              <div id="thumb" />
              <div /* pseudo="-internal-track-segment-background" */>
                >
                <div /* pseudo="-internal-track-segment-highlight-before" */ />
                <div /* pseudo="-internal-track-segment-highlight-after" */ />
              </div>
            </div>
          </div>
          <div
            // pseudo="-webkit-media-controls-volume-control-container"
            className={cx({ closed: !volumeControlIsActive })}
          >
            <div /* pseudo="-webkit-media-controls-volume-control-hover-background" */
            />
            <input
              type="range"
              step="any"
              max={1}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-label="volume"
              // pseudo="-webkit-media-controls-volume-slider"
              aria-valuenow={Math.floor(volumeLevel * 100)}
              className={cx({ closed: !volumeControlIsActive })}
            />
            <button
              type="button" /* pseudo="-webkit-media-controls-mute-button" */
            >
              <span className="HIDE_ME">
                {volumeLevel === 0 ? 'unmute' : 'mute'}
              </span>
            </button>
          </div>
          <button
            type="button"
            // pseudo="-webkit-media-controls-fullscreen-button"
            style={{ display: 'none' }}
          >
            <span>Enter Full-screen</span>
          </button>
          <button
            type="button"
            title="more options"
            // pseudo="-internal-media-controls-overflow-button"
          >
            <span className="HIDE_ME">Show More Media Controls</span>
          </button>
        </div>
      </div>
      <div
        role="menu"
        aria-label="Options"
        // pseudo="-internal-media-controls-text-track-list"
        style={{ display: 'none' }}
      />
      <div
        // pseudo="-internal-media-controls-overflow-menu-list"
        role="menu"
        className="closed"
        style={{ display: 'none' }}
      >
        <label
          // pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label="Play"
          style={{ display: 'none' }}
        >
          <button
            type="button"
            // pseudo="-webkit-media-controls-play-button"
            tabIndex={-1}
            className="pause"
            style={{ display: 'none' }}
          >
            <span>Play</span>
          </button>
        </label>
        <label
          // pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label="enter full screen Fullscreen "
          style={{ display: 'none' }}
        >
          <button
            type="button"
            // pseudo="-webkit-media-controls-fullscreen-button"
            aria-label="enter full screen"
            tabIndex={-1}
            style={{ display: 'none' }}
          >
            <span>Fullscreen</span>
          </button>
        </label>
        <label
          // pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label="download media Download "
          className="animated-0"
        >
          <button
            type="button"
            // pseudo="-internal-media-controls-download-button"
            tabIndex={-1}
          >
            <span>
              Download<span className="HIDE_ME"> Media</span>
            </span>
          </button>
        </label>
        <label
          //pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label=" Mute "
          className="animated-2"
          style={{ display: 'none' }}
        >
          <button
            type="button"
            //pseudo="-webkit-media-controls-mute-button"
            tabIndex={-1}
            style={{ display: 'none' }}
          >
            <span>{volumeLevel === 0 ? 'Unmute' : 'Mute'}</span>
          </button>
        </label>
        <label
          //pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label="play on remote device Cast "
          className="animated-1"
          style={{ display: 'none' }}
        />
        <label
          //pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex={0}
          aria-label="show closed captions menu Captions "
          className="animated-0"
          style={{ display: 'none' }}
        >
          <button
            aria-label="show closed captions menu"
            type="button"
            //pseudo="-webkit-media-controls-toggle-closed-captions-button"
            className="closed-captions"
            tabIndex={-1}
            style={{ display: 'none' }}
          >
            <span>Captions</span>
          </button>
        </label>
      </div>
    </div>
  );
};

export default RePlays;
