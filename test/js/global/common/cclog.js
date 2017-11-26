import util from 'util'
var uuid = 1;
var levelStyle = {
    "debug": "console_debug",
    "info": "console_info",
    "warn": "console_warn",
    "error": "console_error"
};

function CClog(options) {
    this.cfg = {
        title: '控制台',
        content: '',
        width: 500,
        height: 300,
        hasMask: true
    };
    this.consoleWrap = null;
    this.closeElement = null;
    this.contentElement = null;
    this.overflowElement = null;
    this.cfg = util.extend(this.cfg, options);

    this.init = function() {
        if (!this.consoleWrap) {
            this.consoleWrap = document.createElement("div");
            this.consoleWrap.className = "console hidden";

            var headerElement = document.createElement("div");
            headerElement.className = "console_header";

            var titleElement = document.createElement("p");
            titleElement.className = "console_title";
            titleElement.innerHTML = this.cfg.title;

            this.closeElement = document.createElement('span');
            this.closeElement.className = "console_close";
            this.closeElement.innerHTML = "X";

            headerElement.appendChild(titleElement);
            headerElement.appendChild(this.closeElement);

            this.consoleWrap.appendChild(headerElement);

            if (!this.contentElement) {
                this.contentElement = document.createElement("ul");
                this.contentElement.className = "console_content";
            }

            this.consoleWrap.appendChild(this.contentElement);
        }

        document.body.appendChild(this.consoleWrap);

        this.overflowElement = document.createElement("div");
        this.overflowElement.className = "console_overflow hidden";
        document.body.appendChild(this.overflowElement);

        this.bindEvent();
    };

    this.bindEvent = function() {
        var self = this;
        self.closeElement.addEventListener("click", function() {
            self.close();
        }, false);
        self.overflowElement.addEventListener("click", function() {
            self.close();
        }, false);
    };

    this.init();

}

CClog.prototype.show = function() {
    var height = document.body.clientHeight;
    this.consoleWrap.classList.remove("hidden");
    this.overflowElement.style.height = height + 'px';
    this.overflowElement.classList.remove("hidden");
};

CClog.prototype.close = function() {
    this.consoleWrap.classList.add("hidden");
    this.overflowElement.classList.add("hidden");
};

CClog.prototype.log = function(level, data) {
    var li = document.createElement("li");
    li.classList.add("console_log");
    li.classList.add(levelStyle[level]);
    li.innerHTML = (uuid++) + '. [' + level + ']: ' + JSON.stringify(data ? data : '');

    if (this.contentElement.children.length) {
        this.contentElement.insertBefore(li, this.contentElement.children[0]);
    } else {
        this.contentElement.appendChild(li);
    }
};

CClog.prototype.debug = function(data) {
    this.log("debug", data);
};

CClog.prototype.info = function(data) {
    this.log("info", data);
};

CClog.prototype.warn = function(data) {
    this.log("warn", data);
};

CClog.prototype.error = function(data) {
    this.log("error", data);
};

// 暴露
export default CClog;