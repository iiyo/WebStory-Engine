
# [asset] audio

An asset used for music and sound effects.

Please be aware that different browsers support different types of audio codecs. To support all the major browsers, you will need each audio file in MP3 and in OGG Vorbis format.

| Codec             | Supported by browsers       | type= on [source](source.md) |
|:------------------|:----------------------------|-------------------------------:|
| OGG Vorbis (.ogg) | Chrome, Firefox, Opera      | ogg                            |
| MP3 (.mp3)        | Internet Explorer 9, Chrome | mp3                            |


## Usage

```xml
. audio ~my_music, +loop true, +fade :
    . track title suspense :
        . source href assets/audio/suspense.ogg, type ogg
        . source href assets/audio/suspense.mp3, type mp3
    --
    . track title village :
        . source href assets/audio/village.ogg, type ogg
        . source href assets/audio/village.mp3, type mp3
    --
--
```

```xml
. audio ~my_sfx, -loop, -fade :
    . track title birds :
        . source href assets/audio/birds.ogg, type ogg
        . source href assets/audio/birds.mp3, type mp3
    --
    . track title explosion :
        . source href assets/audio/explosion.ogg, type ogg
        . source href assets/audio/explosion.mp3, type mp3
    --
--
```


## Attributes

 * **name:** The audio's internal name.
 * **loop:** Should it start at the beginning once a track is finished?
   * "true" or "yes"
   * "false" or "no"
 * **fade:** Use fade-in and fade-out when starting and stopping the audio?
   * "true" or "yes"
   * "false" or "no"


## Parents

 * [assets](assets.md)


## Children

 * [track](track.md)


## Related commands

 * [set](set.md)
 * [play](play.md)
 * [stop](stop.md)
