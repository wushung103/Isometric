//configs
Hooks.on("renderSceneConfig", (app, html, data) => {
	// debugger;
	let usingIsometric = undefined;
	if (app.object.data.flags["grape_juice-isometrics"]) {
		if (app.object.data.flags["grape_juice-isometrics"].is_isometric) {
			usingIsometric = app.object.getFlag('grape_juice-isometrics', 'is_isometric');
		} else {
			app.object.setFlag('grape_juice-isometrics', 'is_isometric', false);
			usingIsometric = false;
		}
	} else {
		app.object.setFlag('grape_juice-isometrics', 'is_isometric', false);
		usingIsometric = false;
	}

	const isoHtml = `
    <div class="form-group">
        <label>🍇Enable Isometric Mode</label>
        <input id="grape_juice-isometrics-is_isometric" type="checkbox" name="grape_juice-isometricsIsIsometric" data-dtype="Boolean" ${usingIsometric ? 'checked' : ''}>
        <p class="notes">Enable Isometric Mode for this scene.</p>
    </div>
    `
	const isoFind = html.find("select[name ='gridType']");
	const formGroup = isoFind.closest(".form-group");
	formGroup.after(isoHtml);
});


Hooks.on("closeSceneConfig", (app, html, data) => {
	app.object.setFlag('grape_juice-isometrics', 'is_isometric', html.find("input[name ='grape_juice-isometricsIsIsometric']").is(":checked"))
});

Hooks.on("renderTileConfig", (app, html, data) => {
	let hook_door_id = undefined;
	if (app.object.data.flags["grape_juice-isometrics"]) {
		if (app.object.data.flags["grape_juice-isometrics"].hook_door_id) {
			hook_door_id = app.object.getFlag('grape_juice-isometrics', 'hook_door_id');
		} else {
			app.object.setFlag('grape_juice-isometrics', 'hook_door_id', '');
			hook_door_id = '';
		}
	} else {
		app.object.setFlag('grape_juice-isometrics', 'hook_door_id', '');
		hook_door_id = '';
	}
	var isoHtml = `<div class="form-group">
        <label>🍇Hook door on open</label>
        <div class="form-fields">
            
          <input type="text" name="hook_door_id" disabled="" value="${hook_door_id}">
          <button type="button" class="hook-door" data-target="hook_door_id" title="Hook Door" tabindex="-1">
              <i class="fas fa-door-open"></i>
          </button>
          
        </div>
    </div>`


	let attach_wall_id = undefined;
	if (app.object.data.flags["grape_juice-isometrics"]) {
		if (app.object.data.flags["grape_juice-isometrics"].attach_wall_id) {
			attach_wall_id = app.object.getFlag('grape_juice-isometrics', 'attach_wall_id');
		} else {
			app.object.setFlag('grape_juice-isometrics', 'attach_wall_id', '');
			attach_wall_id = '';
		}
	} else {
		app.object.setFlag('grape_juice-isometrics', 'attach_wall_id', '');
		attach_wall_id = '';
	}
	isoHtml += `<div class="form-group">
        <label>🍇Attach asset to wall</label>
        <div class="form-fields">
            
          <input type="text" name="attach_wall_id" disabled="" value="${attach_wall_id}">
          <button type="button" class="attach-wall" data-target="attach_wall_id" title="Attach to Wall" tabindex="-1">
              <i class="fas fa-university"></i>
          </button>
          <button type="button" class="clear-attach-wall" data-target="attach_wall_id" title="Clear Attach to Wall" tabindex="-1">
              <i class="fas fa-snowplow"></i>
          </button>
        </div>
    </div>`


	let tile_alpha = 0;
	if (app.object.data.flags["grape_juice-isometrics"]) {
		if (app.object.data.flags["grape_juice-isometrics"].tile_alpha) {
			tile_alpha = app.object.getFlag('grape_juice-isometrics', 'tile_alpha');
		} else {
			app.object.setFlag('grape_juice-isometrics', 'tile_alpha', 0);
			tile_alpha = 0;
		}
	} else {
		app.object.setFlag('grape_juice-isometrics', 'tile_alpha', 0);
		tile_alpha = 0;
	}
	isoHtml += `
	<div class="form-group">
        <label>🍇Above Alpha</label>
        <div class="form-fields">
            <input type="range" name="tile_alpha" value="${tile_alpha}" min="0" max="1" step="0.05" data-dtype="Number" onChange="$('#tile_alpha_view')[0].innerText=this.value">
            <span id='tile_alpha_view' class="range-value">${tile_alpha}</span>
        </div>
    </div>

    `

	const isoFind = html.find("label[for='img']");
	const formGroup = isoFind.closest(".form-group");
	formGroup.after(isoHtml);
	// debugger;
	html.find("button.hook-door").click(this._onHookDoor.bind(this))
	html.find("button.attach-wall").click(this._onAttachWall.bind(this))
	html.find("button.clear-attach-wall").click(this._onClearAttachWall.bind(this))
});



function _onHookDoor(event) {
	event.preventDefault();
	const btn = event.currentTarget;
	const form = btn.form;
	ui.notifications.info("Please click on the door you want to hook");
	canvas.controls.doors.visible=true;
	try {
		delete attach_wall[form["hook_door_id"]]
	} catch {}

	Hooks.once('preUpdateWall', (_, wall) => {
		console.log('clicked' + wall._id);
		form["hook_door_id"].value = wall._id;
		canvas.controls.doors.visible=false;
		return false
	})

}
Hooks.on("closeTileConfig", (app, html, data) => {
	door_id = html.find("input[name ='hook_door_id']")[0].value
	app.object.setFlag('grape_juice-isometrics', 'hook_door_id', door_id)
	door_hooks[door_id] = app.object.data._id;

	wall_ids = html.find("input[name ='attach_wall_id']")[0].value
	app.object.setFlag('grape_juice-isometrics', 'attach_wall_id', wall_ids)
	for (wall_id of wall_ids.split(',')) {
		attach_wall[wall_id] = app.object.data._id;
	}

		tile_alpha = html.find("input[name ='tile_alpha']")[0].value
	app.object.setFlag('grape_juice-isometrics', 'tile_alpha', tile_alpha)
	console.log(wall_ids)
});

function _onAttachWall(event) {
	event.preventDefault();
	const btn = event.currentTarget;
	const form = btn.form;
	ui.notifications.info("Please click on the wall you want to attach");
	canvas.getLayer("WallsLayer").activate()
	// try {
	//     delete attach_wall[form["attach_wall_id"]]
	// } catch {}
	Hooks.once('controlWall', (wall) => {
		console.log('clicked' + wall.data._id);
		if (form["attach_wall_id"].value == "") {
			form["attach_wall_id"].value = wall.data._id;
		} else {
			form["attach_wall_id"].value += ',' + wall.data._id;
		}
		canvas.getLayer("TilesLayer").activate();
		return false
	})

}

function _onClearAttachWall(event) {
	event.preventDefault();
	const btn = event.currentTarget;
	const form = btn.form;

	wall_ids = form["attach_wall_id"].value
	for (wall_id of wall_ids.split(',')) {
		try {
			delete attach_wall[wall_id]
		} catch {}

	}
	form["attach_wall_id"].value = ""
}