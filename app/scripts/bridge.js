(function($){
	var hash = location.hash.substring(1);
	var accessToken = hash.split("=")[1];
	chrome.runtime.sendMessage({"accessToken": accessToken}, function(response) {
});
})(jQuery);
