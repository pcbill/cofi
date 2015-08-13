var AppDispatcher = require('AppDispatcher');
var $ = require('jquery');

var OauthStore = require('stores/OauthStore');

var Net = require('net/Net');

var OauthAction = {
    getToken: function(obj, data) {
		var clientId = data.clientId;
		var secret = data.secret;
		
		var userObj = {};
		userObj.grant_type = 'password';
//		userObj.grant_type = 'client_credentials';
		userObj.username = obj.userName;
		userObj.password = obj.password;
		
		Net.ajax({
	       type: "POST",
	       url: "/oauth/token",
	       data: userObj,
	       contentType: "application/x-www-form-urlencoded",
	       beforeSend: function (xhr){ 
	           xhr.setRequestHeader('Authorization', Net.make_base_auth(clientId, secret)); 
	       },
	    },
	    (data, status, jqXHR) => {
	    	   var param = {};
	    	   param.clientId = clientId;
	    	   param.secret = secret;
	    	   param.tokenInfo = data;
	    	   param.user = {username:obj.userName, password:obj.password};
	    	   AppDispatcher.login(param);
	       }
		);
	},
	
	
	// just for no Oauth 
	getTokenWithOauth: function(obj, data) {
		var clientId = data.clientId;
		var secret = data.secret;
		
		AppDispatcher.login(clientId, secret, {});
	}
};

 module.exports = OauthAction;