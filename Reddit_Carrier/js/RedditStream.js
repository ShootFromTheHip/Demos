function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes(); 
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
};
function daysBetween(timeStampA, timeStampB) {
	var oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
	var firstDate = new Date(timeStampA);
	var secondDate = new Date(timeStampB);
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	return diffDays;
};
window.email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
window.fmtMSS = function(s){return(s-(s%=60))/60+(9<s?':':':0')+s};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.editMode = false;
window.speedMult = .6;
window.addEventListener('load', function() {
	GetAllHotReddits();
	HookUpControls();
	sizeAdjust();
	BoardVisit();
});
window.addEventListener('resize', function() {
	sizeAdjust();
});
//
function sizeAdjust() {
	var width = window.innerWidth - 30;
	var ratio = .073;
	if(window.innerWidth < 1780) {
		ratio = .075 - (1920/window.innerWidth) / 500;
	}
	var offset = width * ratio;
	if(window.innerWidth > 2780) {
		offset = offset * .5; // Zoom 2 CSS will throw this off.
	}
	document.querySelector(".boardChatInnerShell").style = ("top:" + offset + "px;height:calc(100% - " + offset + "px);");
}
function showNotification(notificationText) {
	if(!window.isNotifying) {
		window.isNotifying = true;
		document.querySelector(".notificationBlock").innerHTML = notificationText;
		document.querySelector(".notificationShell").style = "";
		//
		setTimeout(function(){ 
			document.querySelector(".notificationShell").classList = "notificationShell notificationHideShell";
			setTimeout(function(){ 
				document.querySelector(".notificationBlock").innerHTML = "";
				document.querySelector(".notificationShell").style = "display: none;";
				document.querySelector(".notificationShell").classList = "notificationShell";
				window.isNotifying = false;
			}, 1160);
		}, 2400);
	} else {
		document.querySelector(".notificationBlock").innerHTML = notificationText;
	}
}
function controlSlow() {
	if(!window.speedMult) {
		window.speedMult = .6;
	}
	var textOfSpeed = "normal";
	switch(window.speedMult) {
		case .08:
			window.speedMult = .3;
			textOfSpeed = "fast";
			break;
		case .3:
			window.speedMult = .6;
			textOfSpeed = "normal";
			break;
		case .6:
			window.speedMult = 1.2;
			textOfSpeed = "slow";
			break;
		case 1.2:
			window.speedMult = 2;
			textOfSpeed = "very slow";
			break;
		case 2:
			window.speedMult = 2;
			textOfSpeed = "very slow";
			break;
	}
	showNotification("Slow down to " + textOfSpeed);
	console.info('%c REDDIT_STREAM Slower ' + window.speedMult, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
}
function controlFast() {
	if(!window.speedMult) {
		window.speedMult = .6;
	}
	var textOfSpeed = "";
	switch(window.speedMult) {
		case .08:
			window.speedMult = .08;
			textOfSpeed = "very fast";
			break;
		case .3:
			window.speedMult = .08;
			textOfSpeed = "very fast";
			break;
		case .6:
			window.speedMult = .3;
			textOfSpeed = "fast";
			break;
		case 1.2:
			window.speedMult = .6;
			textOfSpeed = "normal";
			break;
		case 2:
			window.speedMult = 1.2;
			textOfSpeed = "slow";
			break;
	}
	showNotification("Speed up to " + textOfSpeed);
	console.info('%c REDDIT_STREAM Faster ' + window.speedMult, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
}
function controlPsPl() {
	if(!window.PauseChat) {
		showNotification("Chats Paused.");
		window.PauseChat = true;
		document.querySelector(".controlButtonPsPy").src = "./images/Play_icon_light.png";
		document.querySelector(".controlButtonPsPy").title = "Resume Chats"
	} else if(!!window.PauseChat) {
		showNotification("Resumed Playing Chats.");
		window.PauseChat = false;
		document.querySelector(".controlButtonPsPy").src = "./images/Pause_icon_light.png";
		document.querySelector(".controlButtonPsPy").title = "Pause Chats"
	}
}
function showCopySuccess() {
	showNotification("All chats copied to clipboard.");
	console.info('%c REDDIT_STREAM showCopySuccess. ', "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
}
function selectElementText(anElement){
	var aRange = document.createRange();
	aRange.selectNodeContents(anElement);
	//
	var selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(aRange);
}
function clearSelection()
{
	if (window.getSelection) {window.getSelection().removeAllRanges();}
	else if (document.selection) {document.selection.empty();}
}
function hookUpClipboardCopy(optionalCssClass, optionalCallBack) {
	var cssClass = optionalCssClass || ".boardBannerTmoSvg";
	//
	if(!!document.querySelector(cssClass)) {
		document.querySelector(cssClass).addEventListener('click', function(e) {
			var allText = document.getElementById('boardChatWindow');
			selectElementText(allText); 
			//var thetext = window.getSelection().toString();
			document.execCommand('copy');
			clearSelection();
			//
			if(!!optionalCallBack) {
				optionalCallBack();
			}
		});
	}
}
function HookUpControls() {
	document.querySelector(".boardInfoEdit").onclick = function(){swapEditMode();};
	document.querySelector(".baordInfoSaveEditButton").onclick = function(){saveEditMode();};
	document.querySelector(".baordInfoCancelEditButton").onclick = function(){leaveEditMode();};
	//
	document.querySelector(".controlButtonSlow").onclick = function(){controlSlow();};
	document.querySelector(".controlButtonFast").onclick = function(){controlFast();};
	document.querySelector(".controlButtonPsPy").onclick = function(){controlPsPl();};
	//
	hookUpClipboardCopy(".controlButtonCopy", showCopySuccess);
}
function enterEditMode() {
	window.PauseChat = true;
	document.querySelector(".boardInfoEdit").style = "visibility: hidden;";
	document.querySelector(".baordInfoDisplayMode").style = "display: none;";
	document.querySelector(".baordInfoEditMode").style = "display: block;";
	//
	document.getElementById("baordInfoEditName").value = window.displayCurrentTitle;
	document.getElementById("baordInfoEditBgCol").value = window.displayCurrentBgColor;
	//
	// Reddit Source
	if(window.displayCurrentRedditSourceVal == "www.reddit.com/r/tmobile/") {
		document.getElementsByClassName("baordInfoEditRadio")[0].checked = true;
	} else if(window.displayCurrentRedditSourceVal == "www.reddit.com/r/sprint/") {
		document.getElementsByClassName("baordInfoEditRadio")[1].checked = true;
	} else if(window.displayCurrentRedditSourceVal == "www.reddit.com/r/verizon/") {
		document.getElementsByClassName("baordInfoEditRadio")[2].checked = true;
	} else if(window.displayCurrentRedditSourceVal == "www.reddit.com/r/att/") {
		document.getElementsByClassName("baordInfoEditRadio")[3].checked = true;
	} 
}
function leaveEditMode() {
	window.PauseChat = false;
	window.editMode = false;
	document.querySelector(".boardInfoEdit").style = "visibility: visible;";
	document.querySelector(".baordInfoDisplayMode").style = "display: block;";
	document.querySelector(".baordInfoEditMode").style = "display: none;";
	document.querySelector(".controlButtonPsPy").src = "./images/Pause_icon_light.png";
	document.querySelector(".controlButtonPsPy").title = "Pause Chats"
}
function saveEditMode() {
	var whatWas = getAllDisplayCurrentVars();
	window.displayCurrentTitle = document.getElementById("baordInfoEditName").value;
	window.displayCurrentBgColor = document.getElementById("baordInfoEditBgCol").value;
	window.displayCurrentRedditSource = document.querySelector('input[name="baordInfoEditRedditSource"]:checked').alt;
	window.displayCurrentRedditSourceVal = document.querySelector('input[name="baordInfoEditRedditSource"]:checked').value;
	//
	if(window.displayCurrentBgColor !== undefined) {
		document.querySelectorAll(".boardBody")[0].style.background = window.displayCurrentBgColor;
		document.querySelectorAll(".boardSideInfo")[0].style.background = window.displayCurrentBgColor;
		document.querySelectorAll(".boardChatShell")[0].style.backgroundColor = window.displayCurrentBgColor;
	}
	//
	var whatIs = getAllDisplayCurrentVars();
	//
	if(whatWas == whatIs) {
		leaveEditMode();
	} else {
		// Construct NEW URL, reload the page. 
		var newUrlBase = location.origin + location.pathname + "";
		var newUrlQs = "?name=" + encodeURIComponent(window.displayCurrentTitle) + 
			"&bgcolor=" + encodeURIComponent(window.displayCurrentBgColor) + 
			"&redditSource=" + encodeURIComponent(window.displayCurrentRedditSource);
		var newUrl = newUrlBase + newUrlQs;
		location.href = newUrl;
	}
}
function swapEditMode() {
	window.editMode = !window.editMode;
	if(!!window.editMode) {
		enterEditMode();
	} else {
		leaveEditMode();
	}
}
function getAllDisplayCurrentVars() {
	return window.displayCurrentTitle  + window.displayCurrentBgColor + window.displayCurrentRedditSource;
}
function setUIwithDisplayCurrentFields() {
	document.querySelector(".boardInfoTitle").innerText = window.displayCurrentTitle;
	// 
	document.querySelector(".boardInfoDesc").innerText = window.displayCurrentRedditSourceVal;
	document.querySelectorAll(".boardBlockRow1 .boardSettingLabel")[0].innerHTML = "Top 100";
	document.querySelectorAll(".boardBlockRow1 .boardSettingLabel")[1].innerHTML = window.displayCurrentRedditNumberOf || "-";
	//
	if(window.displayCurrentBgColor !== undefined) {
		document.querySelectorAll(".boardBody")[0].style.background = window.displayCurrentBgColor;
		document.querySelectorAll(".boardSideInfo")[0].style.background = window.displayCurrentBgColor;
		document.querySelectorAll(".boardChatShell")[0].style.backgroundColor = window.displayCurrentBgColor;
	}
}
function loadDisplayCurrentVars() {
	var qsUrlParams = new URLSearchParams(location.search);
	var name = qsUrlParams.get('name') || "Reddit Stream";
	var bgcolor = qsUrlParams.get('bgcolor') || "#797a85";
	//
	window.displayCurrentTitle = name;
	window.displayCurrentData = "Top 100";
	window.displayCurrentBgColor = bgcolor;
	//
	window.displayCurrentRedditSource = qsUrlParams.get('redditSource') || "T-Mobile";
	//
	window.displayCurrentRedditSourceVal = "www.reddit.com/r/tmobile/";
	try {
		window.displayCurrentRedditSourceVal = document.querySelector('input[alt="' + window.displayCurrentRedditSource + '"]').value;
	} catch(e)
	{ }
	//
	setUIwithDisplayCurrentFields();
	//
	window.displayCurrentChatNumber = 0;
	window.displayCurrentStartTime = 0;
	window.displayCurrentMessages = 0;
	window.displayCurrentSentiment = 0;
	window.isFirstChat = true;
}
function calculateTimeStamp(theChatReading) {
	var timeStamp = theChatReading.time;
	if(!theChatReading.time) {
		timeStamp = "";
	} else {
		try {
			var localTimeOf = new Date(theChatReading.time);
			timeStamp = localTimeOf.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
		} catch(e) {}
	}
	if(window.isFirstChat == 1) {
		window.displayCurrentStartTime = timeStamp;
		if(window.displayCurrentStartTime == "0") {
			window.displayCurrentStartTime = "";
		}
	}
	if(theChatReading.source !== "newChatBreak") {
		window.sameChat = true;
	}
	return timeStamp;
}
function calculateTimeToNext(toDisplay) {
	// Time between chats based on character length
	window.timeToNext = 2500 + Math.floor(toDisplay.length / 50)*1000;
	if(window.timeToNext < 2000) {
		window.timeToNext = 2000;
	} else if(window.timeToNext > 10000) {
		window.timeToNext = 10000;
	}
	window.timeToNext = window.timeToNext * window.speedMult;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function readRedditComments() {
	if(window.chatReadIndex >= window.chatsToRead.length && !window.StopChat) {
		window.redditCommentIdIndex++;
		GetNewCommentGroupReddits();
	} 
	else if(!window.StopChat) {
		if(!!window.PauseChat) {
			window.timeToNext = 3000 * window.speedMult;
			setTimeout(function(){ readRedditComments();}, window.timeToNext);
		} else {
			var theChatReading = window.chatsToRead[window.chatReadIndex];
			var classToUse = "";
			var toDisplay = "";
			var agentNameStamp = "";
			var deepStyle = "";
			var maxDepthBase = 900;
			if (window.innerWidth > 2280) {
				maxDepthBase = 1020;
			}
			var deepMaxWidth = "";
			window.timeToNext = 1000;
			//
			if(theChatReading.depth === 0) {
				classToUse = "User"; // was chatSubUser chatSubDeepZero
				agentNameStamp = '<span class="agentNameStamp">' + theChatReading.author + ', </span>';
				toDisplay = theChatReading.text.replace(/<(?:.|\n)*?>/gm, '').trim();
			} 
			else {
				classToUse = "Agent"; // was chatSubAgent chatSubDeepOnePlus
				agentNameStamp = '<span class="agentNameStamp">' + theChatReading.author + ', </span>';
				toDisplay = theChatReading.text.replace(/<(?:.|\n)*?>/gm, '').trim();
				try {
					deepStyle = "box-shadow: -" + (theChatReading.depth * 2) + "px -" + (theChatReading.depth * 1.5) + "px 0px 0px hsl(0, 0%, 70%);";
					if(window.innerWidth > 1781) {
						deepMaxWidth = "max-width: " + (maxDepthBase - (theChatReading.depth * 3)) + "px;";
					}
				} catch(e) 
				{ }
			}
			//
			calculateTimeToNext(toDisplay);
			//
			var timeStamp = theChatReading.time || "";
			try {
				timeStamp = theChatReading.time.split(':')[0] + ":" + theChatReading.time.split(':')[1] + " UTC";
			} catch(e) 
			{ }
			//
			var aDiv1 = document.createElement('div');
			aDiv1.classList.add('chatHiddenBlank'); 
			aDiv1.innerHTML = ".";
			//
			var aDiv2 = document.createElement('div');
			aDiv2.innerHTML = '<div class="chatBox chat' + classToUse + '">'+
				'<span class="chatText chatSub' + classToUse + '" style="' + deepStyle + deepMaxWidth + '">' + toDisplay + '</span>'+
				'<span class="chatTimeStamp">' + agentNameStamp + timeStamp + '</span>'+
			'</div>';
			//
			document.querySelector(".boardChatInnerShell").appendChild(aDiv1);
			document.querySelector(".boardChatInnerShell").appendChild(aDiv2);
			//
			setUIwithDisplayCurrentFields();
			//
			if(document.querySelectorAll(".boardChatInnerShell")[0].scrollHeight - document.querySelectorAll(".boardChatInnerShell")[0].scrollTop > (document.querySelectorAll(".boardChatInnerShell")[0].clientHeight*1.5)) {
				document.querySelectorAll(".boardChatInnerShell")[0].scrollTop = document.querySelectorAll(".boardChatInnerShell")[0].scrollHeight;
				//console.info('%c REDDIT_STREAM Scroll with no Animation', "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
			} else {
				setTimeout(function(){ document.querySelectorAll(".boardChatInnerShell")[0].scrollBy({top: 20000, left: 0, behavior: 'smooth'})}, 100);
			}
			window.chatReadIndex++;
			window.isFirstChat--;
			setTimeout(function(){ readRedditComments();}, window.timeToNext);
		}
	}
}
function chopText(aComment, toChop) {
	try {
		for(var i=0; i < 10; i++) {
			if(aComment.length > toChop) {
				aComment = aComment.split('.').slice(0, -1).join('.');
			} else {
				if(i > 0) {
					aComment = aComment + ".";
				}
				i = 10;
			}
		}
	}
	catch(e) {
		console.info('%c REDDIT_STREAM Fail chopText ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
	}
	return aComment;
}
function assembleRedditCommentsArray(commentsArrayOfJson, depth) {
	for(var i=0; i < commentsArrayOfJson.length; i++) {
		var aComment = commentsArrayOfJson[i].data.body;
		var created = commentsArrayOfJson[i].data.created;
		var author = commentsArrayOfJson[i].data.author;
		if(!!aComment && !!author) {
			aComment = chopText(aComment, 440);
			window.chatsToRead.push({"text": aComment, "depth":depth, "author":author, "time":timeConverter(created * 1000)});
			if(!!commentsArrayOfJson[i].data.replies && !!commentsArrayOfJson[i].data.replies.data && !!commentsArrayOfJson[i].data.replies.data.children) {
				depth++;
				assembleRedditCommentsArray(commentsArrayOfJson[i].data.replies.data.children, depth);
				depth--;
			}
		}
	}
}
function handleRedditCommentsResponse(redditCommentsData) {
	try {
		window.chatReadIndex = 0;
		window.chatBreakIndex = 0;
		//window.chatJson = chatJson;
		window.chatsToRead = new Array();
		window.redditCommentsData = redditCommentsData;
		//
		assembleRedditCommentsArray(window.redditCommentsData.children, 0);
		//
		try {
			document.querySelector(".boardChatShellLoading").remove();
		}
		catch(e) {}
		readRedditComments();
		console.info('%c REDDIT_STREAM readRedditComments ', "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
	}
	catch(e) {
		console.info('%c REDDIT_STREAM Fail handleRedditCommentsResponse ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
	}
}
function DisplayHotReddit() {
	try {
		var hotReddit = window.redditHotData.children[window.redditCommentIdIndex].data;
		var title = hotReddit.title;
		var selftext = hotReddit.selftext;
		var selftexthtml = hotReddit.selftext_html || "";
		selftexthtml = selftexthtml.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
		selftexthtml = chopText(selftexthtml, 640);
		var thumbnail = hotReddit.thumbnail || "";
		var url = hotReddit.url;
		var permalink = hotReddit.permalink;
		var num_comments = hotReddit.num_comments;
		var createdTs = (new Date(hotReddit.created *1000)).getTime();
		var nowTs = Date.now();
		var daysAgo = daysBetween(createdTs, nowTs);
		var daysText = daysAgo + ' days ago ';
		if(daysAgo === 1) {
			daysText = daysAgo + ' day ago ';
		}
		if(daysAgo === 0) {
			daysText = 'Today ';
		}
		//
		var toAppend = selftexthtml || '<a href="' + url + '" target="_blank" class="boardRedditThumbUrl">'+url+'</a>';
		//
		document.querySelector(".boardRedditTitle").innerHTML = "";
		var aDiv1 = document.createElement('div');
		aDiv1.innerHTML = '<a href="https://www.reddit.com' + permalink + '" target="_blank" class="boardRedditLink">' + title + '</a>';
		if(!!thumbnail && thumbnail.length > 5) {
			aDiv1.innerHTML += '<div class="contRedditThumbnail"><img src="' + thumbnail + '" class="boardRedditThumbnail"><div>';
		}
		document.querySelector(".boardRedditTitle").appendChild(aDiv1); 
		//
		window.displayCurrentRedditNumberOf = num_comments;
		//
		var aDiv3 = document.createElement('div');
		aDiv3.innerHTML = '<div class="chatBox chatUser">'+
			'<span class="chatText chatSubUser">' + toAppend + '</span>'+
			'<span class="chatTimeStamp"></span>'+
		'</div>';
		document.querySelector(".boardChatInnerShell").appendChild(aDiv3);
		//
	}
	catch(e) {
		console.info('%c REDDIT_STREAM Fail DisplayHotReddit ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
	}
}
function GetNewCommentGroupReddits() {
	if(window.redditCommentIdIndex >= window.redditCommentIdArray.length) {
		GetAllHotReddits();
	} else {
		document.querySelector(".boardChatInnerShell").innerHTML = "";
		//
		var id = window.redditCommentIdArray[window.redditCommentIdIndex];
		var url = "https://" + window.displayCurrentRedditSourceVal + "comments/" + id + ".json";
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				try {
					window.redditCommentsData = JSON.parse(request.responseText)[1].data;
					if(window.redditCommentsData.children.length > 3) {
						DisplayHotReddit();
						handleRedditCommentsResponse(JSON.parse(request.responseText)[1].data);
						console.info('%c REDDIT_STREAM Reddit Comments Success, see window.redditCommentsData', "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
					} else {
						window.redditCommentIdIndex++;
						GetNewCommentGroupReddits();
					}
				} catch(e) {
					window.lastError = e;
					console.info('%c REDDIT_STREAM Fail ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
					setTimeout(function(){ GetNewCommentGroupReddits();}, 20000); // Try again in 20 seconds
				}
			}
		};
		request.send();
	}
}
function handleRedditHotResponse(redditHotData) {
	try {
		window.redditHotData = redditHotData;
		//
		window.redditCommentIdArray = new Array();
		window.redditCommentIdIndex = 1;
		//
		for(var i=0; i < redditHotData.children.length; i++) {
			var anId = window.redditHotData.children[i].data.id;
			redditCommentIdArray.push(anId);
		}
		GetNewCommentGroupReddits();
	}
	catch(e) {
		console.info('%c REDDIT_STREAM Fail handleRedditHotResponse ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
	}
}
function GetAllHotReddits() {
	loadDisplayCurrentVars();
	document.querySelector(".boardChatInnerShell").innerHTML = "";
	// 
	var url = "https://" + window.displayCurrentRedditSourceVal + "hot.json?limit=50"; // https://www.reddit.com/r/tmobile/comments/adqw75.json
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			try {
				handleRedditHotResponse(JSON.parse(request.responseText).data);
				console.info('%c REDDIT_STREAM Reddit Hot Success, see window.redditHotData', "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid black;");
			} catch(e) {
				window.lastError = e;
				console.info('%c REDDIT_STREAM Fail ' + e, "font-weight:600;color:#000000;background-color:#55FF55;padding:2px;border-left:5px solid orange;");
				setTimeout(function(){ GetAllReddits();}, 20000); // Try again in 20 seconds
			}
		}
	};
	request.send();
}