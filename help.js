var _help1 = false
var help1 = function() {
    var bplus = {
            bottom : '-=10px',
            right   : '-=10px',
            width  : '+=20px',
            height : '+=20px'
        },
        bminus = {
            bottom : '+=10px',
            right : '+=10px',
            width :'-=20px',
            height :'-=20px'
        }
    if(_help1) {return}
    var el = $('<div>').addClass('el').attr({id : 'help1'}).css({
        position : 'fixed',
        backgroundImage : 'url(help1.png)',
        backgroundSize : '100% 100%',
        width  : scale(300) + 'px',
        height : scale(300) + 'px',
        left   : scale(-300) + 'px',
        bottom : scale(50) + 'px'
//        width  : scale(110) + 'px',
//        height : scale(140) + 'px',
//        right  : scale(-10) + 'px',
//        bottom : scale(-170) + 'px'
    })
        .delay(500)
        .animate({
        bottom : scale(-50) + 'px',
        left : scale(-50) + 'px'
    }, 500/*).animate({
        bottom : scale(-70) + 'px'
    }, 300*/, function() {
        $('.showcontrolls')
            .animate(bplus)
            .delay(300)
            .animate(bminus)
    })
    $('.showcontrolls').bind('touchstart', function() {
        $('#help1').remove()
        help2()
    })
    $('body').append(el)
}
var help2 = function() {
    if(_help1) {return}
    _help1 = true
    var el = $('<div>').addClass('el').attr({id : 'help2'}).css({
        position : 'fixed',
        backgroundImage : 'url(help2.png)',
        backgroundSize : '100% 100%',
        width  : scale(200) + 'px',
        height : scale(200) + 'px',
        right  : scale(-200) + 'px',
        top    : scale(-200) + 'px',
        zIndex : 3
    })
        .delay(200)
        .animate({
            right  : scale(0) + 'px',
            top    : scale(0) + 'px'
        }, 500)
        .delay(1000)
        .animate({
            right  : scale(-200) + 'px',
            top    : scale(-200) + 'px'
        }, 300, help3)
    $('body').append(el)
}
var help3 = function() {
    var bplus = {
            bottom : '-=10px',
            left   : '-=10px',
            width  : '+=20px',
            height : '+=20px'
        },
        bminus = {
            bottom : '+=10px',
            left : '+=10px',
            width :'-=20px',
            height :'-=20px'
        }
    var el = $('<div>').addClass('el').attr({id : 'help3'}).css({
        position : 'absolute',
        backgroundImage : 'url(tank.png)',
        backgroundSize : '100% 100%',
        width  : scale(200) + 'px',
        height : scale(200) + 'px',
        right  : scale().width / 2 - scale(100) + 'px',
        top    : scale().height / 2 - scale(200) + 'px',
        zIndex : 3,
        transform : 'rotate(-90deg)'
    })
    $('.bleft')
        .delay(500)
        .animate(bplus, function() {step0()}.bind(this))
    step0 = function() {
        Tank.program.push('left')
        Game.controllsaddline(Tank.program.length - 1)
        $({deg: (270)}).animate({deg: 180}, {
            duration: 500,
            step: function(now) {
                $('#help3').css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            done : step1
        })
    }
    var step1 = function() {
        $('.bleft')
            .animate(bminus, step2)
    }
    var step2 = function() {
        console.log('step2')
        $('.bright')
            .animate(bplus, step3)
    }
    var step3 = function() {
        Tank.program.push('right')
        Game.controllsaddline(Tank.program.length - 1)
        $({deg: (180)}).animate({deg: 270}, {
            duration: 500,
            step: function(now) {
                $('#help3').css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            done : step4
        })
    }
    var step4 = function() {
        $('.bright')
            .animate(bminus, step5)
    }
    var step5 = function() {
        $('.bmove')
            .animate(bplus, step6)
    }
    var step6 = function() {
        Tank.program.push('move')
        Game.controllsaddline(Tank.program.length - 1)
        $('#help3').animate({
            top : '-=' + scale(250) + 'px'
        }, step7)
    }
    var step7 = function() {
        $('#help3')
            .delay(500)
            .animate({
                top : '+=' + scale(350) + 'px'
            }, 100, step8)
    }
    var step8 = function() {
        $('.bmove')
            .animate(bminus, step9)
    }
    var step9 = function() {
        $('.bfire')
            .animate(bplus, step10)
    }
    var step10 = function() {
        Tank.program.push('fire')
        Game.controllsaddline(Tank.program.length - 1)
        var el = $('<div>').attr({id : 'helpbullet'}).css({
            position : 'absolute',
            backgroundImage : 'url(bullet.png)',
            backgroundSize : '100% 100%',
            width  : scale(50) + 'px',
            height : scale(20) + 'px',
            top    : scale().height / 2 - scale(100) + 'px',
            left   : scale().width / 2 - scale(25) + 'px',
            transform : 'rotate(270deg)',
            zIndex : 2
        }).animate({
                top : scale(-200) + 'px'
            }, 1000, step11)
        $('body').append(el)
    }
    var step11 = function() {
        $('.bfire')
            .animate(bminus, step12)
    }
    var step12 = function() {
        var top = $('.remline').eq(1).parent().offset().top
        $('.remline').eq(1).css({
            position : 'absolute',
            right : '0px',
            top : top + 'px'})
            .animate({
                top : '-=5px',
                width : '+=10px',
                height : '+=10px'
            })
            .animate({
                top : '+=5px',
                width : '-=10px',
                height : '-=10px'
            }, step13)
    }
    var step13 = function() {
        Game.remline(1)
        var bplus = {
                bottom : '-=10px',
                right   : '-=10px',
                width  : '+=20px',
                height : '+=20px'
            },
            bminus = {
                bottom : '+=10px',
                right : '+=10px',
                width :'-=20px',
                height :'-=20px'
            }
        $('.run')
            .animate(bplus)
            .delay(300)
            .animate(bminus, stepX)
    }
    var stepX = function() {
        Tank.program = []
        $('.progline').remove()
        $('#help3').remove()
        $('#helpbullet').remove()
    }
    $('body').append(el)
}