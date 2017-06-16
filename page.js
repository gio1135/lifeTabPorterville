function popUp(URL, width, height) {
	day = new Date();
	id = day.getTime();
	eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=" + width + ",height=" + height + "');");
}

var req;

function navigate(month,year,page_id,parent_level) {
	hide_popup();
	var url = "calendar.php?PAGE_ID="+page_id+"&PARENT_LEVEL="+parent_level+"&month="+month+"&year="+year+"&rnd="+(new Date()).getTime();
	if(window.XMLHttpRequest) {
			req = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
			req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	req.open("GET", url, true);
	req.onreadystatechange = callback;
	req.send(null);
}

function callback() {
	if(req.readyState == 4) {
		if(req.status == 200) {
				response = req.responseText;
				document.getElementById("sc_calendar").innerHTML = response;
		} else {
				alert("There was a problem retrieving the data:\n" + req.statusText);
		}
	}
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

function show_popup(day, text) {
	var coors = findPos(day);
	var popup = document.getElementById("sc_calendar_popup");
	popup.style.display = "block";
	popup.style.top = coors[1] + 'px';
	popup.style.left = coors[0] + 'px';
	while (text.indexOf("@@@") > -1)
		text = text.replace("@@@", "'");
	popup.innerHTML = text;
	set_timer();
}

function hide_popup() {
	var popup = document.getElementById("sc_calendar_popup");
	popup.style.display = "none";
}

var timerID = null;

function set_timer() {
    if (timerID != null)
		clearTimeout(timerID);
    timerID = self.setTimeout("hide_popup()", 2000)
}

function stop_timer() {
    if (timerID != null)
		clearTimeout(timerID);
}

function ajaxGetXmlHttp()
{
	var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
	if (window.ActiveXObject) //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
	{
		for (var i=0; i<activexmodes.length; i++)
		{
			try
			{
				return new ActiveXObject(activexmodes[i])
			}
			catch(e)
			{
			//suppress error
			}
		}
	}
	else if (window.XMLHttpRequest) // if Mozilla, Safari etc
		return new XMLHttpRequest();
	else
		return false;
}

function ajaxUpdateInnerHtml(ajaxDiv, ajaxHtml)
{
	var new_type = document.getElementById(ajaxDiv).tagName;
	var new_element = document.createElement(new_type);
	new_element.innerHTML = ajaxHtml;

	var old_element = document.getElementById(ajaxDiv);
	new_element.id = old_element.id;
	new_element.style.cssText = old_element.style.cssText;
	new_element.className = old_element.className;

	var container = document.getElementById(ajaxDiv).parentNode;
	container.replaceChild(new_element, old_element);

	// events
	if (old_element.onclick != null)
		new_element.onclick = old_element.onclick;
	if (old_element.onmouseover != null)
		new_element.onmouseover = old_element.onmouseover;
	if (old_element.onmouseout != null)
		new_element.onmouseout = old_element.onmouseout;
}

function ajaxUpdateDivInner( ajaxDiv, ajaxUrl, func )
{
	var xmlHttp = ajaxGetXmlHttp();
	xmlHttp.onreadystatechange=function()
	{
		if(xmlHttp.readyState==4)
		{
			var response = xmlHttp.responseText;

			ajaxUpdateInnerHtml(ajaxDiv, response);

			if (func != null)
				func();
		}
	}
	xmlHttp.open("GET",ajaxUrl,true);
	xmlHttp.send(null);
}

function getAlignment( e )
{
	var val = e.style.styleFloat;
	if (val==undefined || val=="") val = e.style.cssFloat;
	if (val==undefined || val=="") val = e.align;
	return val;
}

function getMargin( e )
{
	var val = e.style.marginLeft;
	if (val==undefined || val=="") val = e.style.marginRight;
	if (val==undefined || val=="") val = e.hspace + "px";
	if (val=="-1px") val = "0px";
	return val;
}

function ajaxUpdateItem( itemDiv, itemUrl )
{
	var cacheBuster = Date.parse(new Date());

	var ajaxDivImg = document.getElementById(itemDiv + '_img');
	if (ajaxDivImg == undefined)
		return;

	var sc_width = ajaxDivImg.style.width;
	var sc_height = ajaxDivImg.style.height;
	var sc_margin = getMargin(ajaxDivImg);
	var sc_align = getAlignment(ajaxDivImg);

	var itemID = ajaxDivImg.title;

	var ajaxUrl = itemUrl+'?ID=' + itemID + '&WIDTH=' + sc_width + '&HEIGHT=' + sc_height + '&ITEM_ID=' + itemDiv + '&time=' + cacheBuster;

	ajaxUpdateDivInner(itemDiv, ajaxUrl, function ()
		{
		  	sc_align = sc_align.toLowerCase();
		  	if (sc_align == 'left')
		  		document.getElementById(itemDiv).style.marginRight = sc_margin;
		  	else if (sc_align == 'right')
		  		document.getElementById(itemDiv).style.marginLeft = sc_margin;
		  	else
		  	{
		  		document.getElementById(itemDiv).style.marginLeft = sc_margin;
		  		document.getElementById(itemDiv).style.marginRight = sc_margin;
		  		sc_align = 'none';
		  	}
	  		document.getElementById(itemDiv).style.marginBottom = sc_margin;

		  	document.getElementById(itemDiv).style.cssFloat = sc_align;
		  	document.getElementById(itemDiv).style.styleFloat  = sc_align;
		});
}

function sc_replacePlugins()
{
	var allHTMLTags=document.getElementsByTagName("SPAN");
	for (i=0; i<allHTMLTags.length; i++)
	{
		var e=allHTMLTags[i];
		if (e.className=="scbanner")
			ajaxUpdateItem(e.id, "sc_banner.php");
		else if (e.className=="scpoll")
			ajaxUpdateItem(e.id, "sc_poll.php");
		else if (e.className=="scnews")
			ajaxUpdateItem(e.id, "sc_news.php");
		else if (e.className=="sccalendar")
			ajaxUpdateItem(e.id, "sc_calendar.php");
	}
}

var sc_timerID = null;

function sc_showPopup(itemDiv, itemObj, text)
{
	var coors = findPos(itemObj);
	var popup = document.getElementById(itemDiv);
	popup.style.display = "block";
	popup.style.top = coors[1] + 'px';
	popup.style.left = coors[0] + 'px';
	while (text.indexOf("@@@") > -1)
		text = text.replace("@@@", "\"");

	ajaxUpdateInnerHtml(itemDiv, text);

	sc_stopTimer();
}

function sc_hidePopup(itemDiv)
{
	var popup = document.getElementById(itemDiv);
	popup.style.display = "none";
}

function sc_stopTimer()
{
	if (sc_timerID != null)
		clearTimeout(sc_timerID);
}

function sc_restartTimer(itemDiv)
{
	sc_stopTimer();
	sc_timerID = setTimeout(function(){sc_hidePopup(itemDiv)}, 1000);
}