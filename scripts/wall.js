//walls

Hooks.on('updateWall', async (_, wall) => {


    if (game.user.isGM) {
        let tile = canvas.tiles.get(door_hooks[wall._id])
        if (tile != null) {
            await tile.update({
                'hidden': wall.ds == 1
            })
        }
    }
    // debugger;
})


// updateTile


function wall_position(coo) {
    var tx = canvas.app.stage.localTransform.tx
    var ty = canvas.app.stage.localTransform.ty
    var [x1, y1, x2, y2] = coo
    var ret = [0, 0, 0, 0]
    aa = new PIXI.Sprite
    canvas.stage.addChild(aa)
    aa.x = x1
    aa.y = y1
    var {
        x = x, y = y
    } = aa.toGlobal(new PIXI.Point()) // wall
    ret[0] = x - tx
    ret[1] = y - ty

    aa.x = x2
    aa.y = y2
    var {
        x = x, y = y
    } = aa.toGlobal(new PIXI.Point()) // wall
    ret[2] = x - tx
    ret[3] = y - ty

    canvas.stage.removeChild(aa)

    return ret;
}




