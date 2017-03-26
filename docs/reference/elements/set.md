
# [command] set

Command that can be used to set the current image on an [imagepack](imagepack.md) or the
current audio track on an [audio](audio.md) asset.

## Usage

On an audio asset:

    . set @my_audio, track the_track

On an ImagePack:

    . set @my_image, image smiling, :200

## Attribute

 * **asset:** The internal name of the asset to act upon.
 * **track:** (Only on audio assets) The track that will be set as the current track.
 * **image:** (Only on imagepack assets) The image name that will be set as the current image.
 * **duration:** (Only on imagepack assets) The duration in milliseconds to fade-in the image.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)

## Parents

 * [scene](scene.md)

## Children

 * none
