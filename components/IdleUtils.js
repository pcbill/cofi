import WebStorage from 'react-webstorage';

class IdleUtils {

    constructor() {
        this.limit = 5 * 60000; //mins
        this.checkDuration = 2000; //mini-secs
        this.webStorage = new WebStorage(window.localStorage ||
           window.sessionStorage /* or poly-fill thereof */
        );
    }

    afterExpired(callback) {
        let timerId = window.setInterval(() => {
                if (this.isExpired()) {
                    callback();
                }
            },
            this.checkDuration
        );
        this.webStorage.setItem("timerId", timerId);
    }

    isExpired() {
        let idleTime = new Date().getTime() - this.webStorage.getItem("idleTime");
        return idleTime > this.limit;
    }

    refreshIdleTime(handleExpired) {
        console.log("refreshIdleTime");
        if (this.isExpired()) {
            handleExpired();
        }
        this.webStorage.setItem("idleTime", new Date().getTime());
    }

}

export default IdleUtils;