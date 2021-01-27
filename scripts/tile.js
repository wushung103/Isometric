//tile
Hooks.on('preCreateTile', (a, b, c, d, e) => {
    // debugger;

    if(((!b.flags) || (b.flags["grape_juice-isometrics"] === undefined)) && !('hidden' in b))
{
    // console.error('in if')
    let sprite = new PIXI.Sprite()
    sprite.width = b.width
    sprite.height = b.height

    sprite.x = b.x
    sprite.y = b.y

    canvas.tiles.addChild(sprite)


    m = getWorldTransformPIXIMatrix()

    sprite.transform.setFromMatrix(m)

    // m.a = world.a
    // m.b = world.b
    // m.c = world.c
    // m.d = world.d
    // m.tx = world.e
    // m.ty = world.f
    // b.transform.setFromMatrix(m)

    b.height *= sprite.height * canvas.stage.scale.y
    b.width *= sprite.width * canvas.stage.scale.x
    b.rotation = (sprite.rotation / (Math.PI / 180))
    // b.x = sprite.x
    // b.y = sprite.y
    canvas.tiles.removeChild(sprite)
}
else{
    delete(b.flags["grape_juice-isometrics"]) 
    // console.error('in else')

}

})


Hooks.on('hoverTile', (a, b, c, d, e) => {
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {

    Hooks.call('sightRefresh')
}
})

Hooks.on('updateTile', async (a, b, c, d, e) => {
    // debugger;

    // tile.alpha = tile.getFlag('grape_juice-isometrics', 'tile_alpha');
await                 canvas.sight.refresh()

});