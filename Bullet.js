var collision = function(el, obj) {
    if(
        el.left < obj.left + obj.width
            && el.left > obj.left
            && el.top  > obj.top
            && el.top  < obj.top + obj.height
        ) {return true}
    return false
}
var checkcollisions = function(el, all) {
    for(i in all) {
        if(collision(el, all[i]) && all[i].removed == false && all[i].type != 'mine') {
            return all[i]
        }
    }
    return false
}
//----------------------------------------------------------------------------------------------------------------------
var explosion = function(left, top, width, height, steps, f) {
    this._left   = left + Game.margin
    this._top    = top + Game.margin
    this._width  = width
    this._height = height
    this.step = 0
    this.steps = steps
    console.log('e', typeof left, typeof top, width, height, typeof (top + Game.margin), this._top)
    this.f = f
    this.el = $('<div>').addClass('explosion').css({
        left   : this._left    + 'px',
        top    : this._top    + 'px',
        width  : this._width  + 'px',
        height : this._height + 'px',
        backgroundPosition : '0px 0px',
        backgroundSize : (this.steps * this._width) + 'px ' + this._height + 'px'
    })
    $('body').append(this.el)

    this.repeat = function() {
        if(this.step < this.steps - 1) {
            this.step += 1
            $(this.el).css({
                backgroundPosition : -this.step * this._width + 'px 0px'
            })
            setTimeout(function() {this.repeat()}.bind(this), Tank.steptime / this.steps)
        } else {
            $(this.el).remove()
            this.f()
            delete this
            return
        }
    }
    this.repeat()
}
//----------------------------------------------------------------------------------------------------------------------
var bullet = function(a) {
    this.step = 5
    this.direction = a.direction
    this.left   = a.left
    this.top    = a.top
    this.width  = a.width
    this.height = a.height
    console.log('new bullet', this.left, this.top)
    console.log('bullet', this.direction)
    this.el = $('<div>').addClass('el bullet').css({
        top       : this.top    + 'px',
        left      : this.left   + 'px',
        width     : this.width  + 'px',
        height    : this.height + 'px',
        transform : 'rotate(' + (this.direction * 90) + 'deg)'
    })
    $(Game.container).append(this.el)
    this.move = function() {
        this.left += DIR[this.direction].x * this.step
        this.top  += DIR[this.direction].y * this.step
        $(this.el).css({
            left :  this.left + 'px',
            top  :  this.top + 'px'
        })
        if(this.left < 0 || this.left > scale().width || this.top < 0 || this.top > scale().height) {
            $(this.el).remove()
            delete this
            return
        }
        var check = checkcollisions(this, Game.all)
        if(check) {
            switch(check.type) {
                case 'tree'     : check.removed = true;$(check).remove();break;
                case 'opponent' : check.removed = true;$(check).remove();if(Game.oponmap() == 0) {Game.win()};break;
                //case 'stone'    : $(this.el).remove();delete this;return;break;
            }
            explosion(check.left, check.top, check.width, check.height, 32, function() {})
            $(this.el).remove();delete this;return;
        }
        setTimeout(function() {this.move()}.bind(this), 20)
    }
    this.move()
}