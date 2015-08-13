var AppDispatcher = require('AppDispatcher');
var $ = require('jquery');

var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var make_base_auth = function(user, pass) {
	  var tok = user + ':' + pass;
	  var hash = Base64.encode(tok);
	  return "Basic " + hash;
	};

var OauthAction = {
    getToken: function(obj, data) {
		var clientId = data.clientId;
		var secret = data.secret;
		
		var userObj = {};
		userObj.grant_type = 'password';
//		userObj.grant_type = 'client_credentials';
		userObj.username = obj.userName;
		userObj.password = obj.password;
		
		$.ajax({
		       type: "POST",
		       url: "/oauth/token",
		       data: userObj,
		       contentType: "application/x-www-form-urlencoded",
		       beforeSend: function (xhr){ 
		           xhr.setRequestHeader('Authorization', make_base_auth(clientId, secret)); 
		       },
		       success: function (data, status, jqXHR) {
		    	   var param = {};
		    	   param.clientId = clientId;
		    	   param.secret = secret;
		    	   param.tokenInfo = data;
		    	   param.user = {username:obj.userName, password:obj.password};
		    	   AppDispatcher.login(param);
		       }
		    })
		    .fail((err) => {
				if (err.status == 401) {
					window.location = '/index.html';
				} else {
					alert('oooops something wrong, see console.log.'); 
					console.log(err);
				}
			});
	},
	// just for no Oauth 
	getTokenWithOauth: function(obj, data) {
		var clientId = data.clientId;
		var secret = data.secret;
		
		AppDispatcher.login(clientId, secret, {});
	}
};

 module.exports = OauthAction;