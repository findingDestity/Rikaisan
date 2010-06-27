
/**
 * MessageReceiever
 * 
 * Acts as the global end of the inject <-> global communication channel. All methods that
 * are to be used in the inject context will need to be registered with the global msgReceiver
 * instance.
 */
function MessageReceiver() {
	var methods = {};
	this.receieveMessage = function(msgEvent) {
		if(methods[msgEvent.message.methodName]) {
			var resp = methods[msgEvent.message.methodName](msgEvent.message.arg);
			msgEvent.target.page.dispatchMessage(msgEvent.name, resp);
		} else {
			msgEvent.target.page.dispatchMessage(msgEvent.name, "Method: " + msgEvent.message.methodName + " not found.");
		}
	};
	this.registerMethod = function(methodName, method) {
		methods[methodName] = method;
	};
};
msgReceiever = new MessageReceiver();
safari.application.addEventListener("message", 
						function(msgEvent) { msgReceiever.receieveMessage(msgEvent); },
						false);

/**
 * @param text
 * @param point
 * @returns String
 */
function lookup(data) {
	var startOffset = data.point;
	var endOffset = data.point;
	while(startOffset > 0 && data.text.charAt(startOffset) != ' ') {
		startOffset--;
	}
	while(endOffset < data.text.length && data.text.charAt(endOffset) != ' ') {
		endOffset++;
	}
	return { definition : data.text.subString(startOffset, endOffset),
		     startOffset : startOffset,
		     endOffset : endOffset };
};
msgReceiever.registerMethod("lookup", lookup);


