
# Structure of WebStory Engine story files

A story consists of one main story file and an unlimited number of optional story files that
can be included in the main file. The main story file (`game.xmugly`) must be structured as follows:

    <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
    . ws :
        . settings :
            <!-- Section containing general settings -->
        --
        . assets :
            <!-- Section defining the assets used by the WebStory -->
        --
        . scenes :
            <!-- Section containing scenes, which in turn contain the actual commands -->
        --
    --

The **settings** element contains general settings for the story such as the width and height
of the stage (the part of the site that contains the visible parts of the story).

The **assets** element contains definitions of the things that are part of the story such
as characters and images.

Finally, the *`scenes`* element contains all the scenes that make up what is happening in
your story. Each scene contains commands (which do something to the assets or the story)
and lines (what characters say).


## Using multiple files

All three of the elements settings, assets and scenes can be written into one or more files.
For example, if you want to write all of your scenes in two different files, you can leave out
the `scenes` element from your main story file and instead reference your scene files in the
main story file like so:

    . file type scenes, url story/scenes1.xmugly
    . file type scenes, url story/scenes2.xmugly

This means that all the scenes you have written in the files `story/scenes1.xmugly` and
`story/scenes2.xmugly` will be included into the `scenes` element of the main file (and if the
main file does not contain a `scenes` element, it will be created for you).

The default main story file you get when you just downloaded the WebStory Engine package
looks like this:

    . ws :
        . file type settings, url story/settings.xmugly
        . file type assets, url story/assets.xmugly
        . file type scenes, url story/scenes.xmugly
    --

So if you want to change the settings of the story, you change the file `story/settings.xmugly`.
And if you want to add assets, you edit `story/assets.xmugly`. And you can write your scenes
in `story/scenes.xmugly`.
