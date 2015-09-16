import $ from 'jquery';
import OauthStore from 'stores/OauthStore';
import AppDispatcher from 'AppDispatcher';
import base64 from 'base-64';
import SimpleNet from 'net/SimpleNet';

import WebStorage from 'react-webstorage';
var webStorage = new WebStorage(window.localStorage ||
    window.sessionStorage /* or poly-fill thereof */
);

import IdleUtils from 'utils/IdleUtils';
var idleUtils = new IdleUtils();

export default class Net extends SimpleNet {

    ajax(command, success) {
        idleUtils.refreshIdleTime(() =>
            OauthStore.clearToken()
        );

        $.ajax(command)
        .then(success)
        .fail(err => {
			if (err.status == 401) {
				this.refreshToken(command, success);
			} else {
				alert('oooops something wrong, see console.log.');
				console.log(err);
			}
        });
    }

    get(url, success) {
        let command = super.newGetCommand(url);
        command.beforeSend = xhr => xhr.setRequestHeader('Authorization', OauthStore.getAuth());
        this.ajax(command, success);
    }

    post(url, payload, success) {
        let command = super.newPostJsonCommand(url,payload);
        command.beforeSend = xhr => xhr.setRequestHeader('Authorization', OauthStore.getAuth());
        this.ajax(command, success);
    }

    post(url, payload, contentType, success) {
        let command = super.newPostCommand(
            url,
            payload,
            contentType);

		let clientId = OauthStore.getClientId();
		let secret = OauthStore.getSecret();
        command.beforeSend = xhr => xhr.setRequestHeader('Authorization', this.makeBaseAuth(clientId, secret));
        this.ajax(command, success);
    }

    refreshToken(command, success) {
		if (OauthStore.getRefreshToken() == null || OauthStore.getRefreshToken() == '') {
			window.location = '/index.html';
		}

        let payload = {
            grant_type: 'refresh_token',
            refresh_token: OauthStore.getRefreshToken(),
            scope: 'all'
        };

		let clientId = OauthStore.getClientId();
		let secret = OauthStore.getSecret();

        let refreshCommand = super.newPostCommand(
            "/oauth/token",
            payload,
            "application/x-www-form-urlencoded");
        refreshCommand.beforeSend = xhr => xhr.setRequestHeader('Authorization', this.makeBaseAuth(clientId, secret));

        $.ajax(refreshCommand)
        .then((data, status, jqXHR) => {
            let param = {
                access_token : data.access_token,
	    	    token_type : data.token_type,
	    	    refresh_token : data.refresh_token,
	    	    expires_in : data.expires_in,
	    	    scope : data.scope
            };

            AppDispatcher.refreshToken(param);

		    // retry
		   	$.ajax(command).then(success);
        })
        .fail(err => {
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
    }

    makeBaseAuth(user, pass) {
	  let tok = user + ':' + pass;
	  let hash = base64.encode(tok);
	  return "Basic " + hash;
    }
}
