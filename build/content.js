document.addEventListener("mousedown", function (event) {
	if (isExternalEvent(event) && event.button === 2)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'contextmenu',
			info: {id: event.target.id, name: event.target.name, className: event.target.className}
		});
	}
	else if (isExternalEvent(event) && event.button == 0)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'click',
			info: {id: event.target.id, class:event.target.className}
		});
	}
}, true);
document.addEventListener('DOMSubtreeModified', function(event) {
	if (document.getElementsByTagName('iframe').length !== 0)
	{
		var previousId = undefined;
		var dLocal = document;

		var monitor = setInterval(function(){
			var elem = dLocal.activeElement;
			if(elem && elem.tagName == 'IFRAME')
			{
				// Context is changed.
				if (!previousId || previousId != elem.id)
				{
					previousId = elem.id;
					console.log('iframe2 clicked with id: '+elem.id+ ' and url:' +document.URL);
					
					//clearInterval(monitor);
				}
			}
		}, 100);
	}
});

document.addEventListener('DOMContentLoaded', function (event) {

	console.log('document loaded with url: '+document.URL);
	console.log(document.getElementsByTagName('iframe'));
	if (document.getElementsByTagName('iframe').length !== 0)
	{
		var previousId = undefined;
		var dLocal = document;

		var monitor = setInterval(function(){
			var elem = dLocal.activeElement;
			if(elem && elem.tagName == 'IFRAME')
			{
				// Context is changed.
				if (!previousId || previousId != elem.id)
				{
					previousId = elem.id;
					//console.log('iframe clicked with id: '+elem.id+ ' and url:' +document.URL);
					if (isExternalEvent(event))
					{
						chrome.runtime.sendMessage({
							from: 'content',
							subject: 'iframeload',
							info: {type: 'iframeload', url: event.target.URL, id: elem.id}
						});
					}
					//clearInterval(monitor);
				}
			}
		}, 100);
	}
	else if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'load',
			info: {type: 'load', url: event.target.URL}
		});
	}
}, true);
document.addEventListener('focus', function (event) {
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'focus',
			info: {id: event.target.id, class:event.target.className}
		})
	}
}, true);
document.addEventListener('keyup', function(event) {
	if (isExternalEvent(event))
	{
		if (event.key === 'Enter')
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'enter',
				info: {id: event.target.id}
			});
		}
		else if (event.target.value)
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'text',
				info: {id: event.target.id, text: event.target.value}
			});
		}
	}
}, true);

function isExternalEvent(event)
{
	return event.target.baseURI.indexOf('chrome-extension') < 0;
}
