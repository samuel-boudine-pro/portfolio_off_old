// Dynamic events
// --------------
var lastDivFocus = null;
var lastIndexFocus = null;
var lastSearchMatch = null;
var searchMsgEnable = false;
var timerSearch = null;

function listExpandClick(This) {
    list.expand($(This).parent().parent());
}

function listDivDblClick(This) {
    if ($(This).parent().attr('data-id') != '1')
        list.expand($(This).parent());

    if (document.selection && document.selection.empty)
        document.selection.empty();
    else if (window.getSelection)
        window.getSelection().removeAllRanges();
}

function listDivFocus(This) {
    if ($(This).prop('tagName') == 'HTML')
        return;

    var indexThis = $(This).attr('tabindex');
    var indexParent = $(This).parent().attr('tabindex');
    var index = indexThis ? indexThis : indexParent;
    var div = indexThis ? This : $(This).parent();
    var classParent = $(This).attr('class');
    var testIcon = classParent && classParent == 'md' || classParent == 'd' || classParent == 'do' || classParent == 'f';
    var testToolTip = $(This).parent().attr('id') == 'toolTip' || $(This).parent().parent().attr('id') == 'toolTip';
    var testSearch = $(This).attr('id') == 'search';
    var blur = function() {
        $('[tabindex="' + lastIndexFocus + '"]').removeClass('selected');
        lastIndexFocus = null;
        lastDivFocus = null;
    }

    if ((indexThis || (indexParent && testIcon)) && lastIndexFocus != index) {
        if (lastIndexFocus)
            blur();

        if ($('#toolTip').css('display') == 'none' && toolTipEnable) {
            $('#toolTip').fadeIn(150);
        }

        lastDivFocus = div;
        lastIndexFocus = index;
        $(div).addClass('selected');
        if (toolTipEnable) $('#toolTip div').html(list.toolTip($(div).parent()));
    }

    if (!index && lastIndexFocus && !testToolTip && !testSearch) {
        if (toolTipEnable) $('#toolTip').fadeOut(150);
        blur();
    }
}

// Document loaded
// ---------------
$(document).ready(function() {

    // Preloading image
    // ----------------
    var loadMobile = new Image();
    loadMobile.src = $('#loadMobile').attr('src');

    // Document click
    // --------------
    $(document).click(function(e) {
        aboutClose(e.target);
        listDivFocus(e.target);
    });

    // About
    // -----
    $('img[data-button="about"]').click(function() {
        $('#about').fadeIn()
    });

    function aboutClose(target) {
        var modal = $('#about').get(0);

        if (target == modal)
            $(modal).fadeOut();
    }

    // NavBar buttons
    // --------------

    // Button selectable
    function selected(button) {
        var stat = $(button).attr('class');

        if (stat == 'selected')
            $(button).removeClass('selected');
        else
            $(button).addClass('selected');

        return stat == 'selected';
    }

    $([
        ['tree', treeEnable],
        ['toolTip', toolTipEnable],
        ['info', infoEnable]
    ]).each(function() {
        if (this[1])
            $('img[data-button="' + this[0] + '"]').addClass('selected');
    });

    // Style update
    function cssStyleUpdate(button) {
        list.loading.start();

        setTimeout(function(THIS) {
            $('style').get(0).remove();
            setStyle();
            list.loading.stop();
        }, 16, this);
    }

    // Search
    function search(e, This) {
        var val = $(This).val().trim().replace(/<br>|&nbsp;/g, '').replace(/\+/g, ' ');
        var regExpValid = true;

        if (lastSearchMatch && lastSearchMatch.length > 0 && e.type == 'keydown' && e.keyCode && e.keyCode == 13) {
            $('#searchMsg').fadeOut(150);
            $('.redMatch').removeClass('redMatch');
            searchMsgEnable = false;
            list.searchMatchOpen($(lastDivFocus).parent(), val);

            return;
        } else if (e.type == 'keyup' && e.keyCode && e.keyCode == 13)
            return;

        if (val.length > 0) {
            var msg = '';
            var icon = $(lastDivFocus).find('> i').eq(0).attr('class');

            try { new RegExp(val) } catch (e) { regExpValid = false; }

            if (!regExpValid)
                msg = lang.searchInvalidRegex;
            else if (icon == '_p')
                msg = lang.searchDirEmpty;
            else if (!lastDivFocus || !(icon && icon == 'p' || icon == 'l' || icon == 'md'))
                msg = lang.searchNoDir;
            else {
                msg = lang.searchLoad;

                clearTimeout(timerSearch);
                timerSearch = setTimeout(function() {
                    var found = list.searchMatch($(lastDivFocus).parent(), val);
                    var nb = found.length;
                    var plural = nb > 1 ? lang.toolTipPlural : '';
                    var msg;
                    lastSearchMatch = found;

                    if (nb > 0)
                        msg = list.nbFormat.format(nb) + ' ' + lang.searchItem + plural + ' ' + lang.searchFound + plural + lang.searchSucces;
                    else
                        msg = lang.searchNoFound;

                    $('#searchMsg').html('<span></span>' + msg);
                }, 300);
            }

            $('#searchMsg').html('<span></span>' + msg);

            if (!searchMsgEnable) {
                $('#searchMsg').fadeIn(150);
                searchMsgEnable = true;
            }
        } else {
            $('#searchMsg').fadeOut(150);
            searchMsgEnable = false;
        }
    }

    $('#search').blur(function() {
        $('#searchMsg').fadeOut(150);
        searchMsgEnable = false;
    });

    $('img[data-button="search"]').click(function() {
        var e = { 'type': 'keydown', 'keyCode': 13 };
        search(e, this);
    });

    $('#search').on('keydown keyup focus', function(e) {
        search(e, this);
    });

    // Other buttons click events
    $('img[data-button="expand"]').click(function() {
        list.expandAll();
    });

    $('img[data-button="top"]').click(function() {
        $("html, body").stop().animate({ scrollTop: 0 }, 150);
    });

    $('img[data-button="tree"]').click(function() {
        treeEnable = !selected(this);
        cssStyleUpdate();
    });

    $('img[data-button="toolTip"]').click(function() {
        toolTipEnable = !selected(this);

        if (!toolTipEnable)
            $('#toolTip').fadeOut(150);
    });

    $('img[data-button="info"]').click(function() {
        infoEnable = !selected(this);
        cssStyleUpdate();
    });

    // Init language
    document.title = lang.metaTitle;
    $('img[data-button="expand"]').attr('title', lang.navBarTitleExpand);
    $('img[data-button="top"]').attr('title', lang.navBarTitleTop);
    $('img[data-button="tree"]').attr('title', lang.navBarTitleTree);
    $('img[data-button="toolTip"]').attr('title', lang.navBarTitleToolTip);
    $('img[data-button="info"]').attr('title', lang.navBarTitleInfo);
    $('img[data-button="about"]').attr('title', lang.navBarTitleAbout);
    $('#navBar > em').eq(0).html(lang.loading);
    $('#about > div').eq(0).html(lang.aboutBox);

    // Init list
    list.init();

});

// List management
// ---------------
var list = {

    // Params
    // ------
    firstExpanded: {},
    expanded: {},
    nbExpand: 0,
    nbFormat: new Intl.NumberFormat(),
    expanding: false,

    // Loading
    // -------
    loading: {
        start: function() {
            $('#navBar .load').css({ 'display': 'inline-block' });

            var src = $('#loadMobile').attr('src');
            $('#loadMobile').attr('src', src.replace(/(.+\/).+\.svg$/, '$1loading.svg'));
        },

        stop: function() {
            $('#navBar .load').css({ 'display': 'none' });

            var src = $('#loadMobile').attr('src');
            $('#loadMobile').attr('src', src.replace(/(.+\/).+\.svg$/, '$1loadingMonochrome.svg'));
        }
    },

    // Init
    // ----
    init: function() {
        setTimeout(function(THIS) {
            THIS.root();
            THIS.loading.stop();
        }, 16, this);
    },

    // Reset
    // -----
    reset: function() {
        this.firstExpanded = {};
        this.expanded = {};
        this.nbExpand = 0;
    },

    // Display first elements
    // ----------------------
    root: function() {
        var This = this;
        var html = '';

        $('#listMainDir').html(
            '<i class="md"></i>' + (DATA.name != '/?ROOT?/' ? DATA.name : lang.rootDefault)
        );

        this.count(DATA);
        this.folderSize(DATA);
        $('#list > small').html(this.info(DATA));

        $(DATA.child).each(function(i) {
            html += This.line(i, (i == DATA.child.length - 1), this, false);
        });

        $('#list ul[data-parent="0"]').append(html);
    },

    // Insert block
    // ------------
    block: function(data, all) {
        var This = this;
        var html = '';

        if (!this.firstExpanded[data.id]) {
            this.firstExpanded[data.id] = true;
            html += '<ul data-parent="' + data.id + '">';

            $(data.child).each(function(i) {
                html += This.line(i, (i == data.child.length - 1), this, all);
            });

            html += '</ul>';
        }

        return html;
    },

    // Insert line
    // -----------
    line: function(pos, last, data, all) {
        // Count
        if (data.child) {
            this.count(data);
            this.folderSize(data);
        } else if (DATA.sizeEnable && data.isFolder)
            data.size = 0;

        // Set line
        var expand = '<i onclick="listExpandClick(this)" class="' + (data.child ? (all ? 'l' : 'p') : '_p') + '"></i>';
        var icon = '<i class="' + (data.isFolder ? (all ? 'do' : 'd') : 'f') + '"></i>';
        var br = last ? '<b class="vBar"></b>' : '';
        var child = '';

        // Expand all
        if (all && data.child) {
            this.expanded[data.id] = true;
            this.nbExpand++;
            child = this.block(data, true);
        }

        // Create line
        var html = '<li data-id="' + data.id + '" data-pos="' + pos + '">' +
            '<b class="hBar"></b>' +
            '<div ondblclick="listDivDblClick(this)" tabindex="' + data.id + '">' +
            (data.isFolder ? expand : '') +
            icon +
            data.name +
            '</div>' +
            '<small> ' + this.info(data) + '</small>' +
            child +
            br +
            '</li>';
        return html;
    },

    // Expand folder
    // -------------
    expand: function(li) {
        var liRound = $(li).find('> div > i').eq(0);

        // Not expandable
        if (liRound.attr('class') == '_p' || liRound.attr('class') == 'f') {
            if (liRound.attr('class') == 'f') {
                var data = this.find.data(li);

                if (data.path)
                    window.open(data.path);
            }

            return;
        }

        if (!this.expanding) {
            this.loading.start();
            this.expanding = true;

            setTimeout(function(THIS) {
                var data = THIS.find.data(li);

                // Expand
                if (!THIS.expanded[data.id]) {
                    liRound.attr('class', 'l');
                    $(li).find('i').eq(1).attr('class', 'do');
                    $(li).append(THIS.block(data, false));

                    THIS.nbExpand++;
                    THIS.expanded[data.id] = true;

                    li.find('> ul:first').css({ 'display': 'none', 'visibility': 'hidden' });
                    li.find('> ul:first').slideDown(150, function() {
                        li.find('> ul:first').css({ 'display': 'none', 'visibility': 'visible' });
                        li.find('> ul:first').fadeIn(150, function() { THIS.expanding = false; });
                    });

                    THIS.loading.stop();
                }

                // Collapse
                else {
                    liRound.attr('class', 'p');
                    $(li).find('> div > i').eq(1).attr('class', 'd');
                    THIS.nbExpand--;
                    THIS.expanded[data.id] = false;

                    li.find('> ul:first').css({ 'visibility': 'hidden' });
                    li.find('> ul:first').slideUp(150, function() { THIS.expanding = false; });

                    THIS.loading.stop();
                }
            }, 16, this);
        }
    },

    // Expand recursive
    // ----------------
    expandAll: function() {
        this.loading.start();

        setTimeout(function(THIS) {
            var This = THIS;
            var rootNotExpand = true;
            $('ul[data-parent="0"]').html('');

            $(DATA.child).each(function(i) {
                if (THIS.expanded[this.id])
                    rootNotExpand = false;
            });

            if (THIS.nbExpand <= 0 || rootNotExpand) {
                THIS.reset();
                var html = '';

                $(DATA.child).each(function(i) {
                    html += This.line(i, (i == DATA.child.length - 1), this, true);
                });

                $('#list ul[data-parent="0"]').append(html);
            } else {
                THIS.reset();
                THIS.root();
            }

            THIS.loading.stop();
        }, 16, this);
    },

    // Expand that node
    // ----------------
    expandThatNode: function(knotsToOpen) {
        var ul = $('ul[data-parent="0"]');
        var forEval = 'DATA';

        for (var i = 0; i < knotsToOpen.length; i++) {
            if (!knotsToOpen[i][1])
                ul.find('> li > div').eq(knotsToOpen[i][0]).addClass('redMatch');
            else {
                forEval += '.child[' + knotsToOpen[i][0] + ']';
                var li = ul = ul.find('> li').eq(knotsToOpen[i][0]);
                var liRound = li.find('> div > i').eq(0);
                var data = eval(forEval);
                var html = this.block(data, false);

                if (html != '')
                    li.append(html);

                if (!this.expanded[data.id]) {
                    this.nbExpand++;
                    this.expanded[data.id] = true;
                } else
                    liRound.attr('class', 'l');

                ul = li.find('> ul').eq(0);
                ul.css({ 'display': 'block', 'visibility': 'visible' });
            }
        }
    },

    // Find
    // ----
    find: {
        // At the root
        recursive: function(parents, ul, li) {
            var stop = true;

            while (stop) {
                parents.push(li.attr('data-pos'));

                if (ul.attr('data-parent') == '0')
                    stop = false;
                else {
                    ul = ul.parent().parent();
                    li = li.parent().parent();
                }
            }
        },

        // Data
        data: function(li) {
            var parents = new Array();
            var ul = li.parent();

            if (!ul.attr('data-parent'))
                return DATA;

            this.recursive(parents, ul, li);
            parents.reverse();

            var find = 'DATA.child[';
            find += parents.join('].child[');
            find += ']';

            return eval(find);
        },

        // Path
        path: function(li) {
            var parents = new Array();
            var path = new Array();
            var ul = li.parent();

            if (!ul.attr('data-parent'))
                return DATA.name == '/?ROOT?/' ? lang.rootDefault : DATA.name;

            this.recursive(parents, ul, li);
            parents.reverse();

            for (var i = 0; i < parents.length; i++) {
                var find = 'DATA.child[';
                find += $.grep(parents, Boolean).join('].child[');
                find += '].name';

                delete parents[parents.length - i - 1];
                path.push(eval(find));
            }

            path.push(DATA.name == '/?ROOT?/' ? lang.rootDefault : DATA.name);
            return path.reverse();
        }
    },

    // Search
    // ------
    searchMatch: function(li, search) {
        var data = this.find.data(li);
        var found = [];

        function recursive(_data) {
            _data.child.filter(function(x) {
                if (x.name.match(new RegExp(search, 'i'))) found.push(x.id);
                if (x.child) recursive(x);
            });
        };
        recursive(data);

        return found;
    },

    searchMatchOpen: function() {
        this.loading.start();

        setTimeout(function(THIS) {
            var arr = [];

            function recursive(_data, id) {
                var i = 0;

                var result = _data.child.filter(function(x) {
                    if (x.id == id) {
                        arr.push([i, false]);
                        return true;
                    }

                    if (x.child) {
                        if (recursive(x, id).length > 0) {
                            arr.push([i, true]);
                            return true;
                        }
                    }

                    i++;
                });

                return result;
            }

            for (var i = 0; i < lastSearchMatch.length; i++) {
                recursive(DATA, lastSearchMatch[i]);
                THIS.expandThatNode(arr.reverse());
                arr = [];
            }

            THIS.loading.stop();
        }, 300, this);
    },

    // Count
    // -----
    count: function(data) {
        if (data.isCount)
            return;

        var nbDirThis = 0;
        var nbFileThis = 0;
        var nbDir = 0;
        var nbFile = 0;

        data.child.filter(function(x) {
            x.isFolder ? nbDirThis++ : nbFileThis++;
        });

        function recursive(_data) {
            _data.child.filter(function(x) {
                x.isFolder ? nbDir++ : nbFile++;
                if (x.child) recursive(x);
            });
        };
        recursive(data);

        data.isCount = true;
        data.nbDirThis = nbDirThis;
        data.nbFileThis = nbFileThis;
        data.nbDir = nbDir;
        data.nbFile = nbFile;
    },

    // Folder size
    // -----------
    folderSize: function(data) {
        if (!DATA.sizeEnable)
            return;

        var sumSize = 0;

        function recursive(_data) {
            _data.child.filter(function(x) {
                if (!x.isFolder) sumSize += x.fileSize;
                if (x.child) recursive(x);
            });
        };
        recursive(data);

        data.size = sumSize;
    },

    // Convert octet in unit
    // ---------------------
    convertSize: function(size) {
        if (size === 0)
            return 0 + ' octet';

        var sign = Math.sign(size);
        size = Math.abs(size);

        var def = [
            [1, "octets"],
            [1024, "Ko"],
            [1024 * 1024, "Mo"],
            [1024 * 1024 * 1024, "Go"],
            [1024 * 1024 * 1024 * 1024, "To"],
            [1024 * 1024 * 1024 * 1024 * 1024, "Po"],
            [1024 * 1024 * 1024 * 1024 * 1024 * 1024, "Eo"],
            [1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024, "Zo"],
            [1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024, "Yo"],
            [1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024, "kYo"]
        ];

        for (var i = 0; i < def.length; i++)
            if (size < def[i][0])
                return (sign * (size / def[i - 1][0])).toFixed(2).replace(/\.00?$|(\.[A-Za-z0-9])0$/, '$1') + " " + def[i - 1][1];

        return (sign * (size / def[def.length - 1][0])).toFixed(2).replace(/\.00?$|(\.[A-Za-z0-9])0$/, '$1') + " " + def[def.length - 1][1];
    },

    // Info
    // ----
    info: function(data) {
        var text = '';

        // Number, type, size
        text += '[';

        if (data.isFolder) {
            if (data.nbDir + data.nbFile > 0) {
                if (data.nbDir > 0)
                    text += list.nbFormat.format(data.nbDir) + ' ' + lang.toolTipDir + (data.nbDir > 1 ? lang.toolTipPlural : '');

                if (data.nbFile > 0)
                    text += (data.nbDir > 0 ? ', ' : '') + list.nbFormat.format(data.nbFile) + ' ' + lang.toolTipFile + (data.nbFile > 1 ? lang.toolTipPlural : '');

                if (DATA.sizeEnable)
                    text += (data.nbDir + data.nbFile > 0 ? ', ' : '') + this.convertSize(data.size);
            } else
                text += lang.toolTipDirEmpty;
        } else {
            text += data.type;

            if (DATA.sizeEnable)
                text += ', ' + this.convertSize(data.fileSize);
        }

        text += ']';

        // Date
        var _date = [];

        if (data.dateCreate) _date.push(lang.toolTipCreate.toLowerCase() + data.dateCreate);
        if (data.dateEdit) _date.push(lang.toolTipEdit.toLowerCase() + data.dateEdit);
        if (data.dateAccess) _date.push(lang.toolTipAccess.toLowerCase() + data.dateAccess);

        text += ' ' + _date.join(', ');

        return text;
    },

    // Tooltip
    // -------
    toolTip: function(li) {
        var data = this.find.data(li);
        var textFormatNb = function(title, nbDir, nbFile) {
            function textNb(nb, fileDir) {
                return list.nbFormat.format(nb) + ' ' + fileDir + (nb > 1 ? lang.toolTipPlural : '');
            }

            var text = '<strong>' + title + '</strong><br>';

            if (nbDir && !nbFile)
                text += textNb(nbDir, lang.toolTipDir);
            else if (!nbDir && nbFile)
                text += textNb(nbFile, lang.toolTipFile);
            else if (!nbDir && !nbFile)
                text += lang.toolTipDirEmpty;
            else {
                text += textNb(nbDir, lang.toolTipDir);
                text += lang.toolTipAnd;
                text += textNb(nbFile, lang.toolTipFile);
            }

            return text + '<hr>';
        };
        var relativePath = this.find.path(li);
        var folderSize = DATA.sizeEnable ? this.convertSize(data.size) : '';

        // Type
        var text = '<div id="' + (data.isFolder ? 'dir' : 'file') + '">' + (!data.isFolder ? data.type : folderSize) + '</div>';

        // Title
        text += '<h2>' + (data.idParent == 0 && data.name == '/?ROOT?/' ? lang.rootDefault : data.name) + '</h2>';

        // Number elements
        if (data.isFolder) {
            text += textFormatNb(lang.toolTipTitleNbDir, data.nbDirThis, data.nbFileThis);

            if (data.nbDir)
                text += textFormatNb(lang.toolTipTitleNbDirNSubdir, data.nbDir, data.nbFile);
        }

        // File size
        if (!data.isFolder && DATA.sizeEnable) {
            text += '<strong>' + lang.toolTipTitleSize + '</strong><br>';
            text += this.convertSize(data.fileSize);
            text += '<hr>';
        }

        // Date
        var _date = [];

        if (data.dateCreate) _date.push(lang.toolTipCreate + data.dateCreate);
        if (data.dateEdit) _date.push(lang.toolTipEdit + data.dateEdit);
        if (data.dateAccess) _date.push(lang.toolTipAccess + data.dateAccess);

        if (_date.length > 0) {
            text += '<strong>' + lang.toolTipTitleDate + '</strong><br>';
            text += _date.join('<br>');
            text += '<hr>';
        }

        // Relative path
        text += '<strong>' + lang.toolTipTitlePathRelative + '</strong><br>';
        text += '<span>';
        if ($.isArray(relativePath))
            for (var i = 0; i < relativePath.length; i++) {
                text += relativePath[i];

                if (i != relativePath.length - 1)
                    text += ' &#x21E8; ';
            }
        else
            text += relativePath;
        text += '</span>';

        // Real path
        if (data.path) {
            text += '<hr>';
            text += '<strong>' + lang.toolTipTitlePathReal + '</strong><br>';
            text += '<span>' + data.path + '</span>';
        }

        return text;
    }

};