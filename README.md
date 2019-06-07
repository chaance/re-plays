# RePlay

Just an idea right now. Sketching out ideas for the markup in `AudioPlayer.js`. Trying to mirror the HTML audio element's API and shadow DOM (a la Chrome) as a general model, with some enhancements (audio support for captions via the track element). This will be written in TypeScript.

## General thoughts

- Props should be close to 1-to-1 with HTML5 audio. Some exceptions:
  - Add a `duration` prop. We don't want to force users to fetch data about an audio file. Users should be able to make that decision.
  - No controls prop. If the user doesn't want controls, they can just use an HTML audio tag.
  - `src` can be a string or an array containing multiple source files (see type annotations in code comments)
    - Array of strings: `[ 'file.mp3', 'file.wav' ]`
    - Array of objects: `[ { type: 'audio/mp3', src: 'file.mp3' }, { type: 'audio/wav', src: 'file.wav' } ]`
      - See: https://tools.ietf.org/html/rfc4281
  - May need to research and test effects of `crossOrigin` and potential bugs related to component state
  - Captions should be implemented by showing a dynamic HTML5 video with a track tag.
    - `captions` should accept an array of caption objects for multi-language support
      - `{ src: string, label: string, srcLang: LANGUAGE_CODE, default?: boolean (only one track can be default) }[]`

## Component API ideas

I like Formik as a model. A user can specify an `AudioPlayer` component alone and let the component handle the rest, OR we can break it down to accept a render prop and/or children to let the user render various sub-components as they see fit.

```jsx
<AudioPlayer src={audioFile} {...props} />

// OR
<AudioPlayer src={audioFile}>
  <Scrubber />
  <VolumeControl />
  <PlayControls>
    <BackButton />
    <PlayButton />
    <ForwardButton />
  </PlayControls>
</AudioPlayer>

// OR
<AudioPlayer
  src={audioFile}
  render={({
    play,
    pause,
    isPlaying,
    duration,
    elapsedTime,
    remainingTime
  }) => (
    <div>
      <button onClick={isPlaying ? pause : play}>{isPlaying ? 'Pause' : 'Play'}</button>
      <span>{elapsedTime} of {duration}; only {remainingTime} left to go!</span>
    </div>
  )}
/>
```
