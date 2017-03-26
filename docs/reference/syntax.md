
# WebStory Language Syntax

WebStory Engine games are written in [xmugly](https://npmjs.org/package/xmugly), which is a
nicer syntax for [XML](https://en.wikipedia.org/wiki/XML) and stands for "XML less ugly".


## Understanding xmugly syntax

Xmugly and XML share some concepts that you should be able to tell apart for understanding
this documentation.


### Elements and attributes

An element in xmugly looks like this:

    . elementName attribute1 value1, attribute2 value2

An element starts with a dot and has a **name** (the `elementName` above) and zero or more
**attributes**. Each attribute conists of a name and a value (e.g. `attribute1` above is the
name of the first attribute, and its value is `value1`). An element must always be on its own
line and the first non-space character of this line must be a `.`.

Elements can also contain text and other elements. Let's look at an example. The following
element `parent` contains some text `This is text.` as well as an element `child`: 

    . parent :
        This is text.
        . child
    --

Notice that the parent has a colon (`:`) at the end of its line. This means that this element
has some content. The end of the element's content is signaled by the `--` (also on its own line).

Of course elements can have **both** attributes and content like in this example:

    . parent name Mark, age 55 :
        . child name Max, age 18
    --

Although the attributes of an element are separated by commas, an attribute value can also
contain commas if you put it in quotes:

    . element attr1 "foo, bar", attr2 val2

In this case, the first attribute is called `attr1` and its value is `foo, bar`.


### Special characters

In XML and therefore in xmugly, there are some special characters that cannot be used in
some places. If you want to use such characters, you need to *encode* them, which means
you have to replace what you actually want to write with something a little more cryptic.

The following is a list of all special XML characters and how to encode them:

| Character | Encoding | Must be encoded...            |
|:----------|:---------|:------------------------------|
| <         | &lt;     | ...everywhere                 |
| >         | &gt;     | ...everywhere                 |
| &         | &amp;    | ...everywhere                 |
| '         | &apos;   | ...inside of attribute values |
| "         | &quot;   | ...inside of attribute values |


### Shorthand for attributes

Some attributes are used so often in story files that there's a shorter way to write them.
The following is an element with all the shorthand attributes available:

    . foo @marc, :200, #marcId, +create, -resize

This is the same as writing:

    . foo asset marc, duration 200, id marcId, create yes, resize no

The following shorthand notations are available for attributes:

| Shorthand | Attribute Name | Attribute Value |
|:----------|:---------------|:----------------|
| @foo      | asset          | foo             |
| ~foo      | name           | foo             |
| #foo      | id             | foo             |
| :200      | duration       | 200             |
| +create   | create         | yes             |
| -create   | create         | no              |
