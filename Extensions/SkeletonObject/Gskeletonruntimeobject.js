
/**
GDevelop - Skeleton Object Extension
Copyright (c) 2017-2018 Franco Maciel (francomaciel10@gmail.com)
This project is released under the MIT License.
*/


/**
 * The SkeletonRuntimeObject imports and displays skeletal animations files.
 *
 * @namespace gdjs
 * @class SkeletonRuntimeObject
 * @extends RuntimeObject
 */
gdjs.SkeletonRuntimeObject = function(runtimeScene, objectData){
    gdjs.RuntimeObject.call(this, runtimeScene, objectData);

    this.rootArmature = new gdjs.sk.Armature(this);
    this.animationPlaying = true;
    this.animationSmooth = true;
    this.timeScale = 1.0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.renderer = new gdjs.SkeletonRuntimeObjectRenderer();
    this.hitboxSlot = null;
    
    var skeletalData = this.renderer.getData(objectData.skeletalDataFilename);
    // Main loaders
    if(objectData.apiName === "DragonBones"){
        this.loadDragonBones(runtimeScene, skeletalData, objectData);
    }
};
gdjs.SkeletonRuntimeObject.prototype = Object.create(gdjs.RuntimeObject.prototype);
gdjs.SkeletonRuntimeObject.thisIsARuntimeObjectConstructor = "SkeletonObject::Skeleton";

gdjs.SkeletonRuntimeObject.prototype.extraInitializationFromInitialInstance = function(initialInstanceData) {
    if(initialInstanceData.customSize){
        this.setWidth(initialInstanceData.width);
        this.setHeight(initialInstanceData.height);
    }
};

gdjs.SkeletonRuntimeObject.prototype.loadDragonBones = function(runtimeScene, skeletalData, objectData){
    // Load sub-textures
    this.renderer.loadDragonBones(runtimeScene, objectData);
    // Load the root armature with the given name
    for(var i=0; i<skeletalData.armature.length; i++){
        if(skeletalData.armature[i].name === objectData.rootArmatureName){
            this.rootArmature.loadDragonBones(skeletalData, i, this.renderer.textures, objectData.debugPolygons);
        }
    }
    // If the name was not found, load the first armature
    if(!this.rootArmature.loaded && skeletalData.armature.length > 0){
        this.rootArmature.loadDragonBones(skeletalData, 0, this.renderer.textures, objectData.debugPolygons);
    }
    this.rootArmature.renderer.putInScene(this, runtimeScene);
    this.customHitboxes = [];
};

// RuntimeObject overwrites
gdjs.SkeletonRuntimeObject.prototype.setX = function(x){
    this.x = x;
    this.rootArmature.setX(x);
};

gdjs.SkeletonRuntimeObject.prototype.setY = function(y){
    this.y = y;
    this.rootArmature.setY(y);
};

gdjs.SkeletonRuntimeObject.prototype.setAngle = function(angle){
    this.angle = angle;
    this.rootArmature.setRot(angle);
};

gdjs.SkeletonRuntimeObject.prototype.getRendererObject = function(){
    return this.rootArmature.getRendererObject();
};

gdjs.SkeletonRuntimeObject.prototype.getHitBoxes = function(){
    if(this.hitboxSlot){
        return this.hitboxSlot.getPolygons();
    }
    return [this.rootArmature.getAABB()];
};

gdjs.SkeletonRuntimeObject.prototype.stepBehaviorsPreEvents = function(runtimeScene){
    var delta = this.getElapsedTime(runtimeScene) / 1000.0;
    if(this.animationPlaying){
        this.rootArmature.updateAnimation(delta*this.timeScale);
    }

    gdjs.RuntimeObject.prototype.stepBehaviorsPreEvents.call(this, runtimeScene);
};

gdjs.SkeletonRuntimeObject.prototype.update = function(runtimeScene){
    this.rootArmature.update();
};

// Object instructions
gdjs.SkeletonRuntimeObject.prototype.getScaleX = function(){
    return this.scaleX;
};

gdjs.SkeletonRuntimeObject.prototype.setScaleX = function(scaleX){
    this.scaleX = scaleX;
    this.rootArmature.setSx(scaleX);
};

gdjs.SkeletonRuntimeObject.prototype.getScaleY = function(){
    return this.scaleY;
};

gdjs.SkeletonRuntimeObject.prototype.setScaleY = function(scaleY){
    this.scaleY = scaleY;
    this.rootArmature.setSy(scaleY);
};

gdjs.SkeletonRuntimeObject.prototype.getWidth = function(){
    return this.rootArmature.getDefaultWidth() * Math.abs(this.scaleX);
};

gdjs.SkeletonRuntimeObject.prototype.setWidth = function(width){
    if(width < 0) width = 0;
    this.setScaleX(width / this.rootArmature.getDefaultWidth());
};

gdjs.SkeletonRuntimeObject.prototype.getHeight = function(){
    return this.rootArmature.getDefaultHeight() * Math.abs(this.scaleY);
};

gdjs.SkeletonRuntimeObject.prototype.setHeight = function(height){
    if(height < 0) height = 0;
    this.setScaleY(height / this.rootArmature.getDefaultHeight());
};

gdjs.SkeletonRuntimeObject.prototype.setDefaultHitbox = function(slotPath){
    if(slotPath === ""){
        this.hitboxSlot = null;
        return;
    }
    var slot = this.getSlot(slotPath);
    if(slot){
        this.hitboxSlot = slot;
    }
};

// Animation instructions
gdjs.SkeletonRuntimeObject.prototype.isAnimationPaused = function(){
    return !this.animationPlaying;
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationPaused = function(paused){
    this.animationPlaying = !paused;
};

gdjs.SkeletonRuntimeObject.prototype.isAnimationFinished = function(){
    return this.rootArmature.isAnimationFinished();
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationTime = function(){
    return this.rootArmature.getAnimationTime();
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationTime = function(time){
    this.rootArmature.setAnimationTime(time);
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationTimeLength = function(){
    return this.rootArmature.getAnimationTimeLength();
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationFrame = function(){
    return this.rootArmature.getAnimationFrame();
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationFrame = function(frame){
    this.rootArmature.setAnimationFrame(frame);
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationFrameLength = function(){
    return this.rootArmature.getAnimationFrameLength();
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationIndex = function(){
    return this.rootArmature.getAnimationIndex();
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationIndex = function(newAnimation, blendTime=0, loops=-1){
    this.rootArmature.setAnimationIndex(newAnimation, blendTime, loops);
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationName = function(){
    return this.rootArmature.getAnimationName();
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationName = function(newAnimation, blendTime=0, loops=-1){
    this.rootArmature.setAnimationName(newAnimation, blendTime, loops);
};

gdjs.SkeletonRuntimeObject.prototype.isAnimationSmooth = function(){
    return this.animationSmooth;
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationSmooth = function(smooth){
    this.animationSmooth = smooth;
};

gdjs.SkeletonRuntimeObject.prototype.getAnimationTimeScale = function(){
    return this.timeScale;
};

gdjs.SkeletonRuntimeObject.prototype.setAnimationTimeScale = function(timeScale){
    if(timeScale < 0) timeScale = 0; // Support negative timeScale (backward animation) ?
    this.timeScale = timeScale;
};

gdjs.SkeletonRuntimeObject.prototype.resetAnimation = function(){
    this.rootArmature.resetAnimation();
};

// Bone instructions
gdjs.SkeletonRuntimeObject.prototype.getBoneX = function(bonePath){
    var bone = this.getBone(bonePath);
    return bone ? bone.getGlobalX() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setBoneX = function(bonePath, x){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.setGlobalX(x);
        bone.update();
    }
};

gdjs.SkeletonRuntimeObject.prototype.getBoneY = function(bonePath){
    var bone = this.getBone(bonePath);
    return bone ? bone.getGlobalY() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setBoneY = function(bonePath, y){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.setGlobalY(y);
        bone.update();
    }
};

gdjs.SkeletonRuntimeObject.prototype.getBoneAngle = function(bonePath){
    var bone = this.getBone(bonePath);
    return bone ? bone.getGlobalRot() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setBoneAngle = function(bonePath, angle){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.setGlobalRot(angle);
        bone.update();
    }
};

gdjs.SkeletonRuntimeObject.prototype.getBoneScaleX = function(bonePath){
    var bone = this.getBone(bonePath);
    return bone ? bone.getSx() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setBoneScaleX = function(bonePath, scaleX){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.setSx(scaleX);
        bone.update();
    }
};

gdjs.SkeletonRuntimeObject.prototype.getBoneScaleY = function(bonePath){
    var bone = this.getBone(bonePath);
    return bone ? bone.getSy() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setBoneScaleY = function(bonePath, scaleY){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.setSy(scaleY);
        bone.update();
    }
};

gdjs.SkeletonRuntimeObject.prototype.resetBone = function(bonePath){
    var bone = this.getBone(bonePath);
    if(bone){
        bone.resetState();
    }
};

// Slot instructions
gdjs.SkeletonRuntimeObject.prototype.setSlotColor = function(slotPath, color){
    var slot = this.getSlot(slotPath);
    if(slot){
        var rgb = color.split(";");
        if(rgb.length < 3) return;
        slot.setColor(...rgb);
    }
};

gdjs.SkeletonRuntimeObject.prototype.isSlotVisible = function(slotPath){
    var slot = this.getSlot(slotPath);
    return slot ? slot.getVisible() : false;
};

gdjs.SkeletonRuntimeObject.prototype.setSlotVisible = function(slotPath, visible){
    var slot = this.getSlot(slotPath);
    if(slot){
        slot.setVisible(visible);
    }
};

gdjs.SkeletonRuntimeObject.prototype.getSlotZOrder = function(slotPath){
    var slot = this.getSlot(slotPath);
    return slot ? slot.getZ() : 0;
};

gdjs.SkeletonRuntimeObject.prototype.setSlotZOrder = function(slotPath, z){
    var slot = this.getSlot(slotPath);
    if(slot){
        slot.setZ(z);
    }
};

gdjs.SkeletonRuntimeObject.prototype.isPointInsideSlot = function(slotPath, x, y){
    var hitBoxes = this.getPolygons(slotPath);
    for(var i = 0; i < this.hitBoxes.length; ++i) {
       if ( gdjs.Polygon.isPointInside(hitBoxes[i], x, y) )
            return true;
    }

    return false;
};

// Extension instructions
gdjs.SkeletonRuntimeObject.prototype.raycastSlot = function(slotPath, x, y, angle, dist, closest){
    var objW = this.getWidth();
    var objH = this.getHeight();
    var diffX = this.getDrawableX()+this.getCenterX() - x;
    var diffY = this.getDrawableY()+this.getCenterY() - y;
    var boundingRadius = Math.sqrt(objW*objW + objH*objH)/2.0;

    var result = gdjs.Polygon.raycastTest._statics.result;
    result.collision = false;

    if ( Math.sqrt(diffX*diffX + diffY*diffY) > boundingRadius + dist )
        return result;
    
    var endX = x + dist*Math.cos(angle*Math.PI/180.0);
    var endY = y + dist*Math.sin(angle*Math.PI/180.0);
    var testSqDist = closest ? dist*dist : 0;

    var hitBoxes = this.getPolygons(slotPath);
    for (var i=0; i<hitBoxes.length; i++) {
        var res =  gdjs.Polygon.raycastTest(hitBoxes[i], x, y, endX, endY);
        if ( res.collision ) {
            if ( closest && (res.closeSqDist < testSqDist) ) {
                testSqDist = res.closeSqDist;
                result = res;
            }
            else if ( !closest && (res.farSqDist > testSqDist) && (res.farSqDist <= dist*dist) ) {
                testSqDist = res.farSqDist;
                result = res;
            }
        }
    }
    
    return result;
};

// Warning!, assuming that gdjs.evtTools.object.twoListsTest respect object parameters order
gdjs.SkeletonRuntimeObject.slotObjectCollisionTest = function(skl, obj, slotPath){
    //First check if bounding circle are too far.
    var o1w = skl.getWidth();
    var o1h = skl.getHeight();
    var o2w = obj.getWidth();
    var o2h = obj.getHeight();

    var x = skl.getDrawableX()+skl.getCenterX()-(obj.getDrawableX()+obj.getCenterX());
    var y = skl.getDrawableY()+skl.getCenterY()-(obj.getDrawableY()+obj.getCenterY());
    var obj1BoundingRadius = Math.sqrt(o1w*o1w+o1h*o1h)/2.0;
    var obj2BoundingRadius = Math.sqrt(o2w*o2w+o2h*o2h)/2.0;

    if ( Math.sqrt(x*x+y*y) > obj1BoundingRadius + obj2BoundingRadius )
        return false;

    //Do a real check if necessary.
    var hitBoxes1 = skl.getPolygons(slotPath);
    var hitBoxes2 = obj.getHitBoxes();
    for(var k = 0, lenBoxes1 = hitBoxes1.length;k<lenBoxes1;++k) {
        for(var l = 0, lenBoxes2 = hitBoxes2.length;l<lenBoxes2;++l) {
            if ( gdjs.Polygon.collisionTest(hitBoxes1[k], hitBoxes2[l]).collision ) {
                return true;
            }
        }
    }

    return false;
};

// Warning!, assuming that gdjs.evtTools.object.twoListsTest respect object parameters order
gdjs.SkeletonRuntimeObject.slotSlotCollisionTest = function(skl1, skl2, slotPaths){
    //First check if bounding circle are too far.
    var o1w = skl1.getWidth();
    var o1h = skl1.getHeight();
    var o2w = skl2.getWidth();
    var o2h = skl2.getHeight();

    var x = skl1.getDrawableX()+skl1.getCenterX()-(skl2.getDrawableX()+skl2.getCenterX());
    var y = skl1.getDrawableY()+skl1.getCenterY()-(skl2.getDrawableY()+skl2.getCenterY());
    var obj1BoundingRadius = Math.sqrt(o1w*o1w+o1h*o1h)/2.0;
    var obj2BoundingRadius = Math.sqrt(o2w*o2w+o2h*o2h)/2.0;

    if ( Math.sqrt(x*x+y*y) > obj1BoundingRadius + obj2BoundingRadius )
        return false;

    //Do a real check if necessary.
    var hitBoxes1 = skl1.getPolygons(slotPaths[0]);
    var hitBoxes2 = skl2.getPolygons(slotPaths[1]);
    for(var k = 0, lenBoxes1 = hitBoxes1.length;k<lenBoxes1;++k) {
        for(var l = 0, lenBoxes2 = hitBoxes2.length;l<lenBoxes2;++l) {
            if ( gdjs.Polygon.collisionTest(hitBoxes1[k], hitBoxes2[l]).collision ) {
                return true;
            }
        }
    }

    return false;
};

// Helpers
gdjs.SkeletonRuntimeObject.prototype.getSlot = function(slotPath){
    var slotArray = slotPath.split("/");
    var currentSlot = null;
    if(slotArray[0] in this.rootArmature.slotsMap){
        currentSlot = this.rootArmature.slotsMap[slotArray[0]];
        for(var i=1; i<slotArray.length; i++){
            if(currentSlot.type === gdjs.sk.SLOT_ARMATURE &&
               slotArray[i] in currentSlot.childArmature.slotsMap){
                currentSlot = currentSlot.childArmature.slotsMap[slotArray[i]];
            }
            else{
                return null
            }
        }
    }
    return currentSlot;
};

gdjs.SkeletonRuntimeObject.prototype.getBone = function(bonePath){
    var slotArray = bonePath.split("/");
    var boneName = slotArray.pop();

    if(slotArray.length === 0 && boneName in this.rootArmature.bonesMap){
        return this.rootArmature.bonesMap[boneName];
    }

    var slot = this.getSlot(slotArray.join("/"));
    if(slot && slot.type === gdjs.sk.SLOT_ARMATURE && boneName in slot.childArmature.bonesMap){
        return slot.childArmature.bonesMap[boneName];
    }
    
    return null;
};

gdjs.SkeletonRuntimeObject.prototype.getPolygons = function(slotPath){
    if(slotPath === "" && this.rootArmature !== undefined){
        return this.rootArmature.getHitBoxes();
    }

    var slot = this.getSlot(slotPath);
    if(slot){
        return slot.getPolygons();
    }

    return null;
};
