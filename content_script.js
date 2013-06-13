console.log('start');

//var xmlHttp = null;
var imgUrl = chrome.extension.getURL("like.png");
var mapUrlDom = {};

function getByClass (className, parent) {
 	parent || (parent=document);
 	var descendants=parent.getElementsByTagName('*'), i=-1, e, result=[];
	while (e = descendants[++i]) {
    	if ((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) {
       		result.push(e);
    	}
  	}
  	return result;
}

function getURLByClass (className, parent) {
	var descendants = getByClass(className, parent), 
		i =	-1, 
		e, 
		result=[];
	while (e = descendants[++i]) {
		if (e.getElementsByTagName('a')[0] && e.getElementsByTagName('a')[0].href) {
			result.push(e.getElementsByTagName('a')[0].href);
		}
	}	
	return result;
}

function getAidURLByClass (className, parent) {
	var descendants = getURLByClass(className, parent), 
		i =	-1, 
		e, 
		result=[];
	while (e = descendants[++i]) {
		if (e.indexOf('auction') > -1) {

       		result.push(e.substring(e.indexOf('*')+1,
       								e.indexOf(';_ylt')));
    	}
	}	
	return result;
}

function buildMapUrlDom () {
	var aidURL;
    var subdata, j, dd;
    var descendants = getByClass('title');
 	var big = document.getElementsByTagName('*'), 
 		k, 
 		g;
 	k = -1;
	while (g = big[++k]) {
    	if ((' '+(g['class']||g.className)+' ').indexOf(' title ') > -1) {
			subdata = g.getElementsByTagName('a');
			//console.log(subdata);
			j = -1;
			while (dd = subdata[++j]) {
				if (dd.href) {
					//console.log(dd);
					if (dd.href.indexOf('auction') > -1) {
						aidURL = dd.href.substring(dd.href.indexOf('*')+1,
       									  		   dd.href.indexOf(';_ylt'));
						if (big[k+2] &&
							big[k+2].getElementsByTagName('td')[1]) 
						{
							mapUrlDom[aidURL] = big[k+2].getElementsByTagName('td')[1];
						}
					}
				}
			}
	   	}
  	}
}

function appendFBInfo (aidURL, fbData) {
	/*
	aidURL = 'http://tw.page.bid.yahoo.com/tw/auction/f52773412';
	fbData = {
   		"data": [
      	{
         "url": "http://tw.page.bid.yahoo.com/tw/auction/c86252624",
         "normalized_url": "http://tw.page.bid.yahoo.com/tw/auction/c86252624",
         "share_count": 8,
         "like_count": 2,
         "comment_count": 3,
         "total_count": 13,
         "commentsbox_count": 0,
         "comments_fbid": 611548772193442,
         "click_count": 0
      	}]};
      	*/
    //console.log(fbData.data[0].total_count);

    var old_str;
	if (mapUrlDom[aidURL] &&
		mapUrlDom[aidURL].innerHTML) 
	{
		//console.log(big[k+2].getElementsByTagName('td')[1].innerHTML);
		old_str = mapUrlDom[aidURL].innerHTML;
		mapUrlDom[aidURL].innerHTML = old_str + 
			"<p><img src='"+imgUrl+"' width='60' height='25' style='vertical-align:middle'>"+
			fbData.data[0].total_count+
			"</p>";
	} else {
		console.log(aidURL);
	}

}

function fbOKHandler () {
　	//console.log(xmlHttp.responseText);
	var fbData = JSON.parse(this.responseText);
	var aidURL = fbData.data[0].normalized_url;
	appendFBInfo(aidURL, fbData);
}

function getFBData (aidURL, callback) {

	var fbURI;
	fbURI = "https://graph.facebook.com/fql?q=" + 
			"SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20" + 
			"FROM%20link_stat%20WHERE%20url='" + 
			aidURL + 
			"'";
    console.log("getFBData of "+aidURL);
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
    	if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
　				//console.log(xmlHttp.responseText);
				callback.apply(xmlHttp);
			} else {
        		console.error(xmlHttp.statusText);
    		}
　　		}
    };
    xmlHttp.open("GET", fbURI, true);
    xmlHttp.send(null);
}

//alert(getByClass('title'));
//console.log(getAidURLByClass('title').length);
//console.log(getAidURLByClass('title'));
buildMapUrlDom();
console.log(1);
var aidURLs = getAidURLByClass('title');
console.log(2);
var i =	-1, 
	aidURL;
while (aidURL = aidURLs[++i]) {
	getFBData(aidURL, fbOKHandler);
}
console.log('done');