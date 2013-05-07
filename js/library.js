//library list - tanks, maps, countries
var TOP = 0;
function draw_library_list(next){
	PLACE = 'library';
	unregister_buttons(PLACE);
	map_offset = [0, 0];
	
	x = 10;
	y = 10;
	
	//background
	canvas_backround.drawImage(IMAGE_BACK, 0, 0, 700, 500, 0, 0, WIDTH_APP, HEIGHT_APP-27);
	
	//Units button
	width = 100;
	height = 30;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		draw_library_units();
		});
	//text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Helvetica";
	text = "Units";
	text_width = canvas_backround.measureText(text).width;
	canvas_backround.fillText(text, x+(width-text_width)/2, y+(height+font_pixel_to_height(13))/2);
	x = x + 100+10;
	
	//maps button
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#69a126";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		draw_library_maps();
		});
	//text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Helvetica";
	text = "Maps";
	text_width = canvas_backround.measureText(text).width;
	canvas_backround.fillText(text, x+(width-text_width)/2, y+(height+font_pixel_to_height(13))/2);
	x = x + 100+10;
	
	//back button
	width = 80;
	canvas_backround.strokeStyle = "#000000";
	canvas_backround.fillStyle = "#c50000";
	roundRect(canvas_backround, x, y, width, height, 5, true);
	register_button(x, y, width, height, PLACE, function(xx, yy){
		last_selected = -1;
		init_game(false);
		});
	//text
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.font = "Bold 13px Helvetica";
	text = "Back";
	text_width = canvas_backround.measureText(text).width;
	canvas_backround.fillText(text, x+(width-text_width)/2, y+(height+font_pixel_to_height(13))/2);
	
	TOP = y + height + 20;
	
	if(next == undefined)
		draw_library_units();	
	}
function draw_library_units(selected_tank){
	draw_library_list(false);
	var y = TOP;
	var gap = 5;
	
	if(selected_tank==undefined) selected_tank = 0;
	//show all possible tanks
	j = 0;
	preview_xy = 90;
	for(var i in TYPES){
		if(15+j*(preview_xy+gap)+ preview_xy > WIDTH_APP){
			y = y + preview_xy+gap;
			j = 0;
			}
		//reset background
		var back_color = '';
		if(selected_tank != undefined && selected_tank == i)
			back_color = "#8fc74c"; //selected
		else
			back_color = "#dbd9da";
		canvas_backround.fillStyle = back_color;
		canvas_backround.strokeStyle = "#196119";
		roundRect(canvas_backround, 10+j*(preview_xy+gap), y, 90, 90, 5, true);
		
		//logo
		var pos1 = 10+j*(preview_xy+gap);
		var pos2 = y;
		if(TYPES[i].type == 'tank')
			draw_image(canvas_backround, TYPES[i].name, pos1, pos2);
		else{
			var pos_left = pos1 + (90-TYPES[i].size[1])/2;
			var pos_top = pos2 + (90-TYPES[i].size[1])/2;
			draw_tank_clone(
				{type: i, size: function(){ return TYPES[i].size[1]; }},
				pos_left, pos_top, 0, 1, canvas_backround);
			}
		
		//register button
		register_button(10+j*(preview_xy+gap)+1, y+1, preview_xy, preview_xy, PLACE, function(mouseX, mouseY, index){
			//index;
			draw_library_units(index);
			}, i);
		j++;
		}
	last_selected = selected_tank;
	y = y + preview_xy+20;	
	
	//tank info block
	var info_left = 10;
	var info_block_height = HEIGHT_APP-27-y-10;
	var info_block_width = WIDTH_APP-20;
	canvas_backround.fillStyle = "#ffffff";
	canvas_backround.strokeStyle = "#196119";
	roundRect(canvas_backround, info_left, y, info_block_width, info_block_height, 5, true);

	//tank stats
	if(selected_tank != undefined){
		var pos1 = info_left+10 + (90-TYPES[selected_tank].size[1])/2;	
		var pos2 = y + round((info_block_height-preview_xy)/2) + (90-TYPES[selected_tank].size[1])/2;
		draw_tank_clone(
			{type: selected_tank, size: function(){ return TYPES[selected_tank].size[1]; }},
			pos1, pos2, 0, 1, canvas_backround);
		
		canvas_backround.font = "bold 18px Verdana";
		canvas_backround.fillStyle = "#196119";
		text = TYPES[selected_tank].name;
		text_width = canvas_backround.measureText(text).width;
		canvas_backround.fillText(text, info_left+preview_xy+40, y+25);
		
		//description
		var text = '';
		for(var d in TYPES[selected_tank].description){
			text = text + TYPES[selected_tank].description[d];
			if(parseInt(d)+1 != TYPES[selected_tank].description.length)
				text = text + ", ";
			}
		canvas_backround.font = "bold 11px Verdana";
		canvas_backround.fillStyle = "#69a126";
		canvas_backround.fillText(text, info_left+preview_xy+40+text_width+10, y+25);
		
		function lib_show_stats(name, value, x, y, nobold, min_char_value, max_char_value){
			value_copy = value;
			//check
			if(value == undefined)		value = "-";
			if(typeof value == 'object')	value = value[0]+" + "+value[1];
			if(value == 1)			value = "Yes";
			//name
			canvas_backround.font = "normal 10px Verdana";
			canvas_backround.fillStyle = "#444444";
			canvas_backround.fillText(name, x, y);
			//value
			if(nobold !== true)
				canvas_backround.font = "bold 11px Verdana";
			else
				canvas_backround.font = "normal 11px Verdana";
			canvas_backround.fillStyle = "#196119";
			canvas_backround.fillText(value, x+90, y);
			//chart
			if(max_char_value != undefined){
				value = value_copy;
				if(typeof value == 'object')	value = value[0];
				value = value - min_char_value;
				max_char_value = max_char_value - min_char_value;
				x = x + 90 + 90;
				height = 5;
				var max_width = WIDTH_APP-x-20;
				width = round((value * max_width) / max_char_value);
				if(width >= max_width){
					width = max_width;
					canvas_backround.fillStyle = "#c50000";					
					}
				else
					canvas_backround.fillStyle = "#69a126";
				canvas_backround.fillRect(x, y-height, width, height);
				}
			}
		var height_space = 16;
		var st=0;
		var value = [round(TYPES[selected_tank].damage[0]/TYPES[selected_tank].attack_delay), TYPES[selected_tank].damage[1]/TYPES[selected_tank].attack_delay]
		lib_show_stats("DPS", value, info_left+preview_xy+40, y+50+st*height_space, false, 10, 30); st++;
		lib_show_stats("Life", TYPES[selected_tank].life, info_left+preview_xy+40, y+50+st*height_space, false, 100, 250); st++;
		lib_show_stats("Armor", TYPES[selected_tank].armor, info_left+preview_xy+40, y+50+st*height_space, false, 0, 40); st++;
		lib_show_stats("Speed", TYPES[selected_tank].speed, info_left+preview_xy+40, y+50+st*height_space, false, 0, 35); st++;
		lib_show_stats("Range", TYPES[selected_tank].range, info_left+preview_xy+40, y+50+st*height_space); st++;
		lib_show_stats("Scout", TYPES[selected_tank].scout, info_left+preview_xy+40, y+50+st*height_space); st++;
		lib_show_stats("Turn speed", TYPES[selected_tank].turn_speed, info_left+preview_xy+40, y+50+st*height_space); st++;
		lib_show_stats("Ignore armor", TYPES[selected_tank].ignore_armor, info_left+preview_xy+40, y+50+st*height_space); st++;
		//1st ability
		var value = "";
		if(TYPES[selected_tank].abilities[0] != undefined){
			function_name = TYPES[selected_tank].abilities[0].name.replace(/ /g,'_');
			value = TYPES[selected_tank].abilities[0].name + " - "+window[function_name]({abilities_lvl: [1,1,1], type: selected_tank}, true);
			}
		lib_show_stats("1st ability", value, info_left+preview_xy+40, y+50+st*height_space, true); st++;
		//2nd ability
		var value = "";
		if(TYPES[selected_tank].abilities[1] != undefined){
			function_name = TYPES[selected_tank].abilities[1].name.replace(/ /g,'_');
			value = TYPES[selected_tank].abilities[1].name + " - "+window[function_name]({abilities_lvl: [1,1,1], type: selected_tank}, true);
			}
		lib_show_stats("2nd ability", value, info_left+preview_xy+40, y+50+st*height_space, true); st++;
		//3rd ability
		var value = "";
		if(TYPES[selected_tank].abilities[2] != undefined){
			function_name = TYPES[selected_tank].abilities[2].name.replace(/ /g,'_');
			value = TYPES[selected_tank].abilities[2].name + " - "+window[function_name]({abilities_lvl: [1,1,1], type: selected_tank}, true);
			}
		lib_show_stats("3rd ability", value, info_left+preview_xy+40, y+50+st*height_space, true); st++;
		}
	}
function draw_library_maps(){
	draw_library_list(false);
	var y = TOP;
	var gap = 5;
	
	show_maps_selection(canvas_backround, y, true);
	}
