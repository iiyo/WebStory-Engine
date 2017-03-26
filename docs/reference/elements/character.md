
# [asset] character

Element describing a character asset in the asset section.

A character has an internal name, by which it is referenced by commands. It also has an
optional display name. If no display name is supplied, no name will be shown in the textbox
or the textbox's name box.

Each character must be associated with a textbox. There can be multiple textboxes on the stage
at once so it is possible to let some characters speak to one textbox and some other characters
speak to another textbox.

## Usage

In the assets section:

```xml
<!-- A named character: -->
. character ~s, textbox tb_main :
    <displayname>Sylvie</displayname>
--

<!-- A nameless character, e.g. the narrator: -->
. character ~n, textbox tb_main
```

## Attributes

 * **name:** The character's internal name.
 * **textbox:** The textbox which the character's lines will appear on.

## Parents

 * [assets](assets.md)

## Children

 * [displayname](displayname.md)


