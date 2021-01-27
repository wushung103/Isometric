// helpers

function getWorldTransformMatrix() {
	    const world = new Matrix();
        world.a = canvas.app.stage.worldTransform.a;
        world.b = canvas.app.stage.worldTransform.b;
        world.c = canvas.app.stage.worldTransform.c;
        world.d = canvas.app.stage.worldTransform.d;
        world.e = canvas.app.stage.worldTransform.tx;
        world.f = canvas.app.stage.worldTransform.ty;
        return world
}

function getWorldTransformPIXIMatrix() {
	    const world = getWorldTransformMatrix()

        m = new PIXI.Matrix()
	    m.a = world.inverse().a
	    m.b = world.inverse().b
	    m.c = world.inverse().c
	    m.d = world.inverse().d
	    m.tx = world.inverse().e
	    m.ty = world.inverse().f
        return m

}



Hooks.on("dragDropPositioning", (positioning) => {
    let event = positioning.event;
    let data = positioning.data;
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        const [x, y] = [event.clientX, event.clientY];
		world = getWorldTransformMatrix()
        data.x = (world.inverse().applyToPoint(x, y).x);
        data.y = (world.inverse().applyToPoint(x, y).y);
    }
});


Hooks.on("transformPosToIso", (data) => {
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        const {x, y} = data;
		var world = getWorldTransformMatrix()
        data.x = (world.inverse().applyToPoint(x, y).x);
        data.y = (world.inverse().applyToPoint(x, y).y);
    }
});


function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};