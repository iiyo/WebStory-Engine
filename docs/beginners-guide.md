
# Beginner's Guide: From Zero To Visual Novel

This guide is intended to be your starting point in the world of making visual novels using the
WebStory engine. This guide assumes that you do not have any experience in programming. If you
do have experience in programming this guide can still be useful to you because it explains
the basic concepts of the engine and the WebStory language.

Although this guide's aim is to make a small visual novel, you can safely read it if you do
not want to make a visual novel but something else using WebStory Engine. The concepts are
still the same for all WebStories. If you don't know what a visual novel is, read the exhausting
[Wikipedia article about visual novels](http://en.wikipedia.org/wiki/Visual_novel).

By the way, what's called a **WebStory** in this documentation is any game or story written in
the WebStory language. A game or story written using the engine does not have to be a **visual novel**, that is why works made with the engine are called WebStories. But a visual novel
made with the engine is also a WebStory automatically. So if this guide talks about the WebStory, 
than what it refers to in this case is the visual novel we are about to write using the engine.

Having said as much, let's begin making our first visual novel with WebStory Engine!

## A note about file paths

This guide uses file paths as they appear in Mac OS X or Linux operating systems. If you are trying to follow this guide on Windows, then all the local file paths written in this guide must use backslashes ("\") instead of forward slashes ("/"). For example, if the guide tells you to open the file `story/assets.xmugly`, you will find this file in `story\assets.xmugly` on Windows.

## What you need

To run the engine and develop with it, you need at least the following things:

 * A good text editor, preferably one with syntax highlighting for XML. I can highly recommend [Visual Studio Code](https://code.visualstudio.com/).
 * A web server. For development, this can be a local server running on your own computer.
 * A way to upload files to your web server. This can be a program capable of FTP, SFTP or SSH.
 * A modern web browser.

If you do not have a web server and are not sure how to get one, read the [web servers page](web-servers.md) before continuing.

## Setting up the engine

First, [download the current version](downloads.md), extract the files in the downloaded archive to a local folder on your computer and upload them to your web server or start your local development server in this folder.

With your browser, go to where you put the files on your web server, for example:

    http://example.com/path_to_wse/

Or if you use Python's SimpleHTTPServer:

    http://localhost:8000/path_to_wse/

If it works, you should be able to play a short example.

## Concepts and definitions

WebStory Engine uses some concepts to describe a story. The most important ones are:

**Stage**: The stage is the area where the visible elements of a WebStory are displayed. It can be used in a standalone web page or it can be part of an existing web page. A stage is a rectangle with a width and height that you can define freely in the settings of the WebStory.

**Asset**: An asset is anything that is used or acted upon in a story. This can be images, sounds, characters,
textboxes and animations, for example.

**ImagePack**: An ImagePack is an asset that bundles related images. The ImagePack shows only one of the images it contains at a time, but effects and actions applied to an ImagePack affect all the images contained within it. That means, for instance, that you can put all images for a character into the same
ImagePack and when you move the ImagePack, you can be sure that all of the images move as well so
that if you change the displayed image in an ImagePack from one image to another image, the new image
will be displayed at exactly the same position as the formerly displayed image. ImagePacks are powerful
enough that they can be used for both foreground images like character sprites and background images.

**Textbox**: The Textbox asset is used to display what the characters or a narrator says. It can either
be used in **ADV** (ADVenture) mode, which means that only one line of dialog or narration will be shown at a time or it can be used in **NVL** (NoVeL) mode, which means that multiple lines will be shown and only disappear once you manually clear the textbox. A WebStory can contain any number of different textboxes, all featuring their own custom styles if you want to. For keeping this guide simple we will only use one textbox in ADV mode though.

**Character**: The Character asset is used to describe someone who takes part in the story. A character has both an internal name, which is used to reference it inside the story and a display name that is shown
to the player. It is also possible to have nameless characters (nameless in the sense of not having a displayable name), for example if your story features a nameless narrator. Each character is associated with a textbox asset so that the lines they say will appear inside of that textbox.

**Line**: A line is something that a character or a narrator says. It will be displayed on the textbox
that is associated with the character who is speaking. "Line" does not mean that the text used has to
be just one single line, it can in fact be multiple lines and sentences. It is meant in the sense of
lines in a play. You need to make sure though that the text inside a line is short enough to fit inside
the textbox that is used.

**Command**: A command is a single element that is used to describe some action that is about to happen. For example, the `show` command is used to make an asset visible on the stage, the `play` command is used to start an audio track and the `wait` command is used to wait for all previous commands to finish executing before executing the following commands.

**Scene**: A scene is a series of commands. It has a unique ID to reference it. The commands inside a scene are executed in the order they appear from top to bottom. The engine can be told to jump to another scene using either a choice menu, a `goto` command or a `sub` command. The `goto` command jumps to another scene and does not return to the scene from where it jumped. The `sub` command will also jump to another scene but if there are no more commands to execute in the other scene, the engine will return to the scene where the `sub` command is and execute the remaining commands in that scene. If no more commands are available in a scene and there is no other scene to return to, the game is over.

**Choice menu**: A choice menu is a menu that enables the player to select one of many options displayed on screen. Each option can be tied to a scene so that if the user clicks on the option, the engine will jump to the other scene that is associated with the option. This is a technique called branching and it enables the player to have some influence on the outcome of the story.

## A first look at the WebStory language

Open up the file `story/scenes.xmugly` with your text editor. What you see here is everything that makes up the example WebStory you just played.

The WebStory language is XML-based, therefore a few words about XML, if you have not heard of it yet:

XML is a simple language (not a programming language) for annotating text documents with 
meaningful data. For example, HTML, the language in which web pages are written is 
also an XML-like language.

Xmugly has three important concepts that you should have heard of before reading further in this guide:

### Elements

Xmugly documents consist of a series of so-called **elements**, which are nested inside of each other.

An element looks like this:

    . elementName attribute value :
        Some content...
    --

Each element starts with a line consisting of the name of the element, optionally followed by one or more attribute name and value pairs separated by commas. If the element contains other elements, this first line ends with ":", otherwise it ends with a newline.

An element's child elements are contained between the ":" on the first line and a "--" that always needs to be on its own line.

If an element is not intended to contain any other elements, it looks like this instead:

    . elementName attribute value

### Attributes

**Attributes** are name-value pairs that belong to an element. In the example above, the attribute is:

    attribute value

The first word is the attribute's **name** and everything else up to the next comma, colon or till the end of the current line is the **value** of the attribute.

If an attribute value needs to contain a comma, you can enclose the attribute's value in quotes:

   attribute "first, second"

### Comments

Comments in xmugly look like this:

    <!-- This is a comment. -->

A comment is some text that will never be displayed or in any other way influence the contents of the document. It's only purpose is to tell someone that reads the document source code something about the source code. You can use comments inside of your WebStories to describe what you intended to do at some points if that is not obvious. Comments are not only useful to help other people understand your code, they help yourself understand your code when you did not look at it for a long time and forgot why you did certain things the way you did them.


## Structure of a WebStory

A webstory basically consists of these xmugly files (though you can add more files if you want to):

 * `assets.xmugly`: Definitions for all the assets used in the game
 * `scenes.xmugly`: Describes what happens in the game
 * `settings.xmugly`: Contains some general settings for the game
 * `game.xmugly`: The main file loading all the others -- you only need to edit it if you want to add more xmugly files, which we won't do in this guide

All these files are located in the `story/` folder of a WebStory project.

## Planning the visual novel

In most cases, it is a wise idea to take a bit of time upfront planning a visual novel before you actually start writing it in WebStory Engine. It is especially important to know what the story will be about, to think about a basic plot outline and to make a list of all the assets you will need for your visual novel.

For this guide we will be writing a really short visual novel about a fisher and a tourist, loosely based on Heinrich Böll's famous story "Anecdote concerning the Lowering of Productivity". In the original short story, a tourist accidentally awakens a fisher who is sleeping on the beach. The tourist then goes on to ask the fisher why he's lazing around on the beach in the middle of the day instead of fishing out on the sea. He explains to the fisher that if he'd do that then in a few years he might even be able to grow such a big company that he can export his fish directly to other countries. After being asked by the fisher what the point of doing all that work would be, the tourist answers him that he would then be rich enough to laze around on the beach all day without worrying about a thing. When the fisher then tells him that he's already doing that the tourist leaves confused and deeply emerged in thought.

To simplify the story, we will show only what the fisher sees. That means we only need character art for the tourist. We also need some kind of background image. Considering that the fisher is lying down on the beach, we will go with an image of a blue sky with some clouds.

For the images of the tourist, we will just use some free clipart images from openclipart.org.

## Further preparations

You can [download the finished game here](https://github.com/iiyo/wse-beginners-guide-game/archive/master.zip). After downloading, extract the archive and copy all the files to a directory on your server (or to a local folder on your computer and start your web server there). Then open this location on your server in your browser. You should now be able to play the game we're about to make here -- do so and then come back to this guide.

Ready? Then copy all the files in the finished game's `assets/` folder to the `assets/` folder in your WebStory project. This folder contains all the sounds and images we need for our game and since we don't want to edit any images or sounds in this guide, we can just copy them.

## Setting up the stage

For the engine to display anything it needs to have a stage. The stage is defined in the `settings.xmugly` file. You can basically just use the following line as is and write it into the settings section:

    . stage width 1366px, height 768px, +create, +center, +resize

With this we tell the engine that we want it to create a new stage and that it should be 1366 pixels wide and 768 pixels high. With `+center` and `+resize` we also tell the engine that we want the stage to be exactly in the middle of the window, since in our example the stage is the only thing in the web page anyway, and be stretched to fill the available space while keeping the original aspect ratio.

## Defining our assets

Let's create some assets for our visual novel. We said above that we wanted to have some character images for the tourist and a sky image as the background. Since the character images for the tourist are all related and should be placed directly above each other, we will use an ImagePack for that. Into the asset section, we write the following to define our ImagePack:

    . imagepack name tourist, x 410px, y 150px, z 20 :
        . image src assets/images/tourist_calm.png, name calm
        . image src assets/images/tourist_happy.png, name happy
        . image src assets/images/tourist_shocked.png, name shocked
        . image src assets/images/tourist_sunglasses.png, name sunglasses
    --

On the ImagePack's element itself we give it a name to identify it later on. We also tell the engine that we want the image to appear 410 pixels from the left border (on the x axis) of the stage and 150 pixels away from the top (on the y axis) border. We also define a z attribute with a value of 20. The z attribute is for defining which assets will be displayed first and which will be displayed last. Since we will have two ImagePacks in the story and we want the character's images to appear in front of the background, we give the character's images a higher z value.

Inside the &lt;imagepack&gt; element we define which images are part of the ImagePack. We give each image a src ("source") attribute pointing to one of the image files. We also give it a name to identify it in the story.

We do the same now for the background image. That gives us:

    . imagepack name background :
        . image src assets/images/sky.jpg, name sky
    --

We do not define any x or y attributes on this one. That is because we want the image to fill the entire stage and the default values for x and y are 0 and 0, which corresponds to the upper left corner of the stage.

Next we will need some characters. We have the tourist, then there's the fisher and on top of that we need another character that will do the narration. The story will be told from the fisher's point of view but since we do not want the narrator to have a display name, we need to give him an own character asset:

    . character name f, textbox tb_main :
        . displayname :
            Fisher
        --
    --
    
    . character name t, textbox tb_main :
        . displayname :
            Tourist
        --
    --
    
    . character name n, textbox tb_main

Notice that we give each character a one-letter internal name. You can use longer names here, too, of course. But since we do not want our fingers to bleed because we need to type so many letters, we use short names instead. The player will only ever see the display name anyway. We also tell the engine that all of our character's lines will appear on the textbox with the internal name "tb_main".

Speaking of which, we need to define the textbox as well, of course:

    . textbox name tb_main, width 890px, height 100px, x 5px, y 355px, namebox yes, speed 50 :
        <nameTemplate>{name}</nameTemplate>
    --

What we do here is that we define a textbox called "tb_main" which is 890 pixels wide and 100 pixels high. Put another way, that means the textbox is 10 pixel smaller in width than the stage. We also tell the engine that we want the textbox to appear 5 pixels away from the left border (x) and 355 pixels away from the top border (y). If you did the math and compare this with the stage's dimensions we defined above, you will see that the textbox will appear at the bottom of the screen, 5 pixels away from the left, the right and also the bottom border.

With the attribute "speed" we tell the engine how fast we want the text to be displayed using a typewriter-like effect. The unit used here is characters per second. If you don't want to use the typewriter effect, you can just set this to "0".

The last thing we need to do for the textbox asset is that we set the namebox attribute to "yes". What this does is display the display names of the characters in a separate box on top of the textbox. If we would set this attribute to "no" the display names would be part of the normal text instead.

With the `nameTemplate` element, we tell the engine how it should display the names of the characters. You can use any characters you want here and using HTML is also possibe. The {name} placeholder will be replaced by the actual name of the character who's speaking.

If you feel a little overwhelmed right now don't worry: Defining the assets is actually the hardest part of this guide.

## Writing the dialog

With all the assets defined we are now ready to start writing the dialog of our WebStory. To do that, we create a new `scene` element inside of the `scenes` section like this:

    . scene #start
        
    --

The id attribute is an identifier for the scene. It can be anything you want, you just need to make sure that it is unique among all scenes you define. By the way, although this scene is called "start" that does not make it the first scene automatically. Instead the first scene to be displayed is always the scene that is defined first in the `scenes` section.

First, we want to set the background asset to the sky image and then show it on the stage:

    . set @background, image sky
    . show @background

Save the file and check with your browser if it worked. You should see the sky image fading in and then staying that way.

Next we need to make the textbox visible:

    . show @tb_main

No we can put our first line of text there, letting the narrator say something:

    (( n: Such a nice day... ))

The text after the colon is what's shown on the stage inside the textbox. The `n` before the colon tells the engine that the character with the short name "n" (that is, our narrator) is the speaker. If that character has a name, it will be put in the name box on top of the textbox. Since our narrator has no name, only what he says will be displayed.

One interesting thing worth mentioning here is that there are commands that require the user to click on the screen or push some button and others that do not wait and start the following command immediately. `line` commands by default will always require the player to click. Commands like `show`, `set` or `hide` will all start immediately until a `line` command is found. That basically means that if you write something like this:

    . show @tourist
    . show @tb_main

Both effects will be executed in parallel. If you want the effects to wait for each other instead, you need to use the `wait` command:

    . show @tourist
    . wait
    . show @tb_main

This way, first the tourist asset will be displayed and only after that is done will the "tb_main" textbox be displayed. Because a `line` command stops the execution of the next commands until the user clicks the stage you often don't need to use `wait` at all. So since we write a really simple visual novel here, we won't need that, but I think it is important to know that controlling and timing the flow of commands is possible like that.

To make things shorter in this guide, we will not put all the lines into our visual novel yet and instead move on to use some other commands. You can play the finished visual novel at the end of this page. We will structure the story as follows:

First, the narrator talks a bit about his life.

Then, when he wants to take a nap, suddenly a tourist pops up, making photos with an annoyingly loud camera. After seeing the fisher, the tourist tries to talk to him. He keeps pestering the fisher until the fisher has no other choice than to do something about it. What will he do? Will he get angry or just answer the tourist in the hopes that he will leave sooner then? Well, we will let the player decide!

To do that, we need a choice command. A choice command, as explained above, pops up a menu where the player can select one of a few options:

    (( n: That annoying little pest just didn't stop bugging me. So I thought it would
        be a good idea to...
    ))
    
    . choice :
        . option label "... get angry at him.", scene angry
        . option label "... answer him.", scene answer
    --

The label attribute is used to set the text of the option button that gets displayed. In the scene attribute, we put the ID of another scene we are about to write. When the player clicks on one of these
options, the engine will change the scene to the one mentioned in the scene attribute.

Now we just need to write the remaining two scenes and put all the lines we want to have in there:

    . scene #angry :
        <!-- ... -->
        . restart
    --
    
    . scene #answer :
        <!-- ... -->
        . restart
    --

At the end of both scenes we put a `restart` command. As the name suggests, this clears the stage and all assets' settings and plays the visual novel from the beginning again.

And with that, we are pretty much finished with our first WebStory - wohoo! 

## The finished game

The complete assets.xmugly file now looks like this:

    . imagepack name tourist, width 332px, height 360px, x 50%, xAnchor 50%, y 50%, yAnchor 50%, z 20 :
        . image src assets/images/tourist_angry.png, name angry
        . image src assets/images/tourist_calm.png, name calm
        . image src assets/images/tourist_happy.png, name happy
        . image src assets/images/tourist_shocked.png, name shocked
        . image src assets/images/tourist_sunglasses.png, name sunglasses
    --
    
    . background name background, src assets/images/Evening_clouds_C_01.jpg
    
    . character name f, textbox tb_main :
        . displayname :
            Fisher
        --
    --
    
    . character name t, textbox tb_main :
        . displayname :
            Tourist
        --
    --
    
    . character name n, textbox tb_main
    
    . textbox name tb_main, width 1326px, height 90px, x 50%, xAnchor 50%, y 96%, yAnchor 100%, +namebox, speed 50 :
        . nameTemplate :
            {name}
        --
    --
    
    . audio name ambience, +loop, +fade :
        . track title harbour :
            . source href assets/audio/harbour.ogg, type ogg
            . source href assets/audio/harbour.mp3, type mp3
        --
    --
    

And our scenes.xmugly file should look like this:

    . scene #start :
        
        . trigger name next_on_right, action activate
        . trigger name next_on_space, action activate
        
        . set @ambience, track harbour
        . move @tourist, x 50%, xAnchor 50%, y 50%, yAnchor 50%, :0
        . set @background, image sky
        . show @background
        . play @ambience
        
        . show @tb_main
        
        (( n: Such a nice day... ))
        (( n: The sun seemed to be smiling as its rays gently warmed my body. ))
        (( n : Lying on my back on the peer, I was looking up at a beautiful sky. ))
        (( n: The sounds of seagulls. Waves crashing against my trusty old boat. ))
        (( n: I caught a lot of fish today. Enough for maybe two days. ))
        (( n: Having done all the work for the day, I could just relax the rest of it.
            Could life be any more fulfilling than that? ))
        
        . hide @background
        
        (( n: I took a deep breath and closed my eyes. ))
        (( n: *Click!* ))
        (( n: Huh? ))
        (( n: *Click!* *Click!* ))
        (( n: What the... what is this sound? ))
        (( n: *Click!* ))
        
        . show @background
        
        (( n: Annoyed I opened my eyes. ))
        (( n: It seemed one of those damn rich tourists was taking photographs of god knows what. ))
        (( n: Stuff that obviously only tourists would be interested in.
            Stones lying around and crap like that. ))
        (( n: Although he wore typical tourist clothes, I'd bet my ass that he was some kind of
            businessman in his day-to-day life. ))
        (( n: I could totally imagine him wearing an expensive black suit and one of those
            slave leashes around his neck, which city people seem to be so fond of. ))
        (( n: After taking a photo of my boat, he finally noticed me and waved. ))
        (( n: I turned my head and ignored him. He didn't get the message, obviously,
            as he approached me further. ))
        
        . set @tourist, image sunglasses, :0
        . show @tourist
        
        (( t: Hello there! I didn't notice you at all before. Did I wake you? Well, sorry about that,
            hahaha! ))
        
        . set @tourist, image happy
        
        (( n: He took off his sunglasses. I could tell that he was much younger than me.
            15, maybe 20 years. ))
        (( f: ... ))
        (( t: So.. what are you doing here in the middle of the day? ))
        (( f: ... ))
        (( t: Not working? Why not? Are you sick? ))
        (( n: That annoying little pest just didn't stop bugging me. So I thought it would
            be a good idea to... ))
        
        . choice :
            . option label "... get angry at him.", scene angry
            . option label "... answer him.", scene answer
        --
    --

    . scene #angry :
        
        . set @tourist, image shocked, :200
        
        (( f: Can you please SHUT UP and leave me the f*** alone?
            What the heck do you think I'm doing here, huh? ))
        (( t: Well, I... ))
        (( f: Can't you see I'm trying to sleep here? Do you have eyes in that head of yours? ))
        
        . set @tourist, image calm, :200
        
        (( f: Really now, can't you goddamn tourists not just go fall off a cliff or something? ))
        (( t: I.. I'm so sorry... ))
        
        . hide @tourist
        
        (( n: He left in a hurry. Well, good for him. God knows what I'd do to someone
            as annoying as him. ))
        
        . restart
    --

    . scene #answer :
        
        (( f: ...no. ))
        (( t: Pardon? I didn't quite catch that? ))
        (( f: No. I'm alright. ))
        (( t: Ah, I see... so why don't you go fishing then? I mean, it's such a nice wheather. ))
        (( f: ... ))
        (( t: Aren't these perfect conditions for catching some more fish? ))
        (( t: I mean... don't you want to take that opportunity? ))
        (( t: Just think about it for a moment. If you would go fishing not once but... say twice.
            No, maybe even three times a day? ))
        (( t: In no time, you'd be able to get a motor for that boat of yours. ))
        (( f: ... ))
        (( t: And then... let's say a year from now, you could just buy a better boat. You'd be able
            to catch so much more fish like that. ))
        (( t: Oh, I know! Then you could start your own fishing company. You'd hire some men,
            buy some more boats... ))
        (( t: And before you could even blink you'd be the big boss. ))
        (( t: You'd be so rich then... ))
        (( f: ... ))
        (( f: And then? What? ))
        (( t: Well, you'd be a made man. You could laze around the coast all day.
            What a life that'd be, huh? ))
        (( f: Well, I hate to bring the shocking news to you, but you know...
            I'm already doing that right now. ))
        
        . set @tourist, image calm
        
        (( t: ... ))
        (( f: ... ))
        
        . hide @tourist
        
        (( n: That rendered him speechless. He looked like I told him that his way of life
            was pointless. A total and utter failure. Like he was some dumb idiot and no one
            ever told him what life was all about. ))
        (( n: And maybe... I really did that. ))
        
        . restart
    --


## Attributions

The tourist's character sprites are in the public domain and were taken from "pitr" of openclipart.org:
http://openclipart.org/user-detail/pitr

The sky background is in the public domain, too. It was made by Lemmasoft forums user "HumbertTheHorse":
http://lemmasoft.renai.us/forums/viewtopic.php?f=52&t=15568


## Where to learn more

A good place to learn about all the features of the engine is to have a look at the language reference:

[List of all WebStory elements](reference/language.md)

