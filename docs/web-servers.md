
# Web Servers for running WebStory Engine

To use WebStory Engine, you need to have a web server. For development purposes, it can be a local server running on your own computer. This page is meant to list some servers you might want to use.

## Local development servers

### Python SimpleHTTPServer

**Note:** User Germinator posted a [tutorial for windows users](https://iiyo.org/f/discussion/37/how-to-test-your-visual-novel-in-local-offline) in the iiyo forums.

Python comes bundled with an HTTP server that you can easily set up to run on your local machine.

To do that, you just need to install Python and then on the command line of your OS, change into the folder that you want to be the root directory for the server and type:

    python -m SimpleHTTPServer

You can get Python for Windows and Mac OS X [on the official site](http://www.python.org/download/). If you use a Linux distribution like Debian or Ubuntu, your OS probably has Python already installed. If not, run:

    sudo apt-get install python

### XAMPP

XAMPP is a full web development server that comes with PHP, MySQL and FTP. Since you won't need any of that for the WebStory Engine, it is better to use the SimpleHTTPServer mentioned above. But XAMPP can be an alternative if for some reason you cannot get SimpleHTTPServer to work.

To install XAMPP on your local machine, follow the guide for your OS on the XAMPP site:

[http://www.apachefriends.org/de/xampp.html](http://www.apachefriends.org/de/xampp.html)

## Non-local web servers

If you want to share your games made with the engine, you need a web server that can be reached from the WWW. The easiest way to do that is to get some kind of managed hosting setting. Since you do not need any scripting languages or fancy stuff on the web server, all available hosting solutions will do, even free hosters.

A user reported that visual novels made with the engine even run on [Dropbox](https://www.dropbox.com/).

The only thing you should make sure that the hoster gives you is either FTP, SFTP or SSH, because using these technologies you can edit files directly on the server, without first editing them locally and then uploading them each time you changed something.

A good free FTP program is [FileZilla](http://filezilla-project.org/).
