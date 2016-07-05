var Tank = {
    direction : 0,
    program : [],
    pstep : 0,
    _stop : false,
    init : function(a) {// {x, y, step, steptime}
        this.top      = a.y * a.step + Game.margin
        this.left     = a.x * a.step + Game.margin
        this.width    = a.step
        this.height   = a.step
        this.step     = a.step
        this.steptime = a.steptime
        this.x = a.x
        this.y = a.y
        this.pstep = 0
        this.direction = 3
        this._stop = false
        this.el = $('<div>').addClass('el tank').css({
            top       : this.top    + 'px',
            left      : this.left   + 'px',
            width     : this.width  + 'px',
            height    : this.height + 'px',
            transform : 'rotate(' + (this.direction * 90) + 'deg)'
        })
        $(Game.container).append(this.el)
    },
    /*recover : function() {
        this.x = this.startx
        this.y = this.starty
        this.top       = this.y * a.step
        this.left      = this.x * a.step + Game.margin
        this.direction = this.startdirection
        $(this.el).css({
            top       : this.top    + 'px',
            left      : this.left   + 'px',
            width     : this.width  + 'px',
            height    : this.height + 'px',
            transform : 'rotate(' + (this.direction * 90) + 'deg)'
        })
    },*/
    _explosion : false,
    _move : function() {
        console.log('move', typeof this.x, typeof DIR[this.direction].x)
        this.x = parseInt(this.x) + DIR[this.direction].x
        this.y = parseInt(this.y) + DIR[this.direction].y
        this.left += DIR[this.direction].x * this.step
        this.top  += DIR[this.direction].y * this.step
        var check = this.collisions(this)
        if(check) {
            console.log('run check', check)
            switch(check.type) {
                case 'mine' : this._explosion = true;/*this.stop();*/break;
            }
        }
        $(this.el).animate({
            left : '+=' + (DIR[this.direction].x * this.step) + 'px',
            top : '+=' + (DIR[this.direction].y * this.step) + 'px'
        }, this.steptime, function() {
            if(this._explosion) {
                this._explosion = false
                $(check).remove();
                $(this.el).remove();
                explosion(this.left, this.top, this.width, this.height, 32, function() {
                    Game.over()
                })
            }
            this._stop = false
        }.bind(this))
    },
    _left : function() {
        this.rotate(-1)
    },
    _right : function() {
        this.rotate(1)
    },
    rotate : function(i) {
        this.direction += i
        if(this.direction > DIR.length - 1) {this.direction -= DIR.length}
        if(this.direction < 0) {this.direction += DIR.length}
//        $(this.el).css({
//            transform : 'rotate(' + (this.direction * 90) + 'deg)'
//        })
        $({deg: ((this.direction - i) * 90)}).animate({deg: (this.direction * 90)}, {
             duration: this.steptime,
             step: function(now) {
                 $(this.el).css({
                    transform: 'rotate(' + now + 'deg)'
                 });
             }.bind(this)
         })
    },
    _fire : function() {
        var debug = DIR[this.direction].x
        new bullet({
            direction : this.direction,
            width     : 40,
            height    : 20,
            top       : debug ? this.top + this.height / 2 - 10 : this.top,
            left      : debug ? this.left : this.left + this.width / 2 - 20
        })
    },
    visor : function() {
        console.log(typeof this.x, typeof this.y, this.x, this.y)
        if(
            parseInt(this.x) + DIR[this.direction].x < 0          ||
            parseInt(this.x) + DIR[this.direction].x > Game.l - 1 ||
            parseInt(this.y) + DIR[this.direction].y < 0          ||
            parseInt(this.y) + DIR[this.direction].y > Game.h - 2
        ) {return true}
        for(i in Game.all) {
            if(
                Game.all[i].x == this.x + DIR[this.direction].x
             && Game.all[i].y == this.y + DIR[this.direction].y
             && Game.all[i].removed == false
            ) {
                console.log('visor', Game.all[i].type)
                if(Game.all[i].type != 'mine') {
                    return true
                }
            }
        }
        return false
    },
    collisions : function(c) {
        for(i in Game.all) {
            if(
                c.x == Game.all[i].x
             && c.y == Game.all[i].y
             && Game.all[i].removed == false
                ) {
                return Game.all[i]
            }
        }
        return false;
    },
    stop : function() {
        this._stop = true
    },
    run : function() {
        //if(this._stop) {return}
        console.log('run', this.x, this.y, this.program[this.pstep])
//        var f = this[this.program[this.pstep]]
        if(this.program[this.pstep] == 'move') {
            if(this.visor()) {
                this.stop()
            }
        }

        if(typeof this['_' + this.program[this.pstep]] == 'function') {
            if(this._stop == false) {
                var val = this.program[this.pstep]
                this['_' + val]()
            }
//            this._stop = false
        }
//        this[this.program[this.pstep]]()
//        console.log(this.pstep, this.program.length - 1)

        if(this.pstep < this.program.length - 1) {
            this.pstep += 1
            setTimeout(function() {this.run()}.bind(this), this.steptime)
        } else {}
    }
}