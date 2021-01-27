//behinder



class ColorOverlayFilter extends PIXI.Filter {

    constructor(color = 0x000000) {
      var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment = "varying vec2 vTextureCoord; \nuniform sampler2D uSampler; \nuniform vec3 color; \nvoid main(void) {\nvec4 currentColor = texture2D(uSampler, vTextureCoord); \nvec3 colorOverlay = color * currentColor.a;\nif(currentColor.a>0.5){\n colorOverlay = color ; \n \n\ngl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); \n}} \n";
// var fragment =  "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorOverlay = color * currentColor.a;\n    gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);\n}\n"
  // "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    if(currentColor.a){vec3 colorOverlay = color * 1.0}else{vec3 colorOverlay = color * currentColor.a}\n    gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);\n}\n";

        super(vertex, fragment);
        this.uniforms.color = new Float32Array(3);
        this.color = color;
    }

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>}
     * @default 0x000000
     */
    set color(value) {
        let arr = this.uniforms.color;
        if (typeof value === 'number') {
            PIXI.utils.hex2rgb(value, arr);
            this._color = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._color = PIXI.utils.rgb2hex(arr);
        }
    }
    get color() {
        return this._color;
    }
}


   class GlowFilter extends PIXI.Filter {

    constructor(options) {
        let {
            distance,
            outerStrength,
            innerStrength,
            color,
            knockout,
            quality } = Object.assign({}, GlowFilter.defaults, options);

        distance = Math.round(distance);
var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float outerStrength;\nuniform float innerStrength;\n\nuniform vec4 glowColor;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform bool knockout;\n\nconst float PI = 3.14159265358979323846264;\n\nconst float DIST = __DIST__;\nconst float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);\nconst float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);\n\nconst float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\n    float totalAlpha = 0.0;\n\n    vec2 direction;\n    vec2 displaced;\n    vec4 curColor;\n\n    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {\n       direction = vec2(cos(angle), sin(angle)) * px;\n\n       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {\n           displaced = clamp(vTextureCoord + direction * \n                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);\n\n           curColor = texture2D(uSampler, displaced);\n\n           totalAlpha += (DIST - curDistance) * curColor.a;\n       }\n    }\n    \n    curColor = texture2D(uSampler, vTextureCoord);\n\n    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);\n\n    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;\n    float innerGlowStrength = min(1.0, innerGlowAlpha);\n    \n    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);\n\n    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);\n    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);\n\n    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;\n    \n    if (knockout) {\n      float resultAlpha = outerGlowAlpha + innerGlowAlpha;\n      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);\n    }\n    else {\n      gl_FragColor = innerColor + outerGlowColor;\n    }\n}\n";

        super(vertex, fragment
            .replace(/__ANGLE_STEP_SIZE__/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/__DIST__/gi, distance.toFixed(0) + '.0'));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);

        Object.assign(this, {
            color,
            outerStrength,
            innerStrength,
            padding: distance,
            knockout,
        });
    }

    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.glowColor);
    }
    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
    }

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    get outerStrength() {
        return this.uniforms.outerStrength;
    }
    set outerStrength(value) {
        this.uniforms.outerStrength = value;
    }

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    get innerStrength() {
        return this.uniforms.innerStrength;
    }
    set innerStrength(value) {
        this.uniforms.innerStrength = value;
    }

    /**
     * Only draw the glow, not the texture itself
     * @member {boolean}
     * @default false
     */
    get knockout() {
        return this.uniforms.knockout;
    }
    set knockout(value) {
        this.uniforms.knockout = value;
    }
}

GlowFilter.defaults = {
    distance: 10,
    outerStrength: 4,
    innerStrength: 0,
    color: 0xffffff,
    quality: 0.1,
    knockout: false,
};


function clone_tile(tile){
      let img_tile = tile.children[1]
      let sprite = new PIXI.Sprite.fromImage(img_tile.img.texture.baseTexture.resource.url)
      // var sprite = new PIXI.Sprite(PIXI.Texture.from(img_tile.img.texture.baseTexture.resource.url))
      sprite.tint = 0xffffff
      sprite.alpha = 1
      sprite.isSprite=true
      sprite.width = img_tile.img.width
      sprite.height = img_tile.img.height

      sprite.position = tile.position
      sprite.position.x += img_tile.img.x
      sprite.position.y += img_tile.img.y
      sprite.anchor = img_tile.img.anchor

      sprite.angle = img_tile.img.angle
      return sprite
}

function clone_icon(icon){


}


var masks_container = new PIXI.Container()
let all_tiles_for =  canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '').reduce((a, x) => ([
            ...a,
             x.data._id
        ]), [])

        for (tile of all_tiles_for) {
            // let tile_object = canvas.tiles.get(tile)
              let sprite = clone_tile(canvas.tiles.get(tile))
              masks_container.addChild(sprite)
            }



let tex = canvas.app.renderer.generateTexture(masks_container); // container with all your sprites as children
 let combinedSprite = new PIXI.Sprite(tex);

// canvas.tiles.addChild(combinedSprite)




var mask_filter = new PIXI.SpriteMaskFilter(combinedSprite)



      var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n"

var fragment ="varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n"




mask_filter.program= PIXI.Program.from(vertex,fragment)




// token.icon.mask.isSprite=true  ??????????????

var token = canvas.tokens.get("E4KpPu9LIs2fPKrm")

// var sprite = canvas.tiles.children[0].children[0].children[1]
// var sprite = canvas.tiles.get("Bi3XKcTmqqPzDTUU").children[1]
var sprite = clone_tile(canvas.tiles.get("9dseRH1mc0kq0CuA"))
canvas.tiles.addChild(sprite)
// token.icon.mask = sprite
// token.icon.tint=0x0 //ff0000
// token.icon.tint=0xff0000


// var token2= canvas.tokens.get("ts6xzNEgGaUcBlca")
// sprite2 = clone_tile(canvas.tiles.get("Bi3XKcTmqqPzDTUU"))
// canvas.tiles.addChild(sprite2)
// token2.icon.mask = sprite2
// token2.icon.tint=0x0
//  // this is very good

// filter = new PIXI.filters.ColorMatrixFilter();
// filter.matrix = [
//     10, 10, 10, 10,
//     10, 40, 10, 10,
//     10, 10, 10, 10,
//     -1, -1, -1, 1
// ];
//  token.icon.filters= [filter];


var maskFilter= new PIXI.SpriteMaskFilter(sprite);
// token2.icon.filters = [maskFilter]

var filter = new GlowFilter();
filter.color=0xff0000

var ovf = new ColorOverlayFilter();
ovf.color = 0x000000
// token.icon.filters= [filter]; //[ovf, filter];

// token.icon.filters = [maskFilter,ovf,filter]
// token.icon.filters = [maskFilter]


// // var filter2 = new GlowFilter();
// // filter2.color=0x00ff00
// // token2.icon.filters= [filter2];


// filter.innerStrength=4
// filter.outerStrength=1


      var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n"

var fragment ="varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n"


maskFilter.program= PIXI.Program.from(vertex,fragment)

// token.icon.filters = [maskFilter,ovf,filter]




      var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n"

var fragment ="varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= 1.0-(alphaMul * masky.a * alpha * clip);\n\n    gl_FragColor = original;\n}\n"



var maskFilter2= new PIXI.SpriteMaskFilter(sprite);
maskFilter2.program= PIXI.Program.from(vertex,fragment)



var token2 = canvas.tokens.get("fGnvjscQi6ll8HC0")
token2.icon.filters = [maskFilter2]

var filter2 = new PIXI.filters.AlphaFilter();
filter2.color=0xff0000

// token.icon.filters = [maskFilter,filter2,filter]

filter2.alpha=0.3
token.icon.filters = [maskFilter,ovf,filter2]