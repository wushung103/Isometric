//ui

// 
Hooks.on('dropCanvasData', function(that, data) {
	if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {

		world = getWorldTransformMatrix()
		const [x, y] = [event.clientX, event.clientY];
		data.x = (world.inverse().applyToPoint(x, y).x)
		data.y = (world.inverse().applyToPoint(x, y).y)


	}
})


function tool_bar_toggler(togg, name) {
	if (gm_global_view === name) {
		gm_global_view = "isometrics_Auto_Hide";
	} else {
		gm_global_view = name;

	}
	if(gm_global_view !=="isometrics_Auto_Hide"){
	// Hooks.call('sightRefresh',{'sources':[]})
	Hooks.call('sightRefresh')

	}
}

// renderApplication
// renderSceneControls


Hooks.on("renderApplication", (controls) => {
 if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {

	for (aa of $('#controls > li.scene-control.active > ol > li.control-tool[data-tool^="isometrics"]')) {
		if (aa.attributes['data-tool'].value !== gm_global_view) {
			aa.classList.remove('active')
		}
		else{
			aa.classList.add('active')

		}
	}
}
});


Hooks.on("getSceneControlButtons", (controls) => {
 if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {

	if (game.user.isGM) {
		tools = controls.find(x => x['name'] == 'tiles').tools
		tools.push({
			active: true,
			icon: "fas fa-eye-dropper",
			name: "isometrics_Auto_Hide",
			title: "Auto Hides Based on Token (default)",
			onClick: (togg) => {
				tool_bar_toggler(togg, 'isometrics_Auto_Hide')
			},
			toggle: true
		}, {
			active: false,
			icon: "fas fa-eye",
			name: "isometrics_Always_Show",
			title: "Always Show Tiles",
			onClick: (togg) => {
				tool_bar_toggler(togg, 'isometrics_Always_Show')
			},
			toggle: true
		}, {
			active: false,
			icon: "fas fa-low-vision",
			name: "isometrics_Always_Show_50",
			title: "Always Show Tiles at %50 alpha",
			onClick: (togg) => {
				tool_bar_toggler(togg, 'isometrics_Always_Show_50')
			},
			toggle: true
		}, {
			active: false,
			icon: "fas fa-eye-slash",
			name: "isometrics_Always_Hide",
			title: "Always Hide Tiles",
			onClick: (togg) => {
				tool_bar_toggler(togg, 'isometrics_Always_Hide')
			},
			toggle: true
		}, );

	}
}
	
});

Hooks.on('init', function() {
	KeyboardManager.prototype._handleCanvasPan = (function() {
		return function() {

		    // Determine movement offsets
		    const directions = this._moveKeys;
		    let dx = 0;
		    let dy = 0;
			if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
				if (directions.has("left")) {
					dx -= 1;
					dy -= 1
				};
				if (directions.has("up")) {dy -= 1;dx+=1}
				if (directions.has("right")) {dx += 1;dy+=1}
				if (directions.has("down")) {dy += 1;dx-=1}
				dy/=directions.size
				dx/=directions.size
			} else {
				if (directions.has("left")) dx -= 1;
				if (directions.has("up")) dy -= 1;
				if (directions.has("right")) dx += 1;
				if (directions.has("down")) dy += 1;
			}

		    // Pan by the grid size
		    const s = canvas.dimensions.size;
		    canvas.animatePan({
		      x: canvas.stage.pivot.x + (dx * s),
		      y: canvas.stage.pivot.y + (dy * s),
		      duration: 100
		    });

		    // Clear the pending set
		    this._moveKeys.clear();
	}

	})();

	KeyboardManager.prototype._handleMovement = (function(event, layer) {
		return function(event, layer) {

			if (!this._moveKeys.size) return;

			// Get controlled objects
			let objects = layer.placeables.filter(o => o._controlled);
			if (objects.length === 0) return;

			// Define movement offsets and get moved directions
			const directions = this._moveKeys;
			let dx = 0;
			let dy = 0;
			if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
				if (directions.has("left")) {
					dx -= 1;
					dy -= 1
				};
				if (directions.has("up")) {dy -= 1;dx+=1}
				if (directions.has("right")) {dx += 1;dy+=1}
				if (directions.has("down")) {dy += 1;dx-=1}
				dy/=directions.size
				dx/=directions.size
			} else {
				if (directions.has("left")) dx -= 1;
				if (directions.has("up")) dy -= 1;
				if (directions.has("right")) dx += 1;
				if (directions.has("down")) dy += 1;
			}
			// Assign movement offsets

			this._moveKeys.clear();
			// Perform the shift or rotation
			layer.moveMany({
				dx,
				dy,
				rotate: event.shiftKey
			});
		}

	})();
});