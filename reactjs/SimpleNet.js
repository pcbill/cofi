
import $ from 'jquery';

export default class SimpleNet {

    newGetCommand(url) {
        return {
			type: 'GET',
			url: url
        };
    }

    newPostCommand(url, data, contentType) {
        return {
			type: 'POST',
			url: url,
			data: data,
			contentType: contentType
        }
    }

    newPostJsonCommand(url, data) {
        return this.newPostCommand(
            url, JSON.stringify(data), 'application/json');
    }

    ajax(command, success) {
        $.ajax(command)
        .then(success)
        .fail(err => {
			console.log(err);
        });
    }

    get(url, success) {
        this.ajax(this.newGetCommand(url), success);
    }

    post(url, payload, contentType, success) {
        let command = this.newPostCommand(url, payload, contentType);
        this.ajax(command, success);
    }

    postJson(url, payload, success) {
        let command = this.newPostJsonCommand(url, payload);
        this.ajax(command, success);
    }
}