var require = function(src) {
    var d = document
    var e = d.createElement('script')
    e.src = src
    d.head.appendChild(e)
}
require('./Tank.js')
require('./Bullet.js')
require('./help.js')
//----------------------------------------------------------------------------------------------------------------------
var DIR = [
    {x : 1, y : 0},//r
    {x : 0, y : 1},//d
    {x : -1, y : 0},//l
    {x : 0, y : -1}//u
]
//----------------------------------------------------------------------------------------------------------------------
function scale(i) {
    var _w = window.innerWidth  || document.body.clientWidth,
        _h = window.innerHeight || document.body.clientHeight,
        scale = _w / ((_w > _h) ? 480 : 320)
    return (typeof i == 'undefined') ? {width : _w, height : _h} : i * scale
}
//----------------------------------------------------------------------------------------------------------------------
var win = function(left, top, width, height, text, f) {
    this.stop = false
    this.el = $('<div>').html(text).css({
        left   : left - width / 2 + 'px',
        top    : top - height / 2 + 'px',
        width  : width  + 'px',
        height : height + 'px',
        lineHeight : height + 'px'
    }).addClass('win').click(function() {
            this.stop = true
            f()
        }.bind(this))
    this.step1 = function() {
        console.log('------step1')
        if(this.stop == false) $('.win').animate({width : '+=20px', left : '-=10px'}, function() {this.step2()}.bind(this))
    }
    this.step2 = function() {
        console.log('------step2')
        if(this.stop == false) $('.win').animate({width : '-=20px', left : '+=10px'}, function() {this.step1()}.bind(this))
    }
    $('body').append(this.el)
    this.step1()
}
//----------------------------------------------------------------------------------------------------------------------
var Game = {
    container : '#game',
    level : 0,
    steptime : 700,
    step : 10,
    init : function() {
        console.log('init')
        if(typeof localStorage[APP_ID + 'level'] == 'undefined') {
           localStorage[APP_ID + 'level'] = 0
       }
       try{this.level = parseInt(localStorage[APP_ID + 'level'])} catch(e) {}
       if(this.level > levels.length - 1) {
           this.level = levels.length - 1
       }
       this.map = levels[this.level]
       this.l = levels[this.level].split('\n')[0].length
       this.h = levels[this.level].split('\n').length
       this.step = (scale().width / this.l)|0
       this.margin = ((scale().width - this.step * this.l) / 2)
    },
    all : [],
    oponmap : function() {
        var count = 0
        for(i in this.all) {
            if(this.all[i].removed == false && this.all[i].type == 'opponent') {count += 1}
        }
        return count
    },
    add : function(a, type) {
        var el = $('<div>').addClass('el').addClass(type)
        el.type    = type
        el.top     = a.y * a.step + this.margin
        el.left    = a.x * a.step + this.margin
        el.width   = a.step
        el.height  = a.step
        el.removed = false
        el.x = a.x
        el.y = a.y
        $(el).css({
            top    : el.top    + 'px',
            left   : el.left   + 'px',
            width  : el.width  + 'px',
            height : el.height + 'px'
        })
        if(el.type != 'free') {
            this.all.push(el)
        }
        $(this.container).append(el)
    },
    draw : function() {
        console.log('draw')
        this.all = []
        $('body').html('').append(
            $('<div>').attr({id : 'game'})
        )
        var r = this.map.split('\n')
        for(y in r) {
            var c = r[y].split('')
            for(x in c) {
                var a = {
                    x        : x,
                    y        : y,
                    step     : this.step,
                    steptime : this.steptime
                }
                this.add(a, 'free');
                switch(c[x]) {
                    case '#' : this.add(a, 'stone');break;
                    case '*' : this.add(a, 'mine');break;
                    case '@' : this.add(a, 'tree');break;
                    case '!' : this.add(a, 'opponent');break;
                    case 'T' : Tank.init(a);/*Tank.startx = x;Tank.starty = y;Tank.startdirection = Tank.direction;*/
                        break;
                }
            }
        }
        var size   = scale(70),
            bottom = scale(50),
            right  = scale(10)
        $('body')
            .append(
                $('<div>').addClass('el showcontrolls').css({
                    width  : size + 'px',
                    height : size + 'px',
                    bottom : bottom + 'px',
                    right  : right + 'px'
                }).bind('touchstart', function() {
                        this.drawcontrols()
                    }.bind(this))
            )
        if(this.level == 0) {
            help1(right, bottom)
        }
            /*.append(
                $('<div>').addClass('el reset').css({
                    width  : scale(70) + 'px',
                    height : scale(70) + 'px',
                    bottom : scale(50) + 'px',
                    right  : scale(90) + 'px'
                }).click(function() {
                    document.location.reload()
                }.bind(this))
            )*/
    },
    remline : function(i) {
        for(j in Tank.program) {
            if(j > i) {
                Tank.program[j - 1] = Tank.program[j]
            }
        }
        Tank.program.length -= 1
        $('#controls .progline').eq(i).remove()
    },
    drawcontrols : function() {
        $(Game.container).append(
            $('<div>').attr({id : 'controls'})
        )
        var addline = this.controllsaddline = function(i) {
            var label = lang[Tank.program[i]]
            var el = $('<div>').html(label).addClass('progline').append(
                $('<span>').addClass('remline').bind('touchstart', function() {
                    var index = $(this).index('.remline')
                    Game.remline(index)
                })
            )
            $('#controls').append(el)
        }
        for(i in Tank.program) {
            addline(i)
        }
        var bsize = 50
        var lmargin = 10
        var bmargin = 60
        $('#controls')
//            .append(
//                $('<span>').addClass('el close').click(function() {
//                    $('#controls').remove()
//                })
//            )
            .append(
                $('<span>').addClass('el run').css({
                    width  : scale(70) + 'px',
                    height : scale(70) + 'px',
                    right  : scale(10) + 'px',
                    bottom : scale(50) + 'px'
                }).bind('touchstart', function() {
                    $('#controls').remove()
                    this.draw()
//                    Tank.recover()
                    Tank.run()
                    }.bind(this))
            )

            .append(
                $('<span>').addClass('el but bleft').css({
                    left   : scale(lmargin) + 'px',
                    bottom : scale(bmargin) + 'px',
                    width  : scale(bsize) + 'px',
                    height : scale(bsize) + 'px'
                }).bind('touchstart', function() {
                    Tank.program.push('left')
                    addline(Tank.program.length - 1)
                })
            )
            .append(
                $('<span>').addClass('el but bright').css({
                    left   : scale(2 * lmargin + bsize) + 'px',
                    bottom : scale(bmargin) + 'px',
                    width  : scale(bsize) + 'px',
                    height : scale(bsize) + 'px'
                }).bind('touchstart', function() {
                    Tank.program.push('right')
                    addline(Tank.program.length - 1)
                })
            )
            .append(
                $('<span>').addClass('el but bmove').css({
                    left   : scale(lmargin + 2 * (lmargin + bsize)) + 'px',
                    bottom : scale(bmargin) + 'px',
                    width  : scale(bsize) + 'px',
                    height : scale(bsize) + 'px'
                }).bind('touchstart', function() {
                    Tank.program.push('move')
                    addline(Tank.program.length - 1)
                })
            )
            .append(
                $('<span>').addClass('el but bfire').css({
                    left   : scale(lmargin + 3 * (lmargin + bsize)) + 'px',
                    bottom : scale(bmargin) + 'px',
                    width  : scale(bsize) + 'px',
                    height : scale(bsize) + 'px'
                }).bind('touchstart', function() {
                    Tank.program.push('fire')
                    addline(Tank.program.length - 1)
                })
            )
    },
    drawmainmenu : function() {
        console.log('drawmainmenu')
        var el1 = $('<div>').addClass('butx but1').bind('touchstart', function() {this.draw()}.bind(this)).html(lang.startbut)
        var el2 = $('<div>').addClass('butx but2').bind('touchstart', function() {
            try{localStorage[APP_ID + 'level'] = 0}catch(e){}
            this.init()
            this.draw()
        }.bind(this)).html(lang.newgame)
        $('body').append(el1)
        $('body').append(el2)
    },
    over : function() {
        win(scale().width / 2, scale().height / 2, 200, 100, lang.gameover, function() {
            document.location.reload()
        })
    },
    win : function() {
        win(scale().width / 2, scale().height / 2, 200, 100, lang.youwin, function() {
            try{
                var level = parseInt(localStorage[APP_ID + 'level'])
                if(level < levels.length - 1) {
                    localStorage[APP_ID + 'level'] = level + 1;
                    this.level += 1
                }
            } catch(e) {}
            this.init()
            Tank.program = []
            this.draw()
        }.bind(this))
    }
}
$(document).ready(function() {
    $('body').css({
        width  : scale().width  + 'px',
        height : scale().height + 'px'
    })
    Game.init()
    Game.drawmainmenu()
})