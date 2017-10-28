//Define the global variable(s).
var html = "";

//Called when application is started.
function OnStart()
{
    //Create the major components.
    lay = app.CreateLayout( "Linear", "FillXY" );
    header = app.CreateLayout( "Linear", "VCenter" );
    scroll = app.CreateScroller( );
    webView = app.CreateWebView( "", 1, 1, "AllowZoom", true );
    
    //Configure webView.
    webView.Hide();
    webView.CanGoBack();
    webView.SetOnError( webView_OnError );

    //Create an text edit box for url entry. 
	edt = app.CreateTextEdit( "https://news.google.com/news/rss", 0.8 );
	edt.SetMargins( 0, 0.05, 0, 0 );
	header.AddChild( edt ); 

    //Create a button to send request.
	btn = app.CreateButton( "Read RSS Feed", 0.3, 0.1 ); 
	btn.SetMargins( 0, 0.025, 0, 0.025 );
    btn.SetOnTouch( btn_OnTouch );
    header.AddChild( btn );

    //Create a text label to show results.
    scroll.AddChild ( webView );
    
    //Add the layouts to the main layout.
    lay.AddChild( header );
    lay.AddChild( scroll );
    
    //Add layout to app.    
    app.AddLayout( lay );
    

}   

//Handle button press.
function btn_OnTouch() 
{   
    //Send request to remote server.
    var url = edt.GetText();
    app.ShowProgress( "Loading..." );
    request(url);
}

//Handle webView errors.
function webView_OnError()
{
    //Tell the user there was a generic error.
    webView.Hide();
    app.ShowProgress( "Loading..." );
    webView.ClearHistory();
    webView.LoadHtml("<h1>Error, please try again.</h1>");
    webView._top;
    webView.Show();
    app.HideProgress();
}

//Handle requests.
function request(url) 
{
    // Create the GET request and call process().
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { process(xmlhttp) };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Test the data and pass an appropriate response to webView as HTML.
function process(data)
{
    if(data.readyState === 4)
    {
        if(data.status === 200)
        {
            //Gather the XML objects and information about the RSS.
            var rssInfo = data.responseXML.getElementsByTagName("rss");
            var xmlObjects = data.responseXML;
            
            //Test to make sure this is indeed RSS and that it is version 2.
            if(rssInfo.length > 0 && rssInfo.item(0).getAttribute("version") === "2.0")
            {
                
                //Gatther some more detailed information about the feed.
                var feedLength = xmlObjects.getElementsByTagName("item").length;
                var channelTitle = xmlObjects.getElementsByTagName("title").item(0).firstChild.data;
                var channelDescription = xmlObjects.getElementsByTagName("description").item(0).firstChild.data;
                
                //Add the title and description to the HTML.
                html = html 
                    + "<h1>"
                    + channelTitle
                    + "</h1>"
                    + "<h2>"
                    + channelDescription
                    + "</h2>";
                
                //For each item in the feed, add a linked title and the description to the HTML.
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
                
                //Display the results.
                webView.LoadHtml(html);
                webView.SetSize( 1, 0.6 );
                webView.Show();
                app.HideProgress();
            }
            else
            {
                //Tell the user that the RSS was not version 2.0.
                webView.LoadHtml("<h2>RSS version incompatible.</h2>"
                    + "<p>Please input a RSS Version 2.0 feed.</p>");
                webView.SetSize( 1, 0.6 );
                webView.Show();
                app.HideProgress();
            }
        }
        else
        {
            //Tell the user the status of the request.
            webView.LoadHtml("<h1>Status: " + data.status + "</h1>");
            webView.SetSize( 1, 0.6 );
            webView.Show();
            app.HideProgress();
        }
    }
}
