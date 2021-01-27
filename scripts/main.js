/*
  _____
 / ____|                      
 | (___   ___  _ __ _ __ _   _ 
  \___ \ / _ \| '__| '__| | | |
  ____) | (_) | |  | |  | |_| |
 |_____/ \___/|_|  |_|   \__, |
                          __/ |
                         |___/ 
for the shitty code :(
*/

console.log(`%c🍇%c
     ██████╗ ██████╗  █████╗ ██████╗ ███████╗             ██╗██╗   ██╗██╗ ██████╗███████╗
    ██╔════╝ ██╔══██╗██╔══██╗██╔══██╗██╔════╝             ██║██║   ██║██║██╔════╝██╔════╝
    ██║  ███╗██████╔╝███████║██████╔╝█████╗               ██║██║   ██║██║██║     █████╗  
    ██║   ██║██╔══██╗██╔══██║██╔═══╝ ██╔══╝          ██   ██║██║   ██║██║██║     ██╔══╝  
    ╚██████╔╝██║  ██║██║  ██║██║     ███████╗███████╗╚█████╔╝╚██████╔╝██║╚██████╗███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝ ╚════╝  ╚═════╝ ╚═╝ ╚═════╝╚══════╝
`,"font-size: 102px;","color: purple;");
// console.log(String.raw`%c
//                   ___           ___           ___           ___                       ___                       ___     
//     ___          /  /\         /  /\         /__/\         /  /\          ___        /  /\        ___          /  /\    
//    /  /\        /  /:/_       /  /::\       |  |::\       /  /:/_        /  /\      /  /::\      /  /\        /  /:/    
//   /  /:/       /  /:/ /\     /  /:/\:\      |  |:|:\     /  /:/ /\      /  /:/     /  /:/\:\    /  /:/       /  /:/     
//  /__/::\      /  /:/ /::\   /  /:/  \:\   __|__|:|\:\   /  /:/ /:/_    /  /:/     /  /:/~/:/   /__/::\      /  /:/  ___ 
//  \__\/\:\__  /__/:/ /:/\:\ /__/:/ \__\:\ /__/::::| \:\ /__/:/ /:/ /\  /  /::\    /__/:/ /:/___ \__\/\:\__  /__/:/  /  /\
//     \  \:\/\ \  \:\/:/~/:/ \  \:\ /  /:/ \  \:\~~\__\/ \  \:\/:/ /:/ /__/:/\:\   \  \:\/:::::/    \  \:\/\ \  \:\ /  /:/
//      \__\::/  \  \::/ /:/   \  \:\  /:/   \  \:\        \  \::/ /:/  \__\/  \:\   \  \::/~~~~      \__\::/  \  \:\  /:/ 
//      /__/:/    \__\/ /:/     \  \:\/:/     \  \:\        \  \:\/:/        \  \:\   \  \:\          /__/:/    \  \:\/:/  
//      \__\/       /__/:/       \  \::/       \  \:\        \  \::/          \__\/    \  \:\         \__\/      \  \::/   
//                  \__\/         \__\/         \__\/         \__\/                     \__\/                     \__\/    
// `);

console.log(String.raw`%c🍇Isometric🍇%c

    ` ,'font-size: 72px; color: #b87ee8; font-family: "Arial Black", Gadget, sans-serif; text-shadow: 0px 0px 0 rgb(179,121,227),1px 1px 0 rgb(174,116,222),2px 2px 0 rgb(169,111,217),3px 3px 0 rgb(164,106,212),4px 4px 0 rgb(159,101,207),5px 5px 0 rgb(154,96,202),6px 6px 0 rgb(149,91,197),7px 7px 0 rgb(144,86,192),8px 8px 0 rgb(139,81,187),9px 9px 0 rgb(133,75,181),10px 10px 0 rgb(128,70,176),11px 11px 0 rgb(123,65,171),12px 12px 0 rgb(118,60,166),13px 13px 0 rgb(113,55,161),14px 14px 0 rgb(108,50,156),15px 15px 0 rgb(103,45,151),16px 16px 0 rgb(98,40,146),17px 17px 0 rgb(93,35,141),18px 18px  0 rgb(88,30,136),19px 19px 18px rgba(0,0,0,0.6),19px 19px 1px rgba(0,0,0,0.5),0px 0px 18px rgba(0,0,0,.2);',"");
 

door_hooks = {}
attach_wall = {}
overlay_tiles = {}
add_tile = []
under_tile= []

gm_global_view = "isometrics_Auto_Hide";

// Hooks.on('canvasInit', function() {
//     door_hooks = {}
//     attach_wall = {}
//     overlay_tiles = {}
//     add_tile = []
//     under_tile= []
//     // canvas.dimensions.height*=2
//     // canvas.dimensions.width*=2
// // canvas.dimensions.shiftY=0
//     if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
//         canvas.dimensions.sceneRect.y=0
//         canvas.dimensions.sceneRect.x=0

//         canvas.dimensions.sceneRect.height*=2
//         canvas.dimensions.sceneRect.width*=2

//         canvas.dimensions.height*=2
//         canvas.dimensions.width*=2
//         canvas.dimensions.rect.height*=2
//         canvas.dimensions.rect.width*=2

//         canvas.dimensions.sceneHeight*=2
//         canvas.dimensions.sceneWidth*=2

//     }
// })


width_scale = 1;
height_scale = 1;

Hooks.on('canvasInit', function() {
    door_hooks = {}
    attach_wall = {}
    overlay_tiles = {}
    add_tile = []
    under_tile= []
    // canvas.dimensions.height*=2
    // canvas.dimensions.width*=2
// canvas.dimensions.shiftY=0
    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        canvas.dimensions.sceneRect.y=0
        canvas.dimensions.sceneRect.x=0
            let srh = canvas.dimensions.sceneRect.height;
            let srw = canvas.dimensions.sceneRect.width;
            let hyp = Math.sqrt((srh*srh) + (srw*srw));
            height_scale = hyp / srh;
            width_scale = hyp / srw;
            height_scale =  height_scale * 1.1
            width_scale = width_scale * 1.1
        canvas.dimensions.sceneRect.height*=height_scale;
        canvas.dimensions.sceneRect.width*=width_scale;

        canvas.dimensions.height*=height_scale;
        canvas.dimensions.width*=width_scale;

        canvas.dimensions.rect.height*=height_scale;
        canvas.dimensions.rect.width*=width_scale;

        canvas.dimensions.sceneHeight*=height_scale;
        canvas.dimensions.sceneWidth*=width_scale;






    }
})

Hooks.on('renderGridConfig',  function() {

            // m = getWorldTransformPIXIMatrix() 
        // // m.tx = 0
        // // m.ty = 0
        // m = getWorldTransformPIXIMatrix() 
        // canvas.pan({x:canvas.dimensions.width/2,y:canvas.dimensions.height/2})
        // canvas.layers[1].img.transform.setFromMatrix(m)
        // canvas.background.img.x+=canvas.scene.data.shiftX
        // canvas.background.img.y+=canvas.scene.data.shiftY
})

Hooks.on('canvasReady', async function() {

    if (game.scenes.viewed.getFlag('grape_juice-isometrics', 'is_isometric')) {
        saved_pan_x = canvas.stage.pivot.x
        saved_pan_y = canvas.stage.pivot.y
        saved_pan_zoom = canvas.stage.scale.x
        console.error(saved_pan_x,saved_pan_y,saved_pan_zoom)
        

        // canvas.scene.data.shiftY=0; 
        // canvas.draw(canvas.scene)


        canvas.app.stage.scale.x = 1;
        canvas.app.stage.scale.y = 1;

        // canvas.layers[0].img.x=0
        // canvas.layers[0].img.y=0
        canvas.pan({x:canvas.dimensions.width/2,y:canvas.dimensions.height/2})


        canvas.app.stage.skew.set((30 * (Math.PI / 180)), 0);
        canvas.app.stage.rotation = (-30 * (Math.PI / 180));

        canvas.pan({x:canvas.dimensions.width/2,y:canvas.dimensions.height/2})





        if (canvas.stage.children[1].iso_layer === true) {
            await canvas.app.stage.removeChild(canvas.stage.children[1]);
        }
        // if (canvas.layers[1].iso_layer === true) {
        //     await canvas.app.stage.removeChild(canvas.layers[1]);
        // }

        var my_bg_layer = new BackgroundLayer()
        my_bg_layer.iso_layer = true;

        // await canvas.app.stage.removeChild(canvas.layers[0]);
        canvas.stage.addChildAt(my_bg_layer, 1);

        // await canvas.app.stage.addChild(my_bg_layer);
        // canvas.app.stage.children = await array_move(canvas.app.stage.children, 13, 1);

        canvas.stage.children[0].visible = false;
        // canvas.layers[0].visible = false;
        // canvas.layers[0].img.anchor.set(0.5,0.5)

        // m.tx = canvas.layers[0].img.transform.worldTransform.tx
        // m.ty = canvas.layers[0].img.transform.worldTransform.ty
        // canvas.layers[0].img.transform.setFromMatrix(m)


        await my_bg_layer.draw()
        if (my_bg_layer.img){
            await my_bg_layer.img.anchor.set(0.5,0.5)
        }

        m = await getWorldTransformPIXIMatrix() 
                m.tx = 0

        m.ty = 0
    // console.error(my_bg_layer.img.x)
    // console.error(my_bg_layer.img.y)
    // console.error(m)
    // console.error(my_bg_layer.img.transform)

        // my_bg_layer.img.transform.setFromMatrix(m)
        await my_bg_layer.transform.setFromMatrix(m)

        if (my_bg_layer.img){

                    canvas.background.img = await my_bg_layer.img
                    // canvas.layers[1].img= canvas.background.img 
                // console.error(m)
                // console.error(canvas.layers[1].img.transform)
                    canvas.background.img.width/=await width_scale
                    
                    canvas.background.img.height/=await height_scale
            }

        
        await canvas.pan({x: saved_pan_x,y: saved_pan_y,scale: saved_pan_zoom})



            // console.error(canvas.layers[1].img.x)
    // console.error(canvas.layers[1].img.y)
        // canvas.layers[1].img.x+=canvas.scene.data.shiftX
        // canvas.layers[1].img.y+=canvas.scene.data.shiftY
    // console.error(canvas.layers[1].img.x)
    // console.error(canvas.layers[1].img.y)
        // canvas.background.img.transform.setFromMatrix(m)

        // canvas.layers[1].img.anchor.x=0.5
        // canvas.layers[1].img.anchor.y=0.5
        // canvas.layers[1].img.anchor.x=-0.25
        // canvas.layers[1].img.anchor.y=0.75


        // canvas.layers[1].img.anchor.set(canvas.layers[1].width.img/2,canvas.layers[1].height.img/2)
        // m.tx = canvas.layers[1].transform.worldTransform.tx
        // m.ty = canvas.layers[1].transform.worldTransform.ty
        // canvas.layers[1].img.anchor.set(0.5,0.5)

        // canvas.layers[1].transform.setFromMatrix(m)

        // canvas.layers[1].x=0
        // canvas.layers[1].y=0
        // canvas.layers[1].x=canvas.layers[0].img.x*4
        // canvas.layers[1].y=canvas.layers[0].img.y*-2
        // canvas.layers[1].x = canvas.layers[0].img.width
        // canvas.layers[1].y = canvas.layers[0].img.height / -2

        // var world = getWorldTransformMatrix()
        // aa = world.inverse().applyToPoint(0, 0)
        // canvas.layers[1].img.x-=aa.x
        // canvas.layers[1].img.y-=aa.y


        // var world = getWorldTransformMatrix()
        // aa = world.inverse().applyToPoint(canvas.layers[1].img.x, canvas.layers[1].img.y)
        // canvas.layers[1].img.x-=aa.x
        // canvas.layers[1].img.y-=aa.y


        // x = (world.inverse().applyToPoint(canvas.layers[1].x, canvas.layers[1].y).x);
        // y = (world.inverse().applyToPoint(canvas.layers[1].x, canvas.layers[1].y).y);
        // canvas.layers[1].y-= y
        // canvas.layers[1].x= x

        // canvas.background.img = canvas.layers[1].img

        // canvas.layers[1].visible=false;

        // canvas.layers[1].img = canvas.layers[0]
        // canvas.layers[0].transform.setFromMatrix(m)
        // canvas.layers[8].transform.setFromMatrix(m)
        // canvas.layers[9].transform.setFromMatrix(m)


 
    } else {

        if (canvas.stage.children[1].iso_layer === true) {
        // if (canvas.layers[1].iso_layer === true) {

            await canvas.app.stage.removeChild(canvas.stage.children[1]);
            // await canvas.app.stage.removeChild(canvas.layers[1]);
            canvas.stage.children[0].visible = true;
            // canvas.layers[0].visible = true;
            canvas.app.stage.skew.set((0 * (Math.PI / 180)), 0);
            canvas.app.stage.rotation = (0 * (Math.PI / 180));

        }
    }



           door_hooks = canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].hook_door_id != '').reduce((a, x) => ({
            ...a,
            [x.data.flags["grape_juice-isometrics"].hook_door_id]: x.data._id
        }), {})
           all_iso_tiles = canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '')
        _attach_wall = all_iso_tiles.reduce((a, x) => ({
            ...a,
            [x.data.flags["grape_juice-isometrics"].attach_wall_id]: x.data._id
        }), {})


        for (key in _attach_wall) {
            for (id of key.split(',')) {
                attach_wall[id] = _attach_wall[key];
            }
        }

        // let all_tiles_for =   canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '').reduce((a, x) => ([
        //         ...a,
        //          x.data._id
        //     ]), [])

        //     for (tile of all_tiles_for) {
        //         let tile_object = canvas.tiles.get(tile)
        //         show_overlay_tile(tile_object)
        //         hide_overlay_tile(tile)
                
        //     }





   let all_tiles_for =   canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '').reduce((a, x) => ([
                ...a,
                 x.data._id
            ]), [])
            for (tile of all_tiles_for) {
                let tile_object = canvas.tiles.get(tile)
                show_overlay_tile(tile_object)
                hide_overlay_tile(tile)


            }

    for (tile of canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '')) {
                // let tile_object = canvas.tiles.get(tile)
                tile.visible=true;
                tile.alpha = tile.getFlag('grape_juice-isometrics', 'tile_alpha');
            }


             await canvas.lighting.refresh()

             await canvas.sight.refresh()

});


Hooks.once('ready',  async function() {
         
                        // await canvas.lighting.refresh()

           door_hooks = canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].hook_door_id != '').reduce((a, x) => ({
            ...a,
            [x.data.flags["grape_juice-isometrics"].hook_door_id]: x.data._id
        }), {})
           all_iso_tiles = canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '')
        _attach_wall = all_iso_tiles.reduce((a, x) => ({
            ...a,
            [x.data.flags["grape_juice-isometrics"].attach_wall_id]: x.data._id
        }), {})


        for (key in _attach_wall) {
            for (id of key.split(',')) {
                attach_wall[id] = _attach_wall[key];
            }
        }



   let all_tiles_for =   canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '').reduce((a, x) => ([
                ...a,
                 x.data._id
            ]), [])
            for (tile of all_tiles_for) {
                let tile_object = canvas.tiles.get(tile)
                show_overlay_tile(tile_object)
                hide_overlay_tile(tile)


            }

    for (tile of canvas.tiles.objects.children.filter(tile => tile.data.flags["grape_juice-isometrics"] && tile.data.flags["grape_juice-isometrics"].attach_wall_id != '')) {
                // let tile_object = canvas.tiles.get(tile)
                tile.visible=true;
                tile.alpha = tile.getFlag('grape_juice-isometrics', 'tile_alpha');
            }


             await canvas.lighting.refresh()

             await canvas.sight.refresh()

        });
