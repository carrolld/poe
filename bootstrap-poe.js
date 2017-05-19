define(['jquery', 'bootstrap/tooltip', 'jquery-hotkeys', 'htmlminifier'], function (jQuery) {

!function ($) { "use strict";

// POE PUBLIC CLASS DEFINITION
// ===============================

var Poe = function (element, options) {
    this.init('poe', element, options);


    // ================================

    var self = this;
    self.tip();
    var clicked;

    $(document).mousedown(function(event) {
        clicked = $(event.target);
    });

    // Element events
    // ================================
    self.$element.on('focus', function(event) {
        var top = self.$element.offset().top;
        var bottom = self.$element.offset().top + self.$element.height();

        // Pin Poe to top when off screen
        $(window).scroll(function() {
            self.$tip.toggleClass('poe-fixed-top', $(window).scrollTop() > top && $(window).scrollTop() < bottom - 32);
        });

        if (self.tip().is(':hidden')) {
            self.show();

            // Hide all toolbar elements
            $('[data-editor]', self.$tip).hide();
            $('.btn-group', self.$tip).hide();

            for (var element in self.options.elements) {
                // Show selected elements
                $('[data-editor="' + self.options.elements[element] + '"]').show().parents('.btn-group').show();
            }

            // if (self.options.elements.indexOf('table')) {
            //     document.execCommand('enableInlineTableEditing', null, true);
            // } else {
            //     document.execCommand('enableInlineTableEditing', null, false);
            // }

            // Correct positioning
            var pos = self.getPosition();
            var actualWidth =  self.$tip[0].offsetWidth;
            var actualHeight = self.$tip[0].offsetHeight;
            var tp = {top: pos.top - actualHeight - 16, left: pos.left + pos.width / 2 - actualWidth / 2}
            self.applyPlacement(tp, 'top');

            self.$element.find('em,strong').each(function() {
                var tag = this.nodeName.toLowerCase() == 'em' ? 'i' : 'b';
                $(this).replaceWith('<' + tag + '>'  + this.innerHTML + '</' + tag + '>');
            });
        }
    });

    self.$element.on('blur', function(event) {
        if (! clicked.hasClass('poe') && ! clicked.parents('.poe').length) {
            self.$tip.hide();

            self.$element.find('i,b').each(function() {
                var tag = this.nodeName.toLowerCase() == 'i' ? 'em' : 'strong';
                $(this).replaceWith('<' + tag + '>'  + this.innerHTML + '</' + tag + '>');
            });

            // Cleanup whitespace
            self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\n/g, '');
            self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\t/g, '');
            self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\s+/g, ' ');
        }
    });

    self.$element.on('click', function(event) {
        self.updateButtonState();
    });

    // Paste
    self.$element.on('paste', function(event) {
        setTimeout(function() {
            // var text = self.$element[0].innerHTML;

            // if ((/<font face="Times New Roman"|class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i).test(text)) { // From TinyMCE
                self.$element[0].innerHTML = self.cleanWordHtml(self.$element[0].innerHTML);
            // }

            // Cleanup whitespace
            // self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\n/g, '');
            // self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\t/g, '');
            // self.$element[0].innerHTML = self.$element[0].innerHTML.replace(/\s+/g, ' ');

            self.$element[0].innerHTML = minify(
                self.$element[0].innerHTML,
                {
                    collapseWhitespace: true,
                    removeEmptyAttributes: true,
                    removeEmptyElements: true
                }
            );
        }, 4);
    });

    if (jQuery.hotkeys) {
        if (typeof navigator.platform != 'undefined' && navigator.platform.indexOf('Mac') != -1) {
            // Mac Keybindings

            self.$element.bind('keydown.meta_b', function(event) {
                self.strong();
                return false;
            });

            self.$element.bind('keydown.meta_i', function(event) {
                self.emphasis();
                return false;
            });

            self.$element.bind('keydown.meta_l', function(event) {
                self.linkEditor();
                return false;
            });

            self.$element.bind('keydown.meta_s', function(event) {
                self.strikethrough();
                return false;
            });

            self.$element.bind('keydown.meta_u', function(event) {
                self.underline();
                return false;
            });

            self.$element.bind('keydown.tab', function(event) {
                self.indent();
                return false;
            });

            self.$element.bind('keydown.shift_tab', function(event) {
                self.outdent();
                return false;
            });

            self.$element.bind('keydown.meta_down', function(event) {
                self.subscript();
                return false;
            });

            self.$element.bind('keydown.meta_up', function(event) {
                self.superscript();
                return false;
            });

            self.$element.bind('keyup.left', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.right', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.up', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.down', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keydown.esc', function(event) {
                self.$element.blur();
            });
        } else {
            // Windows/*nix Keybindings

            self.$element.bind('keydown.ctrl_b', function(event) {
                self.strong();
                return false;
            });

            self.$element.bind('keydown.ctrl_i', function(event) {
                self.emphasis();
                return false;
            });

            self.$element.bind('keydown.ctrl_l', function(event) {
                self.linkEditor();
                return false;
            });

            self.$element.bind('keydown.ctrl_s', function(event) {
                self.strikethrough();
                return false;
            });

            self.$element.bind('keydown.ctrl_u', function(event) {
                self.underline();
                return false;
            });

            self.$element.bind('keydown.tab', function(event) {
                self.indent();
                return false;
            });

            self.$element.bind('keydown.shift_tab', function(event) {
                self.outdent();
                return false;
            });

            self.$element.bind('keydown.ctrl_down', function(event) {
                self.subscript();
                return false;
            });

            self.$element.bind('keydown.ctrl_up', function(event) {
                self.superscript();
                return false;
            });

            self.$element.bind('keyup.left', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.right', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.up', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keyup.down', function(event) {
                self.updateButtonState();
            });

            self.$element.bind('keydown.esc', function(event) {
                self.$element.blur();
            });
        }
    }

    // Tip events
    // ================================
    self.$tip.on('click', '[data-editor]', function(event) {
        event.preventDefault();

        var action = $(this).data('editor');
        var value = false;

        self.$element.focus();

        switch (action) {
            case 'h1':
                self.heading('H1');
                break;
            case 'h2':
                self.heading('H2');
                break;
            case 'h3':
                self.heading('H3');
                break;
            case 'h4':
                self.heading('H4');
                break;
            case 'h5':
                self.heading('H5');
                break;
            case 'h6':
                self.heading('H6');
                break;
            case 'link':
                self.linkEditor();
                break;
            case 'indent':
                self.indent();
                break;
            case 'em':
                self.emphasis();
                break;
            case 'ol':
                self.orderedList();
                break;
            case 'outdent':
                self.outdent();
                break;
            case 'p':
                self.paragraph();
                break;
            case 'strike':
                self.strikethrough();
                break;
            case 'strong':
                self.strong();
                break;
            case 'sub':
                self.subscript();
                break;
            case 'sup':
                self.superscript();
                break;
            case 'table':
                self.tableEditor();
                break;
            case 'ul':
                self.unorderedList();
                break;
            case 'u':
                self.underline();
                break;
            case 'unlink' :
                self.unlink();
                break;
        }
    });

    self.$tip.on('blur', 'a, .dropdown-toggle, input, select, button', function(event) {
        setTimeout(function() {
            if (document.activeElement != self.$element[0] && ! clicked.hasClass('poe') && ! clicked.parents('.poe').length) {
                self.$tip.hide();
            }
        }, 200);
    });
}

if (!$.fn.tooltip) {
    throw new Error('Poe requires tooltip.js');
}

Poe.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    container: 'body',
    html: true,
    placement: 'top',
    template: '<div class="poe" role="tooltip"><div class="arrow"></div><div class="poe-content"></div></div>',
    trigger: 'manual',

    elements: ['em','format','h1','h2','h3','h4','h5','h6','indent','link','ol','outdent','p','strike','strong','sub','sup','table','u','ul','unlink'],
    content: '<div class="view_toolbar" style="line-height:34px;height:34px">' +
        '<div data-editor="format" class="btn-group"><a class="btn btn-default btn-small dropdown-toggle" data-toggle="dropdown" href="#" title="Formatting">' +
        'Format <span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
        '<li data-editor="p"><a href="#">Paragraph</a></li>' +
        '<li data-editor="h1"><a href="#"><h1>Heading 1</h1></a></li>' +
        '<li data-editor="h2"><a href="#"><h2>Heading 2</h2></a></li>' +
        '<li data-editor="h3"><a href="#"><h3>Heading 3</h3></a></li>' +
        '<li data-editor="h4"><a href="#"><h4>Heading 4</h4></a></li>' +
        '<li data-editor="h5"><a href="#"><h5>Heading 5</h5></a></li>' +
        '<li data-editor="h6"><a href="#"><h6>Heading 6</h6></a></li>' +
        '</ul>' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="strong" title="Bold"><i class="fa fa-bold"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="em" title="Emphasis"><i class="fa fa-italic"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="u" title="Underline"><i class="fa fa-underline"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="strike" title="Strikethrough"><i class="fa fa-strikethrough"></i></a> ' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="sub" title="Subscript"><i class="fa fa-subscript"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="sup" title="Superscript"><i class="fa fa-superscript"></i></a> ' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="ol" title="Ordered list"><i class="fa fa-list-ol"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="ul" title="Unordered list"><i class="fa fa-list-ul"></i></a> ' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="indent" title="Indent"><i class="fa fa-indent"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small" data-editor="outdent" title="Outdent"><i class="fa fa-outdent"></i></a> ' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="link" title="Hyperlink"><i class="fa fa-link"></i></a> ' +
        '<a href="#" class="btn btn-default btn-small disabled" data-editor="unlink" title="Remove hyperlink"><i class="fa fa-unlink"></i></a> ' +
        '</div> ' +
        '<div class="btn-group">' +
        '<a href="#" class="btn btn-default btn-small" data-editor="table" title="Table"><i class="fa fa-table"></i></a> ' +
        '</div> ' +
        '</div>' +
        '' +
        '<div class="view_link hide" style="line-height:34px;height:34px">' +
        '<form class="form-inline">' +
        '<input type="text" value="" placeholder="http://" class="form-control"/>' +
        ' ' +
        '<button class="btn btn-default" type="submit" title="Commit hyperlink."><i class="fa fa-link"></i></button>' +
        ' ' +
        '<button name="cancel" class="btn btn-default" type="button" title="Cancel link editing."><i class="fa fa-times-circle"></i></button>' +
        '</form>' +
        '</div>' +
        '' +
        '<div class="view_table hide" style="line-height:34px;height:34px">' +
        '<form class="form-inline">' +
        //'<label>Columns:</label>' +
        '<input type="text" name="columns" placeholder="Columns" value="" class="form-control"/>' +
        //'<label>Rows:</label>' +
        ' ' +
        '<input type="text" name="rows" placeholder="Rows" value="" class="form-control"/>' +
        ' ' +
        '<button class="btn btn-default" type="submit" title="Commit table."><i class="fa fa-table"></i></button>' +
        ' ' +
        '<button name="cancel" class="btn btn-default" type="button" title="Cancel table editing."><i class="fa fa-times-circle"></i></button>' +
        '</form>' +
        '</div>',
});


// NOTE: POE EXTENDS tooltip.js
// ================================

Poe.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

Poe.prototype.constructor = Poe;

Poe.prototype.getDefaults = function () {
    return Poe.DEFAULTS;
}

Poe.prototype.setContent = function () {
    var $tip    = this.tip();
    var title   = this.getTitle();
    var content = this.getContent();

    $tip.find('.poe-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.poe-content').children().detach().end()[ // we use append for html objects to maintain js events
        this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.poe-title').html()) {
        $tip.find('.poe-title').hide();
    }
}

Poe.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
}

Poe.prototype.getContent = function () {
    var $e = this.$element;
    var o  = this.options;

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content);
}

Poe.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'));
}

// POE PLUGIN DEFINITION
// =========================

function Plugin(option) {
    return this.each(function () {
        var $this   = $(this);
        var data    = $this.data('bs.poe');
        var options = typeof option == 'object' && option;

        if (!data && /destroy|hide/.test(option)) {
            return;
        }

        if (!data) {
            $this.data('bs.poe', (data = new Poe(this, options)));
        }

        if (typeof option == 'string') {
            data[option]();
        }

        if ($this.prop('contenteditable') != 'true') {
            $this.prop('contenteditable', 'true');
        }

        document.execCommand('enableObjectResizing', null, false);
    });
}

var old = $.fn.poe

$.fn.poe             = Plugin
$.fn.poe.Constructor = Poe


// POPOVER NO CONFLICT
// ===================

$.fn.poe.noConflict = function () {
    $.fn.poe = old
    return this
}

// =========================

Poe.prototype.saveSelection = function()
{
    if (window.getSelection) {
        var selection = window.getSelection();

        if (selection.getRangeAt && selection.rangeCount) {
            var ranges = [];

            for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                ranges.push(selection.getRangeAt(i));
            }

            return ranges;
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }

    return null;
}

Poe.prototype.restoreSelection = function(stored)
{
    if (stored) {
        if (window.getSelection) {
            var selection = window.getSelection();

            selection.removeAllRanges();

            for (var i = 0, len = stored.length; i < len; ++i) {
                selection.addRange(stored[i]);
            }
        } else if (document.selection && stored.select) {
            stored.select();
        }
    }
}

Poe.prototype.hasParentWithTag = function(node, nodeType)
{
    var parent = $(node).parent(nodeType);

    if (parent.length > 0) {
        return parent[0];
    }

    return false;
}

Poe.prototype.getFocusNode = function()
{
    return window.getSelection().focusNode;
}

Poe.prototype.selectElementContents = function(element)
{
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
}

Poe.prototype.getSelectionLength = function()
{
    var sel, html = "";

    if (window.getSelection) {
        sel = window.getSelection();

        if (sel.rangeCount) {
            var frag = sel.getRangeAt(0).cloneContents();
            var el = document.createElement("div");
            el.appendChild(frag);
            html = el.innerHTML;
        }
    } else if (document.selection && document.selection.type == "Text") {
        html = document.selection.createRange().htmlText;
    }

    return html.length;
}

Poe.prototype.updateButtonState = function(edittable)
{
    var node = this.getFocusNode();
    var names = this.getParentNodeNames(node);

    if (names.indexOf(node.nodeName.toLowerCase()) === -1) {
        names.push(node.nodeName.toLowerCase());
    }

    names = names.concat(this.getChildrenNodeNames($('<div></div>').append(this.getSelectionHtml())));

    $('[data-editor]', this.$tip).removeClass('active');
    $('[data-editor="unlink"]', this.$tip).addClass('disabled');

    for (var name in names) {
        switch (names[name]) {
            case 'a' :
                $('[data-editor="link"]', this.$tip).addClass('active');
                $('[data-editor="unlink"]', this.$tip).removeClass('disabled');
                break;
            case 'b' :
                $('[data-editor="strong"]', this.$tip).addClass('active');
                break;
            case 'i' :
                $('[data-editor="em"]', this.$tip).addClass('active');
                break;
            default:
                $('[data-editor="' + names[name] + '"]').addClass('active');
        }
    }

    $('[title]', self.$tip).tooltip({container: 'body'});
}

Poe.prototype.getChildrenNodeNames = function(node)
{
    var names = [];

    $(node).find("*").each(function() {
        if (names.indexOf(this.nodeName.toLowerCase()) === -1) {
            names.push(this.nodeName.toLowerCase());
        }
    });

    return names;
}

Poe.prototype.getParentNodeNames = function(node, until)
{
    var names = [];

    $(node).parentsUntil(until).each(function() {
        if (names.indexOf(this.nodeName.toLowerCase()) === -1) {
            names.push(this.nodeName.toLowerCase());
        }
    });

    return names;
}

Poe.prototype.unlink = function()
{
    if (this.options.elements.indexOf('unlink') === -1) {
        return;
    }

    if (this.getSelectionLength() == 0) {
        var parent = this.hasParentWithTag(this.getFocusNode(), 'a');
        if (parent) {
            this.selectElementContents(parent);
        }
    }
    setTimeout(function() {
        document.execCommand('unlink', false, false);
    }, 200);
}

Poe.prototype.emphasis = function()
{
    if (this.options.elements.indexOf('em') === -1) {
        return;
    }

    document.execCommand('italic', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.heading = function(tag)
{
    if (this.options.elements.indexOf(tag.toLowerCase()) === -1) {
        return;
    }

    document.execCommand('heading', false, tag);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.indent = function()
{
    if (this.options.elements.indexOf('indent') === -1) {
        return;
    }

    document.execCommand('indent', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.linkEditor = function()
{
    if (this.options.elements.indexOf('link') === -1) {
        return;
    }

    var selection = this.saveSelection();
    var node = this.getFocusNode();
    var href = '';
    var size = this.getSelectionLength();
    var self = this;
    var tip = this.tip();

    if (node.nodeName.toLowerCase() === 'a') {
        href = node.attr('href');
    } else {
        var parent = this.hasParentWithTag(this.getFocusNode(), 'a');
        if (parent) {
            href = $(parent).attr('href');
            node = parent;
        }
    }

    $('.view_toolbar', tip).addClass('hide');
    $('.view_link', tip).removeClass('hide');

    setTimeout(function() {
        $('.view_link input', tip).val(href).focus();
    }, 200);

    $('.view_link button[name="cancel"]', tip).off('click').on('click', function(event) {
        event.preventDefault();
        self.$element.focus();
        self.restoreSelection(selection);
        $('.view_link', tip).addClass('hide');
        $('.view_toolbar', tip).removeClass('hide');
    });

    $('.view_link form', tip).off('submit').on('submit', function(event) {
        event.preventDefault();

        var url = $('input', this).val();

        if (size > 1) {
            self.restoreSelection(selection);
        } else {
            self.selectElementContents(node);
        }

        setTimeout(function() {
            document.execCommand('createLink', false, url);
            self.updateButtonState();
        }, 200);

        $('.view_link', tip).addClass('hide');
        $('.view_toolbar', tip).removeClass('hide');

        self.$element.focus();
    });
}

Poe.prototype.orderedList = function()
{
    if (this.options.elements.indexOf('ol') === -1) {
        return;
    }

    document.execCommand('insertOrderedList', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.outdent = function()
{
    if (this.options.elements.indexOf('outdent') === -1) {
        return;
    }

    document.execCommand('outdent', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.paragraph = function()
{
    if (this.options.elements.indexOf('p') === -1) {
        return;
    }

    document.execCommand('formatBlock', false, 'p');
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.strikethrough = function()
{
    if (this.options.elements.indexOf('strike') === -1) {
        return;
    }

    document.execCommand('strikethrough', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.strong = function()
{
    if (this.options.elements.indexOf('strong') === -1) {
        return;
    }

    document.execCommand('bold', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.subscript = function()
{
    if (this.options.elements.indexOf('sub') === -1) {
        return;
    }

    document.execCommand('subscript', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.superscript = function()
{
    if (this.options.elements.indexOf('sup') === -1) {
        return;
    }

    document.execCommand('superscript', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.table = function()
{
    if (this.options.elements.indexOf('table') === -1) {
        return;
    }

    document.execCommand('table', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.tableEditor = function()
{
    if (this.options.elements.indexOf('table') === -1) {
        return;
    }

    var self = this;
    var tip = this.tip();
    var selection = this.saveSelection();
    var node = this.getFocusNode();
    var href = '';
    var size = this.getSelectionLength();

    $('.view_toolbar', tip).addClass('hide');
    $('.view_table', tip).removeClass('hide');

    setTimeout(function() {
        $('.view_table [name="columns"]', tip).val(href).focus();
    }, 200);

    $('.view_table button[name="cancel"]', tip).off('click').on('click', function(event) {
        event.preventDefault();
        self.$element.focus();
        self.restoreSelection(selection);
        $('.view_table', tip).addClass('hide');
        $('.view_toolbar', tip).removeClass('hide');
    });

    $('.view_table form', tip).off('submit').on('submit', function(event) {
        event.preventDefault();

        var columns = parseInt($('input[name="columns"]', this).val());
        var rows = parseInt($('input[name="rows"]', this).val());

        var table = '<table class="table"><thead><tr>';

        for (var i = 0; i < columns; i++) {
            table += '<th>Heading</th>';
        }

        table += '</tr></thead><tbody>';

        for (var y = 0; y < rows; y++) {
            table += '<tr>';

            for (var x = 0; x < columns; x++) {
                table += '<td>cell</td>';
            }

            table += '</tr>';
        }

        table += '</tbody></table><p></p>';

        setTimeout(function() {
            var target;
            var targetable = ['blockquote','dl','li','ol','p','table'];

            $(node).parentsUntil(self.$element).each(function() {
                if (typeof target != undefined && targetable.indexOf(this.nodeName.toLowerCase()) >= 0) {
                    i++;
                    target = this;
                    return;
                }
            });

            if (typeof target != undefined) {
                $(target).after(table);
            } else {
                $(this).append(table);
            }

            self.$element.focus();
            self.restoreSelection(selection);

        }, 200);

        $('.view_table', tip).addClass('hide');
        $('.view_toolbar', tip).removeClass('hide');

        self.$element.focus();
    });
}

Poe.prototype.underline = function()
{
    if (this.options.elements.indexOf('u') === -1) {
        return;
    }

    document.execCommand('underline', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.unorderedList = function()
{
    if (this.options.elements.indexOf('ul') === -1) {
        return;
    }

    document.execCommand('insertUnorderedList', false, false);
    this.updateButtonState();
    this.$element.focus();
}

Poe.prototype.getSelectionHtml = function() {
    var html = '';

    if (typeof window.getSelection != 'undefined') {
        var selection = window.getSelection();

        if (selection.rangeCount) {
            var container = document.createElement('div');

            for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                container.appendChild(selection.getRangeAt(i).cloneContents());
            }

            html = container.innerHTML;
        }
    } else if (typeof document.selection != 'undefined') {
        if (document.selection.type == 'Text') {
            html = document.selection.createRange().htmlText;
        }
    }

    return html;
}

Poe.prototype.cleanWordHtml = function(d) {
    /**
     * Loops through all the elements of an array to see if any of them equal the test.
     */
    var ae = function(needle, haystack)
    {
        if (typeof(haystack) == 'object') {
            for (var i = 0; i < haystack.length; i++) {
                if (needle == haystack[i]) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Determines if there is anything but spaces between the current character, and the next equals sign
     */
    var endOfAttr = function(d, i)
    {
        var between = d.substring(i+1, d.indexOf('=', i+1));

        if (between.replace(/\s+/g, '')) {
            return true;
        } else {
            return false;
        }
    }

    var htmlentities = function(character)
    {
        //html entities translation array
        var entities = {
            '°': '&iexcl;',
            '¢': '&cent;',
            '£': '&pound;',
            '§': '&curren;',
            '•': '&yen;',
            '¶': '&brvbar;',
            'ß': '&sect;',
            '®': '&uml;',
            '©': '&copy;',
            '™': '&ordf;',
            '´': '&laquo;',
            '¨': '&not;',
            '≠': '&shy;',
            'Æ': '&reg;',
            'Ø': '&macr;',
            '∞': '&deg;',
            '±': '&plusmn;',
            '≤': '&sup2;',
            '≥': '&sup3;',
            '¥': '&acute;',
            'µ': '&micro;',
            '∂': '&para;',
            '∑': '&middot;',
            '∏': '&cedil;',
            'π': '&sup1;',
            '∫': '&ordm;',
            'ª': '&raquo;',
            'º': '&frac14;',
            'Ω': '&frac12;',
            'æ': '&frac34;',
            'ø': '&iquest;',
            '¿': '&Agrave;',
            '¡': '&Aacute;',
            '¬': '&Acirc;',
            '√': '&Atilde;',
            'ƒ': '&Auml;',
            '≈': '&Aring;',
            '∆': '&AElig;',
            '«': '&Ccedil;',
            '»': '&Egrave;',
            '…': '&Eacute;',
            ' ': '&Ecirc;',
            'À': '&Euml;',
            'Ã': '&Igrave;',
            'Õ': '&Iacute;',
            'Œ': '&Icirc;',
            'œ': '&Iuml;',
            '–': '&ETH;',
            '—': '&Ntilde;',
            '“': '&Ograve;',
            '”': '&Oacute;',
            '‘': '&Ocirc;',
            '’': '&Otilde;',
            '÷': '&Ouml;',
            '◊': '&times;',
            'ÿ': '&Oslash;',
            'Ÿ': '&Ugrave;',
            '⁄': '&Uacute;',
            '€': '&Ucirc;',
            '‹': '&Uuml;',
            '›': '&Yacute;',
            'ﬁ': '&THORN;',
            'ﬂ': '&szlig;',
            '‡': '&agrave;',
            '·': '&aacute;',
            '‚': '&acirc;',
            '„': '&atilde;',
            '‰': '&auml;',
            'Â': '&aring;',
            'Ê': '&aelig;',
            'Á': '&ccedil;',
            'Ë': '&egrave;',
            'È': '&eacute;',
            'Í': '&ecirc;',
            'Î': '&euml;',
            'Ï': '&igrave;',
            'Ì': '&iacute;',
            'Ó': '&icirc;',
            'Ô': '&iuml;',
            '': '&eth;',
            'Ò': '&ntilde;',
            'Ú': '&ograve;',
            'Û': '&oacute;',
            'Ù': '&ocirc;',
            'ı': '&otilde;',
            'ˆ': '&ouml;',
            '˜': '&divide;',
            '¯': '&oslash;',
            '˘': '&ugrave;',
            '˙': '&uacute;',
            '˚': '&ucirc;',
            '¸': '&uuml;',
            '˝': '&yacute;',
            '˛': '&thorn;',
            'ˇ': '&yuml;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }

        if (character != ' ' && entities[character]) {
            return entities[character];
        } else {
            return character;
        }
    }

    //replacement characters
    var rchars = [["ñ","ó", "ë", "í", "ì", "î", '†', '“', '”', '’'], ["-", "-", "'", "'", '"', '"', ' ', '"', '"', "'"]];

    //allowed tags
    var tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'ul', 'ol', 'li', 'u', 'i', 'b', 'a', 'table', 'tr', 'th', 'td', 'img', 'em', 'strong', 'br'];

    //tags which should be removed when empty
    var rempty = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'ul', 'ol', 'li', 'u', 'i', 'b', 'a', 'table', 'tr', 'em', 'strong'];

    //allowed atributes for tags
    var aattr = new Array();
    aattr['a'] = ['href', 'name'];
    aattr['table'] = [];
    aattr['th'] = ['colspan', 'rowspan'];
    aattr['td'] = ['colspan', 'rowspan'];
    aattr['img'] = ['src', 'width', 'height', 'alt'];

    //tags who's content should be deleted
    var dctags = ['head'];

    //Quote characters
    var quotes = ["'", '"'];

    //tags which are displayed as a block
    var btags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'ul', 'ol', 'li', 'table', 'tr', 'th', 'td', 'br'];

    //d = data, o = out, c = character, n = next character

    var o = '';
    var i;

    //initialize flags
    //what the next character is expected to be
    var expected = '';
    //tag text
    var tag = '';
    //tag name
    var tagname = '';
    //what type of tag it is, start, end, or single
    var tagtype = 'start';
    //attribute text
    var attribute = '';
    //attribute name
    var attributen = '';
    //if the attribute has had an equals sign
    var attributeequals = false;
    //if attribute has quotes, and what they are
    var attributequotes = '';

    var c = '';
    var n = '';

    // Replace HTML comments
    d = d.replace(/<!--(.|\n)*?-->/g, '');

    //Replace all whitespace characters with spaces
    d = d.replace(/(\s|&nbsp;)+/g, ' ');

    //replace weird word characters
    for (i = 0; i < rchars[0].length; i++) {
        d = d.replace(new RegExp(rchars[0][i], 'g'), rchars[1][i]);
    }

    /*Parser format:
    The parser is divided into three parts:
    The first section is for when the current type of character is known
    The second is for when it is an unknown character in a tag
    The third is for anything outside of a tag
    */

    //editing pass
    for (i = 0; i < d.length; i++) {
        //current character
        c = d.charAt(i);
        //next character
        n = d.charAt(i+1);

        //***Section for when the current character is known

        if (expected == 'tagname') {
            //if the tagname is expected
            tagname += c.toLowerCase();

            if (n == ' ' || n == '>' || n == '/') {
                //lookahead for end of tag name
                tag += tagname;
                expected = 'tag';
            }
        } else if (expected == 'attributen') {
            //if an attribute name is expected
            attributen += c.toLowerCase();

            if (n == ' ' || n == '>' || n == '/' || n == '=') {
                //lookahead for end of attribute name
                attribute += attributen;

                if (endOfAttr(d, i)) {
                    //check to see if its an attribute without an assigned value
                    //determines whether there is anything but spaces between the attribute name and the next equals sign
                    if (ae(attributen, aattr[tagname])) {
                        //if the attribute is allowed, add it to the output
                        tag += attribute;
                    }

                    attribute = '';
                    attributen = '';
                    attributeequals = false;
                    attributequotes = '';
                }
                expected = 'tag';
            }
        } else if (expected == 'attributev') {
            //if an attribute value is expected
            attribute += c;

            if ((c == attributequotes) || ((n == ' ' || n == '/' || n == '>') && !attributequotes)) {
                //lookahead for end of value
                if (ae(attributen, aattr[tagname])) {
                    //if the attribute is allowed, add it to the output
                    tag += attribute;
                }

                attribute = '';
                attributen = '';
                attributeequals = false;
                attributequotes = '';
                expected = 'tag';
            }
        } else if (expected == 'tag') {
            //***Section for when the character is unknown but it is inside of a tag
            if (c == ' ') {
                //if its a space
                tag += c;
            } else if (c == '/' && tagname) {
                //if its a slash after the tagname, signalling a single tag.
                tag += c;
                tagtype = 'single';
            } else if (c == '/') {
                //if its a slash before the tagname, signalling its an end tag
                tag += c;
                tagtype = 'end';
            } else if (c == '>') {
                //if its the end of a tag
                tag += c;
                //if the tag is allowed, add it to the output
                if (ae(tagname, tags)) {
                    o += tag;
                }

                //if its a start tag
                if (tagtype == 'start') {
                    //if the tag is supposed to have its contents deleted
                    if (ae(tagname, dctags)) {
                        //if there is an end tag, skip to it in order to delete the tags contents
                        if (-1 != (endpos = d.indexOf('</' + tagname, i))) {
                            //have to make it one less because i gets incremented at the end of the loop
                            i = endpos-1;
                        }
                        //if there isn't an end tag, then it was probably a non-compliant single tag
                    }
                }

                tag = '';
                tagname = '';
                tagtype = 'start';
                expected = '';
            } else if (tagname && !attributen) {
                //if its an attribute name
                attributen += c.toLowerCase();
                expected = 'attributen';
                //lookahead for end of attribute name, in case its a one character attribute name
                if (n == ' ' || n == '>' || n == '/' || n == '=') {
                    attribute += attributen;
                    //check to see if its an attribute without an assigned value
                    //determines whether there is anything but spaces between the attribute name and the next equals sign
                    if (endOfAttr(d, i)) {
                        //if the attribute is allowed, add it to the output
                        if (ae(attributen, attributen)) {
                            tag += attribute;
                        }

                        attribute = '';
                        attributen = '';
                        attributeequals = false;
                        attributequotes = '';
                    }

                    expected = 'tag';
                }
            } else if (ae(c, quotes) && attributeequals) {
                //if its a start quote for an attribute value
                attribute += c;
                attributequotes = c;
                expected = 'attributev';
            } else if (attributeequals) {
                //if its an attribute value
                attribute += c;
                expected = 'attributev';

                //lookahead for end of value, in case its only one character
                if ((c == attributequotes) || ((n == ' ' || n == '/' || n == '>') && !attributequotes)) {
                    //if the attribute is allowed, add it to the output
                    if (ae(attributen, attributen)) {
                        tag += attribute;
                    }

                    attribute = '';
                    attributen = '';
                    attributeequals = false;
                    attributequotes = '';

                    expected = 'tag';
                }
            } else if (c == '=' && attributen) {
                //if its an attribute equals
                attribute += c;
                attributeequals = true;
            } else {
                //if its the tagname
                tagname += c.toLowerCase();
                expected = 'tagname';

                if (n == ' ' || n == '>' || n == '/') {
                    //lookahead for end of tag name, in case its a one character tag name
                    tag += tagname;
                    expected = 'tag';
                }
            }
        } else {
            //if nothing is expected
            if (c == '<') {
                //if its the start of a tag
                tag = c;
                expected = 'tag';
            } else {
                //anything else
                o += htmlentities(c); // o += c;
            }
        }
    }

    // Beautifying regexs

    // Remove duplicate spaces
    o = o.replace(/\s+/g, ' ');
    // Remove unneeded spaces in tags
    o = o.replace(/\s>/g, '>');

    // Remove empty tags, this loops until there is no change from running the regex.
    var remptys = rempty.join('|');
    var oo = o;

    while ((o = o.replace(new RegExp("\\s?<(" + remptys + ")>\s*<\\/\\1>", 'gi'), '')) != oo) {
        oo = o;
    }

    // Make block tags regex string
    var btagss = btags.join('|');
    // Add newlines after block tags
    o = o.replace(new RegExp("\\s?</(" + btagss+ ")>", 'gi'), "</$1>\n");
    // Remove spaces before block tags
    o = o.replace(new RegExp("\\s<(" + btagss + ")", 'gi'), "<$1");

    // Fix lists
    o = o.replace(/((<p.*>\s*(&middot;|&#9642;) .*<\/p.*>\n)+)/gi, "<ul>\n$1</ul>\n");//make ul for dot lists
    o = o.replace(/((<p.*>\s*\d+\S*\. .*<\/p.*>\n)+)/gi, "<ol>\n$1</ol>\n");//make ol for numerical lists
    o = o.replace(/((<p.*>\s*[a-z]+\S*\. .*<\/p.*>\n)+)/gi, "<ol>\n$1</ol>\n");//make ol for latin lists
    o = o.replace(/<p(.*)>\s*(&middot;|&#9642;|\d+(\S*)\.|[a-z]+\S*\.) (.*)<\/p(.*)>\n/gi, "\t<li$1>$3$4</li$5>\n");//make li

    // Extend outer lists around the nesting lists
    o = o.replace(/<\/(ul|ol|ol)>\n(<(?:ul|ol|ol)>[\s\S]*<\/(?:ul|ol|ol)>)\n(?!<(ul|ol|ol)>)/g, "</$1>\n$2\n<$1>\n</$1>\n");

    // Nesting lists
    o = o.replace(/<\/li>\s+<\/ol>\s+<ul>([\s\S]*?)<\/ul>\s+<ol>/g, "\n<ul>$1</ul></li>"); // ul in ol
    o = o.replace(/<\/li>\s+<\/ol>\s+<ol>([\s\S]*?)<\/ol>\s+<ol>/g, "\n<ol>$1</ol></li>"); // latin in ol
    o = o.replace(/<\/li>\s+<\/ul>\s+<ol>([\s\S]*?)<\/ol>\s+<ul>/g, "\n<ol>$1</ol></li>"); // ol in ul
    o = o.replace(/<\/li>\s+<\/ul>\s+<ol>([\s\S]*?)<\/ol>\s+<ul>/g, "\n<ol>$1</ol></li>"); // latin in ul
    o = o.replace(/<\/li>\s+<\/ol>\s+<ol>([\s\S]*?)<\/ol>\s+<ol>/g, "\n<ol>$1</ol></li>"); // ul in latin
    o = o.replace(/<\/li>\s+<\/ul>\s+<ol>([\s\S]*?)<\/ol>\s+<ul>/g, "\n<ol>$1</ol></li>"); // ul in latin

    // Remove leftovers of review comments
    o = o.replace(/<a[^>]*>(.+?)<\/a\s*><a href="#_msocom_[0-9]"[^>]*>(.+?)<\/a\s*>\s/gi, '$1');
    o = o.replace(/<a name="_msocom_[0-9]"><\/a><p>(.*)<\/p>/gi, '');

    // Remove empty tags. This is needed a second time to delete empty lists that were created to fix nesting, but weren't needed.
    o = o.replace(new RegExp("\\s?<(" + remptys + ")>\s*<\\/\\1>", 'gi'), '');

    return o;
}

}(window.jQuery);

});
