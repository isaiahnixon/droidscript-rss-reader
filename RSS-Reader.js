// Set the empty html variable as global.
var html = "";

/**
 * Called when application is started.
 */
function OnStart()
{
    // Create the major components of the application.
    lay = app.CreateLayout( "linear", "VCenter,FillXY" );
    scroll = app.CreateScroller( );
    webView = app.CreateWebView( 1, 1, "IgnoreErrors,NoScrollBars,UseBrowser", true );
    
    // Create the back and forward buttons.
    back = app.CreateButton( "Back" );
    back.SetOnTouch( back_OnTouch );
    forward = app.CreateButton ( "Forward" );
    forward.SetOnTouch( forward_OnTouch );
    
    // Create the toolbar.
    toolbar = app.CreateLayout( "linear", "horizontal" );
    toolbar.AddChild( back );
    toolbar.AddChild( forward );
	
    // Create the tabs.
    tabs = app.CreateTabs( "RSS Select,Feed", 1, 1, "VCenter" );
    tabs.SetOnChange( tabs_OnChange );
    lay.AddChild( tabs );
    
    // Define the tab layouts.
    layRSS = tabs.GetLayout( "RSS Select" );
    layFeed = tabs.GetLayout( "Feed" );
    
    // Create a text edit box for url entry. 
    edt = app.CreateTextEdit( "https://news.google.com/news/rss", 0.8 );
    edt.SetMargins( 0, 0.05, 0, 0 );
    layRSS.AddChild( edt );
    
    // Create a button to send request.
    read = app.CreateButton( "Read RSS Feed", 0.3, 0.1 ); 
    read.SetMargins( 0, 0.025, 0, 0.025 );
    read.SetOnTouch( read_OnTouch );
    layRSS.AddChild( read );
    
    
    // Add the scroller to the webView.
    scroll.AddChild ( webView );
    
    // Add the scroller and the back button to the feed.
    layFeed.AddChild( toolbar );
    layFeed.AddChild( scroll );
    
	
    // Add layout to app.	
    app.AddLayout( lay );
}

/**
 * Displays the name of the active tab.
 * 
 * @param name
 *  The name of the tab.
 */
function tabs_OnChange( name )
{
    app.ShowPopup( name );
}

/**
 * Handles the pressing of the read button.
 */
function read_OnTouch() 
{   
    // Gather the text and pass it to request().
    var url = edt.GetText();
    app.ShowProgress( "Loading..." );
    request(url);
    
    // Switch over to the Feed tab.
    tabs.ShowTab( "Feed" );
}

/**
 * Handles the pressing of the back button through webView's Back().
 */
function back_OnTouch() 
{   if(webView.CanGoBack)
    {
        webView.Back();
    }
}

/**
 * Handles the pressing of the forward button through webView's Forward().
 */
function forward_OnTouch() 
{   
    if(webView.CanGoForward)
    {
        webView.Forward();
    }
}

/**
 * Creates the XMLHttpRequest.
 * 
 * @param url
 *  The url to do a GET request from.
 */
function request(url) 
{
    // Create the GET request and call process().
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { process(xmlhttp) };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Test the data and pass an appropriate response to webView as HTML.
 * 
 * @param data
 *  The output of the XMLHttpRequest.
 */
function process(data)
{
    if(data.readyState === 4)
    {
        if(data.status === 200)
        {
            // Reset the webView.
            webView.ClearHistory();
            webView.Hide();
            
            // Reset the html variable.
            html = "";
            
            // Gather the XML objects and information about the RSS.
            var rssInfo = data.responseXML.getElementsByTagName("rss");
            var feedInfo = data.responseXML.getElementsByTagName("feed");
            var xmlObjects = data.responseXML;
            
            // Test if the RSS is version 2.
            if(rssInfo.length > 0 && rssInfo.item(0) !== 'undefined' && rssInfo.item(0).getAttribute("version") === "2.0")
            {
                
                // Gather some more detailed information about the feed.
                var feedLength = xmlObjects.getElementsByTagName("item").length;
                var channelTitle = xmlObjects.getElementsByTagName("title").item(0).firstChild.data;
                var channelDescription = xmlObjects.getElementsByTagName("description").item(0).firstChild.data;
                
                // Add the title and description to the HTML.
                html = html 
                    + "<h1>"
                    + channelTitle
                    + "</h1>"
                    + "<h2>"
                    + channelDescription
                    + "</h2>";
                
                // For each item in the feed, add a linked title and the description to the HTML.
                for (var i = 1; i < feedLength; i ++)
                {
                    var item = xmlObjects.getElementsByTagName("item").item(i);
                    html = html 
                        + "<p><strong><a href=\""
                        + item.getElementsByTagName("link").item(0).firstChild.data
                        + "\">"
                        + item.getElementsByTagName("title").item(0).firstChild.data 
                        + "</a></strong></p><p>"
                        + item.getElementsByTagName("description").item(0).firstChild.data
                        + "</p>";
                }
                
                // Display the results.
                webView.LoadHtml(html);
                webView.SetSize( 1, 0.6 );
                webView.Show();
                app.HideProgress();
            }
			// Test if the RSS is Atom.
            else if(feedInfo.length > 0 && feedInfo.item(0) !== 'undefined' && feedInfo.item(0).getAttribute("xmlns") === "http://www.w3.org/2005/Atom")
            {
                // Gather the XML objects.
                var xmlObjects = data.responseXML;
            
                // Gather some information about the feed.
                var feedLength = xmlObjects.getElementsByTagName("entry").length;
                var channelTitle = xmlObjects.getElementsByTagName("title").item(0).firstChild.data;
                
                // Add the title to the HTML.
                html = html 
                    + "<h1>"
                    + channelTitle
                    + "</h1>";
                
                // For each item in the feed, add a linked title and the description to the HTML.
                for (var i = 1; i < feedLength; i ++)
                {
                    var item = xmlObjects.getElementsByTagName("entry").item(i);
                    html = html 
                        + "<p><strong><a href=\""
                        + item.getElementsByTagName("link").item(0).getAttribute("href")
                        + "\">"
                        + item.getElementsByTagName("title").item(0).firstChild.data 
                        + "</a></strong></p><p>"
                        + item.getElementsByTagName("content").item(0).firstChild.data
                        + "</p>";
                }
                
                // Display the results.
                webView.LoadHtml(html);
                webView.SetSize( 1, 0.6 );
                webView.Show();
                app.HideProgress();
            }
            else
            {
                // Tell the user that the RSS was not version 2.0.
                webView.LoadHtml("<h2>RSS version incompatible.</h2>"
                    + "<p>Please input a RSS Version 2.0 feed or an RSS Atom feed.</p>");
                webView.SetSize( 1, 0.6 );
                webView.Show();
                app.HideProgress();
            }
        }
        else
        {
            // Tell the user the status of the request.
            webView.LoadHtml("<h1>Status: " + data.status + "</h1>");
            webView.SetSize( 1, 0.6 );
            webView.Show();
            app.HideProgress();
        }
    }
}