
chrome.browserAction.setBadgeBackgroundColor({
	color: [80, 80, 80, 255]
});



setInterval(function(){
	Ajax()
	.get('https://api.lsong.org/beijingair')
	.end(function(err, res){
		chrome.browserAction.setBadgeText({
			text: res[0].AQI
		});
	});
}, 36e5);

var menu = chrome.contextMenus.create({
  title    : 'My extension',
  contexts : [ 'all' ],
  onclick  : function(){
    alert('1');
  }
});

var submenu = chrome.contextMenus.create({
  type     : 'normal',
  title    : 'Test',
  parentId : menu,
  contexts : [ 'selection' ],
  onclick  : function(){
    alert('2');
  }
});


chrome.runtime.onConnect.addListener(function(port) {
	console.log('connect: ', port.name);

  port.onMessage.addListener(function onMessage(msg){
	  console.log('message: ', msg, port.name);
	});
	
  port.onDisconnect.addListener(function(port){
    console.log('Port %s has disconnected', port.name);
    port.onMessage.removeListener(onMessage);
  });

});

function getCookies(tabId, callback){
	chrome.tabs.get(tabId, function(tab){
		chrome.cookies.getAll({ url: tab.url }, callback);
	});
};


chrome.notifications.create(null, {
  type: 'basic',
  iconUrl: 'https://api.lsong.org/qr?text=icon',
  title: document.title,
  message: 'hello world'
}, function(){

});


/**
 * webRequest
 */
var filter = { urls: [ "<all_urls>" ] };

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  return { cancel: false };
}, filter, [ 'blocking' ]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var headers = details.requestHeaders;
  headers.push({ name: 'Date', value: '' + new Date });
  return {requestHeaders: headers };
}, filter, [ 'blocking', 'requestHeaders' ]);

chrome.webRequest.onSendHeaders.addListener(function(details) {
}, filter, [ 'requestHeaders' ]);

// chrome.tabs.create({url:'https://lsong.org'});
