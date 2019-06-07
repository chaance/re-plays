import React from 'react';
import cx from 'classnames';

const SOME_STATE_LIKE_THING = {}; // may need a reducer, may not? GUESS WE WILL SEE
const formatTime = () => {}; // format MS to HH:MM:SS
const LANGUAGE_CODE = 'https://r12a.github.io/app-subtags/'; // << GET LIST FOR THIS TYPE

const AudioPlayer = ({
  src, // required. string | string[] | { src: string, type?: https://tools.ietf.org/html/rfc4281 }[]
  duration = 100, // number
  captions = [{}], // { src: string,  }[]
  crossOrigin,
  autoPlay = false,
  loop = false,
  muted = false,
  preLoad = 'metadata',
}) => {
  const {
    isPlaying = false,
    isScrubbing = false,
    volumeControlIsActive = false,
    volumeLevel = 1,
    ...state
  } = SOME_STATE_LIKE_THING;
  const elapsedTime = formatTime(state.elapsedTime);
  const remainingTime = formatTime(duration - elapsedTime);

  const handleAutoPlay = () => {};
  const handleLoop = () => {};
  const handleMute = () => {};

  return (
    <div
      pseudo="-webkit-media-controls"
      className={cx(
        'phase-ready',
        `state-${isScrubbing ? 'scrubbing' : isPlaying ? 'playing' : 'stopped'}`
      )}
    >
      {/* some props should stay false and remain controlled by the state */}
      {/* autoPlay, loop, muted */}
      <audio
        className="HIDE_ME"
        autoPlay={
          false /* This should be controled by component state, so always keep it false here */
        }
        crossOrigin={
          crossOrigin /* May need to manually determine if the request is successful if this is set? */
        }
        loop={false}
        muted={false}
        preLoad={preLoad}
        src={typeof src === 'string' && src}
      >
        {Array.isArray(src) &&
          src.map((source, i) => (
            <source
              key={i}
              src={typeof source === 'string' ? source : source.src}
              type={typeof source !== 'string' && source.type}
            />
          ))}
      </audio>
      {captions.length &&
        captions
          .filter(caption => !!caption.src)
          .map((caption, i) => (
            <video
              key={i}
              controls={false}
              width="MAKE_DYNAMIC_INT"
              height="MAKE_DYNAMIC_INT"
              src={typeof src === 'string' && src}
              muted={true} // sync with audio state
              preLoad="none" // should be handled by audio preLoad? Will need to test this.
              loop={false} // sync with audio state
              autoPlay={false} // sync with audio state
            >
              {Array.isArray(src) &&
                src.map((source, i) => (
                  <source
                    key={i}
                    src={typeof source === 'string' ? source : source.src}
                    type={typeof source !== 'string' && source.type}
                  />
                ))}
              <track
                label={caption.label}
                kind="subtitles"
                srcLang={
                  caption.srcLang /* two-letter language code: https://r12a.github.io/app-subtags/ */
                }
                src={caption.src}
                default={caption.default}
              />
            </video>
          ))}
      <div pseudo="-webkit-media-controls-enclosure">
        <div pseudo="-webkit-media-controls-panel">
          <button
            type="button"
            pseudo="-webkit-media-controls-play-button"
            className={cx({ pause: !isPlaying })}
          >
            <span className="HIDE_ME">{isPlaying ? 'pause' : 'play'}</span>
            <div pseudo="-internal-media-controls-button-hover-background" />
          </button>

          <div
            aria-label={`elapsed time: ${elapsedTime}`}
            pseudo="-webkit-media-controls-current-time-display"
          >
            <span>{elapsedTime}</span>
          </div>
          <div
            aria-label={`remaining time: / ${remainingTime}`}
            pseudo="-webkit-media-controls-time-remaining-display"
          >
            <span>/ {remainingTime}</span>
          </div>
          <input
            type="range"
            step="any"
            pseudo="-webkit-media-controls-timeline"
            max={duration / 100}
            aria-valuetext="0:00"
            className="HIDE_ME"
          />
          <div className="VISUAL_TRACK" aria-hidden>
            <div pseudo="-internal-media-controls-segmented-track" id="track">
              <div id="thumb" />
              <div pseudo="-internal-track-segment-background">
                <div pseudo="-internal-track-segment-highlight-before" />
                <div pseudo="-internal-track-segment-highlight-after" />
              </div>
            </div>
          </div>
          <div
            pseudo="-webkit-media-controls-volume-control-container"
            className={cx({ closed: !volumeControlIsActive })}
          >
            <div pseudo="-webkit-media-controls-volume-control-hover-background" />
            <input
              type="range"
              step="any"
              max={1}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-label="volume"
              pseudo="-webkit-media-controls-volume-slider"
              aria-valuenow={Math.floor(volumeLevel * 100)}
              className={cx({ closed: !volumeControlIsActive })}
            />
            <button type="button" pseudo="-webkit-media-controls-mute-button">
              <span className="HIDE_ME">
                {volumeLevel === 0 ? 'unmute' : 'mute'}
              </span>
            </button>
          </div>
          <button
            type="button"
            pseudo="-webkit-media-controls-fullscreen-button"
            style={{ display: 'none' }}
          >
            <span>Enter Full-screen</span>
          </button>
          <button
            type="button"
            title="more options"
            pseudo="-internal-media-controls-overflow-button"
          >
            <span className="HIDE_ME">Show More Media Controls</span>
          </button>
        </div>
      </div>
      <div
        role="menu"
        aria-label="Options"
        pseudo="-internal-media-controls-text-track-list"
        style={{ display: 'none' }}
      />
      <div
        pseudo="-internal-media-controls-overflow-menu-list"
        role="menu"
        className="closed"
        style={{ display: 'none' }}
      >
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label="Play"
          style={{ display: 'none' }}
        >
          <button
            type="button"
            pseudo="-webkit-media-controls-play-button"
            tabIndex="-1"
            className="pause"
            style={{ display: 'none' }}
          >
            <span>Play</span>
          </button>
        </label>
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label="enter full screen Fullscreen "
          style={{ display: 'none' }}
        >
          <button
            type="button"
            pseudo="-webkit-media-controls-fullscreen-button"
            aria-label="enter full screen"
            tabIndex="-1"
            style={{ display: 'none' }}
          >
            <span>Fullscreen</span>
          </button>
        </label>
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label="download media Download "
          className="animated-0"
        >
          <button
            type="button"
            pseudo="-internal-media-controls-download-button"
            tabIndex="-1"
          >
            <span>
              Download<span className="HIDE_ME"> Media</span>
            </span>
          </button>
        </label>
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label=" Mute "
          className="animated-2"
          style={{ display: 'none' }}
        >
          <button
            type="button"
            pseudo="-webkit-media-controls-mute-button"
            tabIndex="-1"
            style={{ display: 'none' }}
          >
            <span>{volumeLevel === 0 ? 'Unmute' : 'Mute'}</span>
          </button>
        </label>
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label="play on remote device Cast "
          className="animated-1"
          style={{ display: 'none' }}
        />
        <label
          pseudo="-internal-media-controls-overflow-menu-list-item"
          role="menuitem"
          tabIndex="0"
          aria-label="show closed captions menu Captions "
          className="animated-0"
          style={{ display: 'none' }}
        >
          <button
            aria-label="show closed captions menu"
            type="button"
            pseudo="-webkit-media-controls-toggle-closed-captions-button"
            className="closed-captions"
            tabIndex="-1"
            style={{ display: 'none' }}
          >
            <span>Captions</span>
          </button>
        </label>
      </div>
    </div>
  );
};

export default AudioPlayer;
