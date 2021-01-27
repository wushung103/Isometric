
Hooks.on('canvasInit', function() {
// Hooks.on('init', function() {
// Hooks.on('canvasReady', function() {
    // if (true) {
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        SightLayer.computeSight = (function(origin, radius, {angle=360, density=6, rotation=0, unrestricted=false}={}) {
            return function(origin, radius, {angle=360, density=6, rotation=0, unrestricted=false}={}){

     // The maximum ray distance needs to reach all areas of the canvas
        let d = canvas.dimensions;
        let {x, y} = origin;
        const dx = Math.max(origin.x, d.width - origin.x);
        const dy = Math.max(origin.y, d.height - origin.y);
        const distance = Math.max(radius, Math.hypot(dx, dy));
        const limit = radius / distance;



        // Determine the direction of facing, the angle of vision, and the angles of boundary rays
        const limitAngle = angle.between(0, 360, false);
        const aMin = limitAngle ? normalizeRadians(toRadians(rotation + 90 - (angle / 2))) : -Math.PI;
        const aMax = limitAngle ? aMin + toRadians(angle) : Math.PI;

        // For high wall count maps, restrict to a subset of endpoints using quadtree bounds
        // Target wall endpoints within the vision radius or within 10 grid units, whichever is larger
        let endpoints = unrestricted ? [] : canvas.walls.endpoints;
        let bounds = null;
        if ( endpoints.length > SightLayer.EXACT_VISION_THRESHOLD ) {
          const rb2 = Math.max(d.size * 10, radius);
          bounds = new NormalizedRectangle(origin.x - rb2, origin.y - rb2, (2 * rb2), (2 * rb2));
          let walls = canvas.walls.quadtree.getObjects(bounds);
          endpoints = WallsLayer.getUniqueEndpoints(walls, {bounds, blockMovement: false, blockSenses: true});
        }

        // Cast sight rays at target endpoints using the full unrestricted line-of-sight distance
        const rays = this._castRays(x, y, distance, {density, endpoints, limitAngle, aMin, aMax});

        // Partition rays by node
        const quadMap = new Map();
        for ( let r of rays ) {
          r._cs = null;
          r._c = null;
          const nodes = canvas.walls.quadtree.getLeafNodes(r.bounds);
          for ( let n of nodes ) {
            let s = quadMap.get(n);
            if ( !s ) {
              s = new Set();
              quadMap.set(n, s);
            }
            s.add(r);
          }
        }

        // Start with the node that contains the sight origin
        let nodes = new Set(canvas.walls.quadtree.getLeafNodes({x: origin.x, y: origin.y, width: 0, height: 0}));
        const testedNodes = new Set();
        const nodeQueue = new Set(nodes);
        if ( unrestricted ) nodeQueue.clear();
        const rayQueue = new Set(rays);

        // Iterate until there are no nodes remaining to test
        while ( nodeQueue.size ) {
          const batch = Array.from(nodeQueue);
          for (let n of batch) {
            for (let o of n.objects) {
              const w = o.t;
              if ((w.data.door > CONST.WALL_DOOR_TYPES.NONE) && (w.data.ds === CONST.WALL_DOOR_STATES.OPEN)) continue;
              if (w.data.sense === CONST.WALL_SENSE_TYPES.NONE) continue;

              // Iterate over rays
              const rays = quadMap.get(n) || [];
              for (let r of rays) {
                if ( r._c ) continue;

                // Test collision for the ray
                if (!w.canRayIntersect(r)) continue;
                const x = WallsLayer.testWall(r, w);
                if ( this._performance ) this._performance.tests++;
                if (!x) continue;

                // Flag the collision
                r._cs = r._cs || {};
                const pt = `${Math.round(x.x)},${Math.round(x.y)}`;
                const c = r._cs[pt];
                if ( c ) {
                  c.sense = Math.min(w.data.sense, c.sense);
                  for ( let n of o.n ) c.nodes.push(n);
                }
                else {
                  x.sense = w.data.sense;
                  x.wall_id = w.data._id;
                  x.nodes = Array.from(o.n);
                  r._cs[pt] = x;
                }
              }
            }

            // Cascade outward to sibling nodes
            testedNodes.add(n);
            nodeQueue.delete(n);
            const siblings = canvas.walls.quadtree.getLeafNodes({
              x: n.bounds.x - 1,
              y: n.bounds.y - 1,
              width: n.bounds.width + 2,
              height: n.bounds.height + 2
            });
            for (let s of siblings) {
              if (!testedNodes.has(s)) nodeQueue.add(s);
            }
          }

          // After completing a tier of nodes, test each ray for completion
          for ( let r of rayQueue ) {
            if ( !r._cs ) continue;
            const c = Object.values(r._cs);
            const closest = WallsLayer.getClosestCollision(c);
            if ( closest && closest.nodes.every(n => testedNodes.has(n)) ) {
              rayQueue.delete(r);
              r._c = closest;
            }
          }
          if ( !rayQueue.size ) break;
        }

        // Construct visibility polygons
        const losPoints = [];
        const fovPoints = [];
        for ( let r of rays ) {
          r.los = r._c || { x: r.B.x, y: r.B.y, t0: 1, t1: 0};
          losPoints.push(r.los);
          r.fov = r.los.t0 <= limit ? r.los : r.project(limit);
          fovPoints.push(r.fov)
        }
        const los = new PIXI.Polygon(...losPoints);
        const fov = new PIXI.Polygon(...fovPoints);

        // Visualize vision rendering
        if ( CONFIG.debug.sightRays ) this._visualizeSight(bounds, endpoints, rays, los, fov);
        if ( CONFIG.debug.sight ) this._performance.rays = rays.length;
        // debugger;
        // Return rays and polygons
        return {rays, los, fov};
        };
        })();





        PointSource.prototype.initialize = (function(data={}) {
            return function(data={}){

    // Clean input data
    data.animation = data.animation || {type: null};
    data.angle = data.angle ?? 360;
    data.alpha = data.alpha ?? 0.5;
    data.bright = data.bright ?? 0;
    data.color = typeof data.color === "string" ? colorStringToHex(data.color) : (data.color ?? null);
    data.darknessThreshold = data.darknessThreshold ?? 0;
    data.dim = data.dim ?? 0;
    data.rotation = data.rotation ?? 0;
    data.type = data.type ?? SOURCE_TYPES.LOCAL;
    data.x = data.x ?? 0;
    data.y = data.y ?? 0;
    data.z = data.z ?? null;

    // Identify changes and assign cleaned data
    const changes = diffObject(this, data);
    mergeObject(this, data);

    // Derived data attributes
    this.colorRGB = hexToRGB(this.color);
    this.radius = Math.max(Math.abs(this.dim), Math.abs(this.bright));
    this.ratio = Math.clamped(Math.abs(this.bright) / this.radius, 0, 1);
    this.darkness = Math.min(this.dim, this.bright) < 0;
    this.limited = this.angle !== 360;
    this._animateSeed = data.seed ?? this._animateSeed ?? Math.floor(Math.random() * 100000);

    // Always update polygons for the source as the environment may have changed
    const {rays, fov, los} = SightLayer.computeSight({x: this.x, y: this.y}, this.radius, {
      angle: this.angle,
      rotation: this.rotation,
      unrestricted: this.type === SOURCE_TYPES.UNIVERSAL
    });
    this.fov = fov;
    this.los = los;
    //grapes

     // The maximum ray distance needs to reach all areas of the canvas
        let d = canvas.dimensions;
        let origin = {x: this.x, y: this.y};
        let {x, y} = origin;
        const dx = Math.max(origin.x, d.width - origin.x);
        const dy = Math.max(origin.y, d.height - origin.y);
        const distance = Math.max(this.radius, Math.hypot(dx, dy));
        const limit = this.radius / distance;
     // 
    // this.hit_walls = rays.reduce((acc, r) => {
    //                     // if (r._c != null && r._c.wall_id != null && r.los.t0 <= limit) {
    //                     if (r._c != null && r._c.wall_id != null) {

    //                          // if( inside([r.x,r.y],los)){
    //                         acc.push(r._c.wall_id);
    //                     }
    //                     return acc;
    //                 }, []).filter((v, i, a) => a.indexOf(v) === i);
    // debugger;

    //     this.hit_walls = rays.reduce((acc, r) => {
    //                     // if (r._c != null && r._c.wall_id != null && r.los.t0 <= limit) {
    //                     if (r._c != null && r._c.wall_id != null) {

    //                          // if( inside([r.x,r.y],los)){
    //                         acc.push([r._c.wall_id, (r.los.t0 <= limit)]);
    //                     }
    //                     return acc;
    //                 }, []).filter((v, i, a) => a.indexOf(v[0]) === i[0]);
    this.hit_walls = rays.reduce((acc, r) => {
                        // if (r._c != null && r._c.wall_id != null && r.los.t0 <= limit) {
                        if (r._c != null && r._c.wall_id != null) {

                             if (r.los.t0 <= limit){
                            acc.red.add(r._c.wall_id )}else{acc.no.add(r._c.wall_id )}
                        }
                        return acc;
                    }, {'red':new Set(),'no':new Set()})

    // console.log(data)
    // console.log(this.hit_walls)
    // Update shaders if the animation type changed
    const updateShaders = "animation" in changes;
    if ( updateShaders ) this._initializeShaders();

    // Initialize uniforms if the appearance of the light changed
    const uniformAttrs = ["dim", "bright", "color", "alpha", "animation"];
    if ( uniformAttrs.some(k => k in changes) ) {
      this._resetColorationUniforms = true;
      this._resetIlluminationUniforms = true;
    }

    // Initialize blend modes and sorting
    this._initializeBlending();
    return this;
 };
        })();
    }});

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

Hooks.on('sightRefresh', function(data) {
    // debugger;
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {

        if (gm_global_view === 'isometrics_Auto_Hide') {

        // for (tile of canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '')) {
        //         // let tile_object = canvas.tiles.get(tile)
        //         tile.alpha = 0 //tile.getFlag('grape_juice-isometrics', 'tile_alpha');
        //     }
          try{
            // debugger;
            for (bb of data.sources) {

                iso_magic_token_view({
                    x: bb.x,
                    y: bb.y
                }, bb.hit_walls)
            }

            for (tile in overlay_tiles) {
                hide_overlay_tile(tile)
                let tile_object = canvas.tiles.get(tile)
                // overlay_tiles[tile].visible = false;
                // canvas.tiles.get(tile).visible = false;
                if (under_tile.indexOf(tile) !== -1) {
                    try {
                        tile_object.alpha = tile_object.getFlag('grape_juice-isometrics', 'tile_alpha'); // 0.5; //todo bug
                    } catch {
                        tile_object.alpha = 0
                    }

                } else {
                    tile_object.alpha = 0
                }


            }
            // canvas.sight.fog.unexplored.children=[]

       
            for (tile of add_tile) {
                tile.visible = true;
                tile.alpha = 1;

                show_overlay_tile(tile)
            }
          }catch{}
        } else {
          let all_tiles_for =   canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '').reduce((a, x) => ([
                ...a,
                 x.data._id
            ]), [])

            for (tile of all_tiles_for) {
                let tile_object = canvas.tiles.get(tile)
                hide_overlay_tile(tile)
                show_overlay_tile(tile_object)
                if (gm_global_view === 'isometrics_Always_Show') {
                    tile_object.alpha = 1
                } else if (gm_global_view === 'isometrics_Always_Show_50') {
                    tile_object.alpha = 0.5
                } else if (gm_global_view === 'isometrics_Always_Hide') {
                    tile_object.alpha = 0

                }
            }
        }



        add_tile = [];
        under_tile = []
    // update_mask_filter()

}
});

the_sprite=''
function show_overlay_tile(tile) {

                        let sprite = 0;
            if (tile.data._id in overlay_tiles){

            // canvas.sight.msk.addChild(sprite)
                 sprite = overlay_tiles[tile.data._id]

            }
            else{
            
                        let img_tile = tile.children[1]
                        // let sprite = new PIXI.Sprite(PIXI.Texture.from(img_tile.img.texture.baseTexture.resource.url))
                        sprite = new PIXI.Sprite.fromImage(img_tile.img.texture.baseTexture.resource.url)
                        the_sprite=sprite
                        sprite.tint = 0xffffff
                        sprite.isSprite = true
                        // sprite.width = img_tile.img.width
                        // sprite.height = img_tile.img.height
                        sprite.width = tile.data.width
                        sprite.height = tile.data.height
                        sprite.position = tile.position
                        sprite.position.x += img_tile.img.x 
                        sprite.position.y += img_tile.img.y 
                        sprite.anchor = img_tile.img.anchor
            
                        sprite.angle = img_tile.img.angle
                        overlay_tiles[tile.data._id] = sprite
            
                        // sprite.blendMode=26
                        sprite.blendMode=26
            }
                        canvas.sight.fog.addChild(sprite) //this
                        // canvas.sight.addChild(sprite) //this

            // canvas.sight.fog.unexplored.addChild(sprite)
            // canvas.sight.fog.unexplored.addChild(sprite)
            // canvas.sight.fog.explored.addChild(sprite)
            // canvas.sight.fog.current.addChild(sprite)
// 
            // canvas.sight.fog.filters.push(new PIXI.SpriteMaskFilter(sprite))
            // canvas.sight.filter=[new PIXI.SpriteMaskFilter(sprite)]
            // canvas.sight.los.filter+=new PIXI.SpriteMaskFilter(sprite);
        }

        function hide_overlay_tile(tile_id) {
            let sprite = overlay_tiles[tile_id]
            // canvas.sight.removeChild(sprite)
            canvas.sight.fog.removeChild(sprite)

            // sprite.tint = 0xffffff
            // sprite.texture = PIXI.Texture.WHITE;
            // canvas.sight.fog.removeChild(sprite)
        }





