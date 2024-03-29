var Dropdown = ( function($) {

    Dropdown = function(options) {
        var that = this;

        that.$wrapper = options["$wrapper"];
        that.$button = that.$wrapper.find("> .wa-dropdown-toggle");
        that.$menu = that.$wrapper.find("> .wa-dropdown-area");

        that.on = {
            ready: (typeof options["ready"] === "function" ? options["ready"] : function() {}),
            open: (typeof options["open"] === "function" ? options["open"] : function() {}),
            change: (typeof options["change"] === "function" ? options["change"] : function() {})
        };
        that.data = getData(that.$wrapper, options);

        that.is_locked = false;
        that.is_opened = false;
        that.$before = null;
        that.$active = null;

        that.initClass();
    };

    Dropdown.prototype.initClass = function() {
        var that = this;

        if (that.data.hover) {
            that.$button.on("mouseenter", function() {
                that.toggleMenu(true);
            });

            that.$wrapper.on("mouseleave", function() {
                that.toggleMenu(false);
            });
        }

        that.$button.on("click", function(event) {
            event.preventDefault();
            that.toggleMenu(!that.is_opened);
        });

        if (that.data.change_selector) {
            that.initChange(that.data.change_selector);
        }

        $(document).on("click", clickWatcher);

        $(document).on("keyup", keyWatcher);

        that.on.ready(that);

        function keyWatcher(event) {
            var is_exist = $.contains(document, that.$wrapper[0]);
            if (is_exist) {
                var is_escape = (event.keyCode === 27);
                if (that.is_opened && is_escape) {
                    that.hide();
                }
            } else {
                $(document).off("click", keyWatcher);
            }
        }

        function clickWatcher(event) {
            var wrapper = that.$wrapper[0],
                is_exist = $.contains(document, wrapper);

            if (is_exist) {
                var is_target = (event.target === wrapper || $.contains(wrapper, event.target));
                if (that.is_opened && !is_target) {
                    that.hide();
                }
            } else {
                $(document).off("click", clickWatcher);
            }
        }
    };

    Dropdown.prototype.toggleMenu = function(open) {
        var that = this,
            active_class = "is-opened";

        if (open) {
            if (that.is_locked) { return false; }

            var open_result = that.on.open(that);
            if (open_result !== false) {
                that.$wrapper
                    .addClass(active_class)
                    .trigger("open", that);
            }

        } else {
            that.$wrapper
                .removeClass(active_class)
                .trigger("close", that);

        }

        that.is_opened = open;
    };

    Dropdown.prototype.initChange = function(selector) {
        var that = this,
            change_class = that.data.change_class;

        that.$active = that.$menu.find(selector + "." + change_class);

        that.$wrapper.on("click", selector, onChange);

        function onChange(event) {
            event.preventDefault();
            
            var $target = $(this);
            console.log($target.data('variantId'));
            if (that.$active.length) {
                that.$before = that.$active.removeClass(change_class);
            }

            that.$active = $target.addClass(change_class);

            if (that.data.change_title) {
                that.setTitle($target.html());
            }

            if (that.data.change_hide) {
                that.hide();
            }

            that.$wrapper.trigger("change", [$target[0], that]);
            that.on.change(event, this, that);
        }
    };

    Dropdown.prototype.hide = function() {
        var that = this;

        that.toggleMenu(false);
    };

    Dropdown.prototype.setTitle = function(html) {
        var that = this;

        that.$button.html( html );
    };

    Dropdown.prototype.lock = function(lock) {
        var that = this;

        var locked_class = "is-locked";

        if (lock) {
            that.$wrapper.addClass(locked_class);
            that.is_locked = true;
        } else {
            that.$wrapper.removeClass(locked_class);
            that.is_locked = false;
        }
    };

    return Dropdown;

    function getData($wrapper, options) {
        var result = {
            hover: true,
            change_selector: "",
            change_class: "selected",
            change_title: true,
            change_hide: true
        };

        var hover = ( typeof options["hover"] !== "undefined" ? options["hover"] : $wrapper.data("hover") );
        if (hover === false) { result.hover = false; }

        result.change_selector = (options["change_selector"] || $wrapper.data("change-selector") || "");
        result.change_class = (options["change_class"] || $wrapper.data("change-class") || "selected");

        var change_title = ( typeof options["change_title"] !== "undefined" ? options["change_title"] : $wrapper.data("change-title") );
        if (change_title === false) { result.change_title = false; }

        var hide = ( typeof options["change_hide"] !== "undefined" ? options["change_hide"] : $wrapper.data("change-hide") );
        if (hide === false) { result.change_hide = false; }

        return result;
    }

})($);