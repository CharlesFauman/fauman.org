var currentScript = document.currentScript || (function() {
  var scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();
var currentParent = currentScript.parentElement.id

var sketch = function(p) {
  var background_fill = p.color(255, 255, 255);

  var alert_box_fill = p.color(230, 230, 230);
  var alert_box_text_fill = p.color(0, 0, 0);

  var normal_tile_fill = p.color(255, 255, 255);
  var normal_selected_tile_fill = p.color(132, 177, 249);
  var permanent_selected_tile_fill = p.color(100, 0, 100);
  var permanent_tile_fill = p.color(200, 200, 200);
  var hovered_tile_fill = p.color(0, 100, 0);

  var normal_text_fill = p.color(0, 0, 0);

  var number_colors = [
  p.color(206,86,33), p.color(82,127,132), p.color(143,127,67),
  p.color(245, 161, 11), p.color(192,0,0), p.color(39,79,71),
  p.color(47,41,51), p.color(205,0,103), p.color(228, 108, 11)
  ];

  var colored_numbers, sounds, default_little_numbers;

  var permanents = Array.from({ length: 9 }, () => new Array(9).fill(0));

  var numbers = Array.from({ length: 9 }, () => new Array(9).fill(0));

  var little_numbers_activated = Array.from({ length: 9 }, () => new Array(9).fill(false));
  var little_numbers = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Array(9).fill(false)));

  var verticals = Array.from({ length: 9 }, () => new Array(9).fill(false));
  var horizontals = Array.from({ length: 9 }, () => new Array(9).fill(false));
  var squares = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new Array(9).fill(false)));

  var tile_size;
  var normal_text_size;
  var little_text_size;

  var selected;

  var selected_x, selected_y, hovered_x, hovered_y;

  var alert_box_text;

  getTileFromMousePos = function(){
    var x = (p.mouseX - (p.mouseX % tile_size))/tile_size;
    var y = (p.mouseY - (p.mouseY % tile_size))/tile_size;
    return [x,y];
  }

  p.setup = function(){
    p.createCanvas(600, 725);

    colored_numbers = true;
    default_little_numbers = false;
    
    p.textAlign(p.CENTER);
    p.textFont('Georgia');
    
    alert_box_text = "";
    
    tile_size = p.width/9 - 1/9;
    normal_text_size = 2*tile_size/3;
    little_text_size = normal_text_size/3;
    selected = false;
    shift_is_down = false;

    var div = p.createDiv();
    div.parent(currentParent);

    button = p.createButton('random');
    button.size(p.width/3 - 2, 100);
    button.parent(div);
    button.style('font-size', '18px');
    button.style('background-color', p.color(0));
    button.style('color', p.color(255));
    button.mousePressed(random_board);

    button = p.createButton('reset');
    button.size(p.width/3 - 2, 100);
    button.parent(div);
    button.style('font-size', '18px');
    button.style('background-color', p.color(0));
    button.style('color', p.color(255));
    button.mousePressed(reset_board);

    button = p.createButton('check');
    button.size(p.width/3 - 2, 100);
    button.parent(div);
    button.style('font-size', '18px');
    button.style('background-color', p.color(0));
    button.style('color', p.color(255));
    button.mousePressed(check_board);

    random_board();
  }

  random_board = function(){
    var board_num = Math.floor(p.random(50));
    load_board("data/boards/board_"+ board_num + ".txt");
  }

  p.draw = function(){
    p.background(background_fill);
    p.push();

    p.translate(0, 25);
    var hovered_pos = getTileFromMousePos();
    hovered_x = hovered_pos[0];
    hovered_y = hovered_pos[1];
    p.strokeWeight(1);
    for(var x = 0; x < 9; ++ x){
      for(var y = 0; y < 9; ++ y){
        if(selected && x == selected_x && y == selected_y){
          if(permanents[x][y]){
            p.fill(permanent_selected_tile_fill);
          }else{
            p.fill(normal_selected_tile_fill);
          }
        }else if(x == hovered_x && y == hovered_y){
          p.fill(hovered_tile_fill);
        }else{
          if(permanents[x][y]){
            p.fill(permanent_tile_fill);
          }else{
            p.fill(normal_tile_fill);
          }
        }
        p.stroke(0, 0, 0);
        p.rect(x*tile_size, y*tile_size, tile_size, tile_size);
        
        if(numbers[x][y] != 0){
          p.textSize(normal_text_size);
          if(colored_numbers) p.fill(number_colors[numbers[x][y]-1]);
          else p.fill(normal_text_fill);
          p.text(numbers[x][y], x*tile_size + tile_size/2, y*tile_size + tile_size/2 + normal_text_size/3);
        }else if(little_numbers_activated[x][y]){
          p.stroke(200, 200, 200);
          p.line(x*tile_size + .5, y*tile_size + tile_size/3, (x+1)*tile_size - .5, y*tile_size + tile_size/3);
          p.line(x*tile_size + .5, y*tile_size + 2*tile_size/3, (x+1)*tile_size - .5, y*tile_size + 2*tile_size/3);
          p.line(x*tile_size + tile_size/3, y*tile_size + .5, x*tile_size + tile_size/3, (y+1)*tile_size - .5);
          p.line(x*tile_size + 2*tile_size/3, y*tile_size + .5, x*tile_size + 2*tile_size/3, (y+1)*tile_size - .5);
          
          p.textSize(little_text_size);
          p.fill(normal_text_fill);
          for(var n = 0; n < 9; ++ n){
            if(little_numbers[x][y][n]){
              if(colored_numbers) p.fill(number_colors[n]);
              p.text(n+1, x*tile_size + tile_size*((n%3)*2+1)/6, y*tile_size + tile_size*(Math.floor(n/3)*2+1)/6 + little_text_size/3);
            }
          }
        }
      }
    }
    
    var big_line_width = 5;
    p.strokeWeight(big_line_width);
    p.stroke(0, 0, 0);
    p.line(big_line_width/2, 3*tile_size,tile_size*9 - big_line_width/2, 3*tile_size);
    p.line(big_line_width/2, 6*tile_size,tile_size*9 - big_line_width/2, 6*tile_size);
    p.line(6*tile_size, big_line_width/2, 6*tile_size,tile_size*9 - big_line_width/2);
    p.line(3*tile_size, big_line_width/2, 3*tile_size,tile_size*9 - big_line_width/2);
    
    p.fill(alert_box_fill);
    p.rect(tile_size*.25, tile_size*9.25, tile_size*8.5, tile_size*1);
    p.fill(alert_box_text_fill);
    p.textSize(normal_text_size);
    p.text(alert_box_text, tile_size*9/2, tile_size*10);
    

    p.pop();
  }

  onBoard = function(x, y) {
    return !(x < 0 || y < 0 || x >= 9 || y >= 9);
  }
  
  validNum = function(num) {
    return !(num <= 0 || num > 9);
  }

  deleteMove = function(x, y) {
    if(!onBoard(x, y)) return false;
    if(numbers[x][y] == 0) return false;
    verticals[x][numbers[x][y]-1] = false;
    horizontals[y][numbers[x][y]-1] = false;
    squares[Math.floor(x/3)][Math.floor(y/3)][numbers[x][y]-1] = false;
    numbers[x][y] = 0;
    return true;
  }
    
  canPlayMove = function(x, y, num) {
    if(!onBoard(x, y) || !validNum(num)) return false;
    
    return !(verticals[x][num-1] || horizontals[y][num-1] || squares[Math.floor(x/3)][Math.floor(y/3)][num-1]);
  }

  playMove = function (x, y, num) {
    if(!canPlayMove(x, y, num)) return false;
    if(numbers[x][y] != 0) deleteMove(x, y);
    numbers[x][y] = num;
    verticals[x][numbers[x][y]-1] = true;
    horizontals[y][numbers[x][y]-1] = true;
    squares[Math.floor(x/3)][Math.floor(y/3)][numbers[x][y]-1] = true;
    return true;
  }


  board_is_solved = function(){
    for(var x = 0; x < 9; ++x) {
        for(var y = 0; y < 9; ++y) {
          if(numbers[x][y] == 0) return false;
        }
      }
    return true;
  }

  check_board = function(){
    if(board_is_solved()){
      alert_box_text = "It is solved!";
    }else{
      alert_box_text = "Sorry, incorrect :(";
    }
  }

  save_board = function(){
    if(current_file == null){
      alert_box_text = "no file is open";
      return;
    }
    var strings = new Array(29);
    var current_string;
    for(var y = 0; y < 9; ++y){
      current_string = "";
      for(var x = 0; x < 9; ++x){
        current_string += numbers[x][y] + " ";
      }
      strings[y] = current_string;
    }
    strings[9] = "";
    for(var y = 0; y < 9; ++y){
      current_string = "";
      for(var x = 0; x < 9; ++x){
        current_string += (permanents[x][y] ? 1 : 0) + " ";
      }
      strings[y+10] = current_string;
    }
    
    strings[19] = "";
    for(var y = 0; y < 9; ++y){
      current_string = "";
      for(var x = 0; x < 9; ++x){
        for(var n = 0; n < 9; ++n){
          current_string += (little_numbers[x][y][n] ? 1 : 0) + "-";
        }
        current_string += " ";
      }
      strings[y+20] = current_string;
    }
    saveStrings(current_file, strings);
    alert_box_text = "saved!";
  }

  clear_board = function(){
    permanents = Array.from({ length: 9 }, () => new Array(9).fill(0));

    numbers = Array.from({ length: 9 }, () => new Array(9).fill(0));

    little_numbers_activated = Array.from({ length: 9 }, () => new Array(9).fill(false));
    little_numbers = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Array(9).fill(false)));

    verticals = Array.from({ length: 9 }, () => new Array(9).fill(false));
    horizontals = Array.from({ length: 9 }, () => new Array(9).fill(false));
    squares = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => new Array(9).fill(false)));

  }

  reset_board = function(){
    selected = false;
    for(var x = 0; x < 9; ++ x){
      for(var y = 0; y < 9; ++ y){
        if(!permanents[x][y]){
          deleteMove(x, y);
          for(var n = 0; n < 9; ++n) little_numbers[x][y][n] = false;
          little_numbers_activated[x][y] = default_little_numbers;
        }
      }
    }
    alert_box_text = "board reset";
  }

  load_board = function(file){
    if(file == null) return;
    current_file = file;
    p.loadStrings(file, load_board_callback);
  }

  load_board_callback = function(lines){
    clear_board();
    for(var y = 0; y < 9; ++y) {
      var line = lines[y];
      var nums = line.split(" ");
      for(var x = 0; x < 9; ++x) {
        var num = parseInt(nums[x]);
        if(num != 0){
          playMove(x, y, num);
          little_numbers_activated[x][y] = false;
        }
      }
    }
    var offset = 9;
    if(lines.length < 19) offset = 0;
    for(var y = 0; y < 9; ++y) {
      var line = lines[y + offset];
      var nums = line.split(" ");
      for(var x = 0; x < 9; ++x) {
        var num = parseInt(nums[x]);
        if(num != 0){
          permanents[x][y] = true;
        }
      }
    }
    
    if(lines.length >= 29){
      for(var y = 0; y < 9; ++y) {
        var line = lines[y + 2*offset];
        var num_strings = line.split(" ");
        for(var x = 0; x < 9; ++x) {
          var num_string = num_strings[x].split("-");
          var empty = true;
          for(var n = 0; n < 9; ++n) {
            little_numbers[x][y][n] = (num_string[n].equals("1"));
            if(little_numbers[x][y][n]) empty = false;
          }
          if(!empty){
            little_numbers_activated[x][y] = true;
          }
        }
      }
    }
    
    selected = false;
    alert_box_text = "loaded!";
  }

  set_default_little_numbers = function(target){
    if(target){
      default_little_numbers = true;
      alert_box_text = "the littles are out!";
      for(var x = 0; x < 9; ++x){
        for(var y = 0; y < 9; ++y){
          if(!little_numbers_activated[x][y] && numbers[x][y] == 0) little_numbers_activated[x][y] = true;
        }
      }
    }else{
      default_little_numbers = false;
      alert_box_text = "bye bye little ones";
      for(var x = 0; x < 9; ++x){
        for(var y = 0; y < 9; ++y){
          if(little_numbers_activated[x][y]){
            var empty = true;
            for(var n = 0; n < 9; ++n){
              if(little_numbers[x][y][n]){
                empty = false;
                break;
              }
            }
            if(empty) little_numbers_activated[x][y] = false;
          }
        }
      }
    }
  }

  p.keyPressed = function(){
    if(p.keyCode == p.TAB){ // tab
      set_default_little_numbers(!default_little_numbers);
    }else if(p.key == ' '){
      selected = false;
      alert_box_text = "";
    }
    else if(selected){
      if(p.keyCode == p.UP_ARROW || p.key == 'W'){ // up
        if(selected && onBoard(selected_x, selected_y-1)) selected_y -= 1;
      }else if(p.keyCode == p.DOWN_ARROW || p.key == 'S'){ // down
        if(selected && onBoard(selected_x, selected_y+1)) selected_y += 1;
      }else if(p.keyCode == p.LEFT_ARROW || p.key == 'A'){ // left
        if(selected && onBoard(selected_x-1, selected_y)) selected_x -= 1;
      }else if(p.keyCode == p.RIGHT_ARROW || p.key == 'D'){ // right
        if(selected && onBoard(selected_x+1, selected_y)) selected_x += 1;
      }else if(permanents[selected_x][selected_y]){
        alert_box_text = "can't edit that square";
      }else if(p.keyCode == p.SHIFT){ // ctrl-r
        if(little_numbers_activated[selected_x][selected_y]){
          for(var n = 0; n < 9; ++n){
            little_numbers[selected_x][selected_y][n] = false;
          }
          little_numbers_activated[selected_x][selected_y] = false;
        }else{
          deleteMove(selected_x, selected_y);
          little_numbers_activated[selected_x][selected_y] = true;
        }
      }
      else if(!isNaN(p.key) || p.keyCode == p.BACKSPACE || p.keyCode == p.DELETE){ // delete and backspace
        if(permanents[selected_x][selected_y]){
          alert_box_text = "can't edit that square";
        }else{
          var num = parseInt(p.key);
          if(little_numbers_activated[selected_x][selected_y]){
            if(num == 0 || p.keyCode == 127 || p.keyCode == 8){
              for(var n = 0; n < 9; ++n) little_numbers[selected_x][selected_y][n] = false;
            }else{
              little_numbers[selected_x][selected_y][num-1] = !little_numbers[selected_x][selected_y][num-1];
            }
          }else if(num == 0 || p.keyCode == p.BACKSPACE || p.keyCode == p.DELETE){
            
            if(!deleteMove(selected_x, selected_y)){
              alert_box_text = "you can't delete nothing!";
            }
            
          }else{
            
            if(numbers[selected_x][selected_y] == num){
              alert_box_text = "no change :P";
            }else if(!playMove(selected_x, selected_y, num)){
              alert_box_text = "can't play that";
            }else{
              // success
            }
            
          }
        }
      }
    }
  }

  p.mousePressed = function(){
    var tile_pos = getTileFromMousePos();
    if(onBoard(tile_pos[0], tile_pos[1])){
      selected = true;
      selected_x = tile_pos[0];
      selected_y = tile_pos[1];
      alert_box_text = "";
    }
  }



};

new p5(sketch, currentParent);