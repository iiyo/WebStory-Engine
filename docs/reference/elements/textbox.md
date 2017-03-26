
# [asset] textbox

Defines a Textbox asset. Textboxes display the actual story, the dialogs of the characters
and what the narrator says.


## Styling the textbox differently for each character

When a character with a display name is speaking, the textbox with the character's line can be
identified in CSS with ".textbox.wse_character_[characterId]". The character ID is the name by
which the character is referenced in the line command, not the display name. If a character has
no display name a "wse_no_character" CSS class is added to the textbox.


## Attributes

 * **name**: The unique name of the textbox. Used in various commands to identify the textbox.
 * **behaviour**: The behaviour of the textbox. Can be "adv" for adventure-like or "nvl" for novel-like.
 * **x**: The initial horizontal position of the textbox relative to the upper left corner of the stage. Supported units: px and %.
 * **y**: The same as the x attribute, but for the vertical position.
 * **z**: The z-index of the textbox. Determines the order in which assets are displayed.
 * **width**: The width of the textbox in pixels (e.g. "12px") or percentage (e.g. "40%") of the stage width.
 * **height**: Height of the textbox; pixels or percentage.
 * **cssid**: A CSS id for the asset. Can be used to give the textbox a custom style.
 * **namebox**: "yes" or "no". If set to "yes", character names will be displayed in a separate box. If set to "no", character names are displayed inside the text.
 * **speed**: The speed of the typewriter effect in characters per second. If it is set to 0, the text will just be dumped into the textbox, which is the default.
 * **fadeDuration**: The number of milliseconds for the fade-out of the old text and the fade-in of the new text. Default is 0 which means no fade. This attribute does not apply when speed= is greater than 0, that is, when the typewriter effect is active. (Available since 0.3.5)


## Parents

 * [assets](assets.md)


## Children

 * [nameTemplate](nameTemplate.md)


## Related commands

 * [show](show.md)
 * [hide](hide.md)
 * [move](move.md)
 * [flicker](flicker.md)
 * [flash](flash.md)
 * [clear](clear.md)
