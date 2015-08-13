var $ = require('jquery');

var OauthStore = require('stores/OauthStore');
var AppDispatcher = require('AppDispatcher');

var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

module.exports = {
	ajax: function(command, callback) {
		$.ajax(command)
		.then(callback)
		.fail((err) => {
			if (err.status == 401) {
				this.refreshToken(command, callback);
			} else {
				alert('oooops something wrong, see console.log.'); 
				console.log(err);
			}
		});
	},
	get: function(url, callback) {
		var command = {
			type: 'GET',
			url: url,
			beforeSend: function (xhr){ 
	           xhr.setRequestHeader('Authorization', OauthStore.getAuth()); 
	        }		
		};
		this.ajax(command, callback);
	},
	post: function(url, payload, callback) {
		var command = {
				type: 'POST',
				url: url,
				data: JSON.stringify(payload),
				contentType: 'application/json',
				beforeSend: function (xhr){ 
					xhr.setRequestHeader('Authorization', OauthStore.getAuth()); 
				}		
		};
		this.ajax(command, callback);
	},
	refreshToken: function(command, callback) {
		if (OauthStore.getRefreshToken() == null || OauthStore.getRefreshToken() == '') { 
			window.location = '/index.html'; 
		}
		
		var clientId = OauthStore.getClientId();
		var secret = OauthStore.getSecret();
		
		var payload = {};
		payload.grant_type = 'refresh_token';
		payload.refresh_token = OauthStore.getRefreshToken() ;
		payload.scope = 'all';
		
		var baseAuth = this.make_base_auth;
		$.ajax({
	       type: "POST",
	       url: "/oauth/token",
	       data: payload,
	       contentType: "application/x-www-form-urlencoded",
	       beforeSend: function (xhr){ 
	           xhr.setRequestHeader('Authorization', baseAuth(clientId, secret)); 
	       },
	       success: function (data, status, jqXHR) {
	    	   var param = {};
	    	   param.access_token = data.access_token;
	    	   param.token_type = data.token_type;
	    	   param.refresh_token = data.refresh_token;
	    	   param.expires_in = data.expires_in;
	    	   param.scope = data.scope;
	    	   
	    	   AppDispatcher.refreshToken(param);
	    	   
		    	// retry
		   		$.ajax(command).then(callback);
	       }
	    })
	    .fail((err) => {
			if (err.status == 401) {
				console.log("Should not happend!!");
			} else if (err.status == 400) {
				OauthStore.clearToken();
				window.location = '/index.html';
			} else {
				alert('oooops something wrong, see console.log.'); 
				console.log(err);
			}
		});
	},
	make_base_auth: function(user, pass) {
	  var tok = user + ':' + pass;
	  var hash = Base64.encode(tok);
	  return "Basic " + hash;
	}
};