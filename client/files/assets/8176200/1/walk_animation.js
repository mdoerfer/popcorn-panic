var WalkAnimation = pc.createScript('walkAnimation');

WalkAnimation.attributes.add("offsetCurve", {type: "curve", title: "Offset Curve", curves: [ 'x', 'y', 'z' ]});
WalkAnimation.attributes.add("duration", {type: "number", default: 3, title: "Duration (secs)"});

// initialize code called once per entity
WalkAnimation.prototype.initialize = function() {
    this.startPosition = this.entity.getPosition().clone();
    
    this.position = new pc.Vec3();
    
    this.time = 0;
};

// update code called every frame
WalkAnimation.prototype.update = function(dt) {
      this.time += dt;
    
    if (this.time > this.duration) {
        this.time -= this.duration;
    }
    
    var percent = this.time / this.duration;

    var curveValue = this.offsetCurve.value(percent);
    
    this.position.copy(this.startPosition);
    this.position.z += curveValue[0];
    this.position.x += curveValue[1];
    this.position.y += curveValue[2];
    
    this.entity.setPosition(this.position);
};
