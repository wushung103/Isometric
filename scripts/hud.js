//hud

Hooks.on('canvasInit', function() {

    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        BasePlaceableHUD.prototype._render = (function() {
            var cached_function = BasePlaceableHUD.prototype._render;

            return async function() {
                // your code

                var result = await cached_function.apply(this, arguments); // use .apply() to call it

                if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
                ratio = canvas.app.stage.scale.x
                var glob = this.object.toGlobal(new PIXI.Point(0))

                var point = new PIXI.Point(canvas.app.stage.localTransform.tx, canvas.app.stage.localTransform.ty)
                var x = glob.x - point.x + (this.object.width / (4 / ratio)) //+ 25// - (this.object.width) //todo
                var y = glob.y - point.y - (this.object.height / (4 / ratio)); // - 25// - (this.object.height) //todo
                this.element.css('left', (x / ratio) + 'px')
                this.element.css('top', (y / ratio) + 'px')
            }
                return result;
            };
        })();
    }
});