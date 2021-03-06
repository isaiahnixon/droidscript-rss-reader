# DroidScript RSS Reader

This project is done in <a href="http://droidscript.org/">DroidScript</a> which is a really neat JavaScript IDE that I have been dabbling in lately. It is run directly on an Android device but can be connected through WiFi to a browser on any computer, and the scripting can be done there.

This is a simple RSS reader that pulls data from a user-entered URL through XML HTTP requests. The XML then gets processed into HTML and displayed through a WebView.

## Getting Started

These instructions will get you a copy of the project up and running.

### Prerequisites

* First you need the <a href="https://play.google.com/store/apps/details?id=com.smartphoneremote.androidscriptfree&hl=en">DroidScript - JavaScript Mobile Coding IDE</a> from the Google Play Store. 

### Installing

* From the main page of the application, click on the WiFi Connect button in the toolbar. Follow the instructions to access your local IDE from a browser on a laptop or desktop.

* In the Apps tab, create a new JS application, title it what you will, and copy the code from [RSS-Reader.js](RSS-Reader.js) file in this repository into the application.

* Run the application from the browser, which will save the code to your phone and compile it there.

On your phone you should see:

![Example Output](https://raw.githubusercontent.com/isaiahnixon/droidscript-rss-reader/master/example-output.gif)

## Deployment

In order to deploy a DroidScript application outside of your local IDE you will need access to the <a href="https://play.google.com/store/apps/details?id=org.droidscript.droidscriptapkbuilder">APKBuilder plugin</a>. Which can be downloaded directly in the Google Play Store or from the DroidScript application. However, use of this plugin does require either a Premium DroidScript subscription or a paid license.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct, and the process for submitting pull requests.

## Authors

* **Isaiah Nixon** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* <a href="https://github.com/PlatinumSpartan077">Rahul Kanojia</a> - For showing me DroidScript in the first place.
