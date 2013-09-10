
var requestAnimFrame = (window.requestAnimationFrame ||
                        window.webkitAnimationFrame ||
                        function(cb) {
                            setTimeout(cb, 1000 / 60);
                        });

$(function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var w = $('body').width();
    var h = $('.banner')[0].getBoundingClientRect().height;
    canvas.width = w;
    canvas.height = h;

    $('.banner').prepend(canvas);

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var last;
    var tris;
    var MAX_SUBDIVIDE = 7;
    var EPSILON = 5;

    // generate a random color scheme for the page
    var COLOR_INDEX = Math.random() * 2 | 0;

    function vadd(v1, v2) {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    }

    function vsub(v1, v2) {
        return [v1[0] - v2[0], v1[1] - v2[1]];
    }

    function vcopy(v) {
        return [v[0], v[1]];
    }

    function vnormalize(v) {
        var l = v[0] * v[0] + v[1] * v[1];
        if(l > 0) {
            l = 1 / Math.sqrt(l);
            return [v[0] * l, v[1] * l];
        }
        return [0, 0];
    }

    function vlength(v) {
        var l = v[0] * v[0] + v[1] * v[1];
        return Math.sqrt(l);
    }

    function vequal(v1, v2) {
        return Math.abs(v1[0] - v2[0]) < EPSILON &&
            Math.abs(v1[1] - v2[1]) < EPSILON;
    }

    function findPoint(point, cb) {
        var res;

        for(var i=0; i<tris.length; i++) {
            tris[i].findPoint(point, cb);
        }
    }

    function Spark(pos, dir, len, color) {
        this.pos = pos;
        this.origPos = vcopy(pos);
        this.dir = dir;
        this.len = len;
        this.finished = false;

        this.color = [color[0], color[1] + 60, color[2]];
    }

    Spark.prototype.update = function(dt) {
        if(!this.finished) {
            this.pos[0] += this.dir[0] * dt * 500;
            this.pos[1] += this.dir[1] * dt * 500;

            findPoint(this.pos, function(collision) {
                collision.tri.startFire(collision.orient);
            });

            if(vlength(vsub(this.pos, this.origPos)) >= this.len + this.len / 3) {
                this.finished = true;
            }
        }
    };

    Spark.prototype.render = function() {
        if(!this.finished) {
            ctx.strokeStyle = 'rgb(' + this.color.join(',') + ')';
            ctx.beginPath();
            ctx.moveTo(this.pos[0], this.pos[1]);
            ctx.lineTo(this.pos[0] - this.dir[0] * (this.len / 3),
                       this.pos[1] - this.dir[1] * (this.len / 3));
            ctx.stroke();
        }
    };

    function Triangle(v1, v2, v3, color, level) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.point = v2;
        this.color = color || [30, (Math.random() * 60 + 20) | 0, 20];
        this.children = [];
        this.level = level || 0;
        this.sparks = [];
    }

    Triangle.prototype.subdivide = function() {
        var level = this.level;

        if(Math.random() < level / MAX_SUBDIVIDE || level > MAX_SUBDIVIDE) {
            return;
        }

        var v1 = this.v1;
        var v2 = this.v2;
        var v3 = this.v3;
        var ac = [v3[0] - v1[0], v3[1] - v1[1]];
        var mid = [v1[0] + ac[0] / 2.0,
                   v1[1] + ac[1] / 2.0];

        var color = [this.color[0],
                     this.color[1] + ((Math.random() - .5) * 20 | 0),
                     this.color[2]];

        this.children = [new Triangle(v1, mid, v2, color, level + 1),
                         new Triangle(v3, mid, v2, color, level + 1)];

        this.children[0].subdivide();
        this.children[1].subdivide();
        return this;
    };

    Triangle.prototype.render = function() {
        var v1 = this.v1;
        var v2 = this.v2;
        var v3 = this.v3;
        var color = this.color;

        if(!this.children.length) {
            ctx.beginPath();
            ctx.moveTo(v1[0], v1[1]);
            ctx.lineTo(v2[0], v2[1]);
            ctx.lineTo(v3[0], v3[1]);
            ctx.fillStyle = ctx.strokeStyle = 'rgb(' + color.join(',') + ')';
            ctx.fill();
            ctx.stroke();
        }

        this.children.forEach(function(child) {
            child.render();
        });
    };

    Triangle.prototype.renderSparks = function() {
        for(var i=0, l=this.sparks.length; i<l; i++) {
            this.sparks[i].render();
        }

        for(var i=0, l=this.children.length; i<l; i++) {
            this.children[i].renderSparks();
        }
    };

    Triangle.prototype.startFire = function(atPoint) {
        if(this.sparks.length) {
            return;
        }

        var v1, v2, v3;

        if(atPoint == 'v1') {
            v1 = this.v2;
            v2 = this.v1;
            v3 = this.v3;
        }
        else if(atPoint == 'v3') {
            v1 = this.v1;
            v2 = this.v3;
            v3 = this.v2;
        }
        else {
            v1 = this.v1;
            v2 = this.v2;
            v3 = this.v3;
        }

        var bc = vsub(v3, v2);
        var ab = vsub(v1, v2);
        this.sparks.push(new Spark(vcopy(v2), vnormalize(bc), vlength(bc),
                                   this.color));
        this.sparks.push(new Spark(vcopy(v2), vnormalize(ab), vlength(ab),
                                   this.color));
    };

    Triangle.prototype.findPoint = function(point, cb) {
        if(this.children.length) {
            var res;
            for(var i=0, l=this.children.length; i<l; i++) {
                this.children[i].findPoint(point, cb);
            }    
        }
        else {
            if(vequal(point, this.v1)) {
                cb({
                    tri: this,
                    orient: 'v1'
                });
            }
            else if(vequal(point, this.v2)) {
                return cb({
                    tri: this,
                    orient: 'v2'
                });
            }
            else if(vequal(point, this.v3)) {
                return cb({
                    tri: this,
                    orient: 'v3'
                });
            }
        }
    };

    Triangle.prototype.update = function(dt) {
        // If we have children, need to check to see if all of my
        // sparks are out, and set a timer to quench them. We set a
        // timer because otherwise they catch fire immediately because
        // neighbors re-spark them.
        var sparks = this.sparks;
        var allDone = !!sparks.length;
        var numSparks = sparks.length;

        for(var i=0, l=sparks.length; i<l; i++) {
            var spark = sparks[i];
            spark.update(dt);
            allDone = allDone && spark.finished;
        }

        if(allDone && !this.quenchTimer) {
            this.quenchTimer = setTimeout(function() {
                this.sparks = [];
            }.bind(this), 1000);
        }

        for(var i=0, l=this.children.length; i<l; i++) {
            numSparks += this.children[i].update(dt);
        }

        return numSparks;
    };

    Triangle.prototype.getRandomLeaf = function() {
        if(this.children.length) {
            return this.children[Math.random() * this.children.length | 0].getRandomLeaf();
        }
        else {
            return this;
        }
    };

    function init() {
        tris = [];

        for(var x=0; x<w; x += h) {
            if(Math.random() < .5) {
                tris.push(
                    (new Triangle([x, 0], [x + h, 0], [x + h, h])).subdivide(),
                    (new Triangle([x, 0], [x, h], [x + h, h])).subdivide()
                );
            }
            else {
                tris.push(
                    (new Triangle([x, h], [x, 0], [x + h, 0])).subdivide(),
                    (new Triangle([x, h], [x + h, h], [x + h, 0])).subdivide()
                );
            }
        }

        tris[Math.random() * tris.length | 0].getRandomLeaf().startFire('v2');

        window.onscroll = function() {
            var y = window.pageYOffset || document.body.scrollTop;
            canvas.style.top = y / 2 + 'px';
        };
    }

    function render() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var numSparks = 0;
        
        tris.forEach(function(tri) {
            numSparks += tri.update(.016);
            tri.render();
        });

        tris.forEach(function(tri) {
            tri.renderSparks();
        });

        if(numSparks) {
            requestAnimFrame(render);
        }
    }

    last = Date.now();
    init();
    render();
});

// UI

$(function() {
    var modal = $('.download-modal');

    $('a.download').click(function() {
        // We need to force the modal to be just above the page
        // because it isn't that way on initial page load, or if the
        // width changes
        var h = modal[0].getBoundingClientRect().height;
        // modal.css({ top: '-' + h + 'px',
        //             transition: 'none',
        //             zIndex: 2000,
        //             opacity: 1 });

        // // Force a reflow
        // modal[0].getBoundingClientRect();

        // // Make it appear
        // modal.css({ top: 0,
        //             transition: 'top .5s' });
        modal.css({ transform: 'rotate(0)' });
    });

    $('.download-modal .close').click(function() {
        modal.css({ 
            top: '-' + modal[0].getBoundingClientRect().height + 'px'
        });
    });
});
