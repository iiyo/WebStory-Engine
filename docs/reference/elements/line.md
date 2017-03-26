
# [command] line

The line command is used to display what characters say. Every line is associated with a
character and the text between the element's tags will be shown on the textbox associated
with the character.

Because displaying lines of text is so common in a visual novel, the line command has its
own special syntax (see below).

The text of a line command can contain both [local](var.md) and [global](global.md)
variables, as well as HTML.

## Usage

Normal usage:

    (( n: Hello World! ))

Where "n" is the name of the character which speaks the line.

With a local variable:

    (( n: Hello {$name}! ))

With a global (persistent) variable:

    (( n: Hello {$$name} ))

Inserting HTML directly (since version 0.3.0):

    (( n: And <a href="http://webstoryengine.org">this</a> is a link. ))


## Attributes

 * **s:** The speaker, which is a character's internal name.
 * **ifvar:** See [conditionals](conditionals.md)
 * **ifvalue:** See [conditionals](conditionals.md)
 * **ifnot:** See [conditionals](conditionals.md)
 * **stop:** If set to false, the story will continue on the next command without requiring user input.

Please note: If you want to use attributes other than the speaker name, you have to use the
normal element syntax, not the special form for the line command! Example:

```
. line s n, ifvar foo, ifvalue bar, -stop :
    Bla bla bla!
--
```

## Parents

 * [scene](scene.md)

## Children

 * none; element is supposed to contain text

## Related Assets

 * [character](character.md)
 * [textbox](textbox.md)

## Related Commands

 * [global](global.md)
 * [globalize](globalize.md)
 * [var](var.md)
