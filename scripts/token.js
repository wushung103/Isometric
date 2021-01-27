// tokens


var slow_count = 0
var slow_count_upper = 0
var slow_sign = 1
Hooks.on('canvasInit_no_thanks', (a, b, c, d, e) => {
	canvas.app.ticker.add((delta) => {
		// rotate the container!
		// use delta to create frame-independent transform
		slow_count++
		if (slow_count > 0) {
			slow_count = 0
			slow_count_upper++;
			if (slow_count_upper > 100) {
				slow_count_upper = 0
				slow_sign *= -1
			}

			flyer(slow_sign)
		}
	});

})

function flyer(slow_sign) {
	for (tok of canvas.tokens.placeables) {
		if (tok.data.elevation > 0) {
			let {
				x,
				y
			} = tok.icon.anchor
			rand_ele = 0.002 * slow_sign
			y + rand_ele
			tok.icon.anchor.set(x, y + rand_ele)
			// } else {
			// 	// tok.icon.scale.y += 0.00005* slow_sign
			// 	// tok.icon.scale.x -= 0.00005* slow_sign
			// 	let {
			// 		x,
			// 		y
			// 	} = tok.icon.skew

			// 	tok.icon.skew.set(x + (0.0005 * slow_sign), y)

			// }
		}
	}
}

function selectedflyer(slow_sign) {
	for (tok of canvas.tokens.controlled) {
		if (tok.data.elevation > 0) {
			let {
				x,
				y
			} = tok.icon.anchor
			rand_ele = 0.002 * slow_sign
			y + rand_ele
			tok.icon.anchor.set(x, y + rand_ele)
		} else {
			// tok.icon.scale.y += 0.00005* slow_sign
			// tok.icon.scale.x -= 0.00005* slow_sign
			let {
				x,
				y
			} = tok.icon.skew

			tok.icon.skew.set(x + (0.0005 * slow_sign), y)

		}
	}
}


Hooks.on('createToken', (aaa, b, c, d, e) => {
	a = canvas.tokens.get(b._id);
	token_isometric_fixup(a)

})

Hooks.on('targetToken',async (a, b, c, d, e) => {
	// a = canvas.tokens.get(b.data._id);
	await new Promise(r => setTimeout(r, 1));
	token_isometric_fixup(b)
})

Hooks.on('hoverToken', (a, b, c, d, e) => {
	token_isometric_fixup(a)
})

Hooks.on('controlToken', (a, b, c, d, e) => {
	token_isometric_fixup(a)
})

Hooks.on('renderSceneControls', (abla, b, c, d, e) => {
	try {
		for (a of canvas.tokens.objects.children) {
			token_isometric_fixup(a)
		}
	} catch {}
})

Hooks.on('updateToken', (abla, b, c, d, e) => {
	a = canvas.tokens.get(b._id);
	token_isometric_fixup(a)
})

lighted_walls = []

Hooks.on('sightRefresh', (abla, b, c, d, e) => {
	for (a of canvas.tokens.objects.children) {
		token_isometric_fixup(a)
	}
})


Hooks.on('lightingRefresh', (abla, b, c, d, e) => {
	// debugger;
	// lighted_walls = abla.sources.reduce((acc,s) => {if (s.active){acc = acc.concat(s.hit_walls)};return acc},[]).filter((v, i, a) => a.indexOf(v) === i);
	try{
		lighted_walls = abla.sources.reduce((acc,s) => {if (s.active){acc = acc.concat([...s.hit_walls.red])};return acc},[]).filter((v, i, a) => a.indexOf(v) === i);
	}catch{}

})

function token_isometric_fixup(token) {
	if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
		try {
			token.icon.rotation = (45 * (Math.PI / 180));
			// token.icon.scale.y = 2 * token.icon.scale.x;
    		// token.icon.scale.x = Math.abs(token.icon.scale.x) * (token.data.mirrorX ? -1 : 1);

			token.icon.scale.y = 1.73 * token.icon.scale.x * (token.data.mirrorY ? -1 : 1)* (token.data.mirrorX ? -1 : 1);
			token.icon.anchor.set(0.5, 0.7071 * ((token.data.elevation / 5) / token.data.height / token.data.scale + 1)); // *token.data.elevation/((canvas.grid.size / 100 )+1))
		} catch {}
	}
}


// I NEED TO KEEP ALL WALLS LIT, WITH THE HOOK IN LIGHT, IN TOKEN MAGIC IT WILL HIDE UNLESS IT IS IN LITE

// all lit walls, test if are in hitted, regardless of radius.
// if hitted, keep them.


function iso_magic_token_view(a, hit_walls) {

	aa = new PIXI.Sprite
	canvas.stage.addChild(aa)
	aa.x = a.x
	aa.y = a.y
	var {
		x = x, y = y
	} = aa.toGlobal(new PIXI.Point()) // wall

	canvas.stage.removeChild(aa)


	x -= canvas.app.stage.localTransform.tx
	y -= canvas.app.stage.localTransform.ty
	// debugger;


	for (wall in attach_wall) {
		try {
			var [x1, y1, x2, y2] = wall_position(canvas.walls.get(wall).coords)

			if (x1 == x2) {
				console.log('private case')
				return
			}
			var slope = (y2 - y1) / (x2 - x1) //slop

			// console.log('y:' + y, 'liney:' + line_y)
			let tile = canvas.tiles.get(attach_wall[wall])
			// debugger;
			if (hit_walls.red.has(wall) || (lighted_walls.includes(wall) && hit_walls.no.has(wall))) {
			// if (( lighted_walls.includes(wall))) {

				if (((y - y1) > slope * (x - x1))) {
					// tile.visible = true

					// show_overlay_tile(tile)
					add_tile.push(tile)
					console.log('over me')
				} else {
					under_tile.push(tile.data._id)
					console.log('under me and hit')

				}
			} else {
				// tile.visible = false
				// hide_overlay_tile(tile)

				console.log('under me')

			}
		} catch {}
	}
}



//remove shader on controlled token
// Hooks.on('controlToken', (a,b)=> {if (b){a.icon.filters=[]}else{a.icon.filters=[mask_filter]}})