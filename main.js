var mainWidth, mainHeight, ChrtParems, ChrtUni, Format, svg_list;
const chartMaxLenght = 14;


Format = {
    Interior: {
        lines_map: {
            time:    "object", 
            columns: "object"
        },
        
        column: {
            title:   "string", 
            color:   "string",
            nodes:   "object"
        },
    }
};

// Universal object parameters. 
ChrtUni = {
    activeEl: {
		line_label: {
			element: null,
			active:  false,
            
            events: {
                mouseover: function() {
                    var obj = ChrtUni.activeEl.line_label.element.style;
                    
                    if (ChrtUni.activeEl.line_label.active) {return;}
                    function shaker(x) {
                        obj.transform = "rotateX(" + x + "deg)";
                        ChrtUni.activeEl.line_label.active = true;
                        
                        if (x < 360) {setTimeout(function() {shaker(x+1);}, 1);}
                        else         {ChrtUni.activeEl.line_label.active = false}
                    }
                    
                    shaker(0);
                },
            }
		},
		
		lines: {
			width:   null,
			
			events: {
				mouseover: function(event) {
					var val  = this.node.value,
						cur  = document.getElementById("ChartCursor"),
						obj  = this.node.getBoundingClientRect(),
                        elem = event.target;
					
					cur.style.visibility = "visible";
					cur.style.left		 = obj.x * 1.05;
					cur.style.top		 = obj.y;
                    cur.style.border     = "1px solid " + this.style.backgroundColor;
                    
					cur.style.color      = this.style.backgroundColor;
					cur.innerHTML        = val;
                    
                    elem.style.border = "0.5px solid " + elem.style.backgroundColor;
				},
				
				mouseleave: function() {
					var val  = this.node.value,
						cur  = document.getElementById("ChartCursor"),
                        elem = event.target;
					
					cur.style.visibility = "hidden";
                    elem.style.border    = "0";
				}
			}
		},
        
        input: {
            events: {
                change: function(event) {
                    var status = event.target.visible,
                        lines  = event.target.line;
                    
                    var visibility;
                    
                    if (status) {
                        visibility           = "hidden";
                        event.target.visible = false;
                    }
                    else {
                        visibility           = "visible";
                        event.target.visible = true;
                    }
                    
                    for (var n in lines) {lines[n].style.visibility = visibility;}
                },
            }
        },
	},
	
	line_chart: {
		type:	    		     "canvas",
        
		lineMargin: 		     [0.25, 0.5, 0.75],
		
		style: {
			position: 	         "absolute",
            
			left:	 	         "9%",
            top:          		 "9%",
			
			height:		 		 "57%",
			width: 			     "80%",
		}
	},
	
	lines: {
		type:	    		     "div",
		
		points:				     [],
		
		style:  {
			position: 	         "absolute",

			height:		 		 "4px",
		}
	},
		
	line_label: {
		type:				     "div",
		
		style: {
			position: 	         "absolute",
                
			top:		         "2.8%",
			left:	     	     "9%",
			
			padding:             "0% 1% 0% 1%",
			
            fontWeight:         "500",
			fontSize:	         "2em",
		}
	},
	
    node: {
		type:				 	"div",
			
		style: {	
			position:        	"absolute",
			
			visibility:			"hidden"
		}
    },
    
    lines_time_node: {
        type:				 	"p",
        
        style: {
            position:        	"absolute",
			top: 			 	"65%",
			
            padding:            "0% 0% 0% 0%",
            
            fontWeight:         "400",
            fontSize:        	"1.2em",
        }
    },
	
	value_node: {
        type:				 	"span",
        
        style: {
            position:        	"absolute",
            
            right:              "92%",
            
            fontWeight:         "700",
            textAlign:          "center",
            fontSize:        	"1.5em",
        } 
	},
	
	line_cursor: {
		type:				 	"div",
		
		style:  {
			position:           "absolute",
			
			top:		        "11%",
			left: 			 	"90%",
			
			paddingTop:         "1%",
			
            padding:            "1% 1% 1% 1%",
			textAlign:			"center",
			fontSize:			"1.5em",
			
            borderRadius:       "100%",
            
			visibility: 		"hidden"
		}
	},
    
    line_chekbox: {
        type:				 	"div",
		
		style:  {
			position:           "relative",
			
			top:		        "72%",
			left: 			 	"10%",
            
            fontSize:           "2.3em",
            fontWeight:         "bold",
		}
    },
    
    input: {
        type:				 	"input",
		
		style:  {
            position:           "absolute",
            
            top:                "25%",
            left:               "3.2%",
            
            height:             "2em",
            width:              "2em",
		}    
    },
    
	fontSize: Math.round(screen.width * 0.02),
}

// Special object parameters. 
ChrtParems = {
	white: {
		line_chart: {
			lineColor:  		 "#E6E6FA",
			lineMargin: 		 ChrtUni.line_chart.lineMargin,
			
			style: {
				border:          "5px groove #9932CC"
			}
		},
		
		line_label: {
			style: {
				backgroundColor: "White",
				border:          "2px solid Black"
			}
		},
        
        node: {
			style: {
			}
		},
        
        lines_time_node: {
            style: {
				color:        	 "#120A2A",
			}
        },
		
		value_node: {
			style:  {
				color:        	 "Black",
			}
		},
		
		lines: {
			style:  {}
		},
		
		line_cursor: {
			style: {
                backgroundColor:    "White",
			}
		},
        
        line_chekbox: {
            style: {
            }
        },
        
        input: {
            style: {
                backgroundColor: "white",
            }
        },
	},
	
	black: {
	}
}


class JsonConverter {
    del_first(l) {
        return l.slice(1, l.length)
    }
    
    _optimizer(max) {
        var x0 = Math.round(max*0.01),
            x1 = Math.round(max*0.25),
            x2 = Math.round(max*0.5),
            x3 = Math.round(max*0.50),
            x4 = Math.round(max*0.75);
        
        return [x0, x1, x2, x3, x4, max];
    }
    
    listGenerator(start=0, end=0) {
        var result = [],
            point  = start;
        
        do {
            result.push(point);
            point += 1;
            
        } while(point < end)
             
        return result;
    }        
    
    vals_from_json(list) {
        var self   = this,
            result = [];
        
        list.forEach(function(elem) {result.push(self.del_first(elem));})
        return result;
    }
    
    _vals_list(list) {
        var curent = [],
            self   = this;
        
        for (var i in list) {curent = curent.concat(list[i]);}
        var max = Math.max(...curent),
            min = Math.min(...curent);

        return [min, self._optimizer(max)];
    }
    
    time_from_unix(list) {
        var result = {
                hours: [], 
                month: [],  
                years: []
        },
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        list = this.del_first(list);
        for (var t in list) {
            var time = new Date(list[t])
            
            result.hours.push(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " " + (time.getMonth()+1) + time.getDay());
            result.month.push(months[time.getMonth()] + " " + time.getFullYear());
            result.years.push(time.getFullYear());
        }
        
        result.month = Array.from(new Set(result.month));
        result.years = Array.from(new Set(result.years));
        
        return result;
    }
}


class BaseGeometry {
    
	returnNorm(x) {
		if (x < 0) {x = x*-1}
		
		return x
	}
	
    calcFromLarger(y, x) {
        if (x > y) {return x - y;}
        else       {return y - x;}
    }
    
    sineToDegree(y, x) {
        var alpha;
        
        alpha = Math.atan2(y, x);
        return (Math.PI - alpha)*(180/Math.PI);
    }
    
    rightTriangle(tofind, a, b) {
        var current;
        
        if      (tofind == 'a') {current = a * Math.sin(b);}
        else if (tofind == 'b') {current = a * Math.cos(b);}
        else if (tofind == 'c') {current = Math.sqrt((a**2) + (b**2));}
        
        if (current < 0) {return -current;}
        else             {return current;}
    }
	
	left_coeff(master_width, slave_width, coef) {
		var percent = master_width/100,
			curent  = percent * slave_width,
			result  = curent / coef;
		
		return result;
	}
    
    _top_formula(master, value, constant) {
		/* Class MyChart method _X_line_create.

	   require parameters: 
		   self     - object  - this object;
		   constant - number  - element with 100% hight position;
		   value    - number  - element with another position.

	   description: 
		   Find height position for val use constant position.

		*/
		
		var procent, result;
		var rect = master.getBoundingClientRect();
		
		procent = rect.height / 100;
		result  = (rect.bottom - (procent*(value / (constant/100))));

		return result;
	}
}


class Error {
    diction = [
        "Array: %, key: % isn't exists, please, read module doc for interior format.",
        "Object %, in interior format, must be %. Yours %."
    ]
    
    constructor(number, args=null, fatal=true) {
        /* Class Error method constructor.
               require parameters:
                   number - int         - number of Array 'diction' element.
                
		       optional: 
			       args   - Array(list) - list with some data to format in error.
                   fatal  - boolean     - should stop JS with this error or not.
			   
               description:
				    create new error and return in console.
					
		*/
        
        var msg = this.diction[number];
        
        function parse() {
            var List = msg.split("%"),
                txt  = "",
                step = 0;
            
            args.forEach(
                function(elem) {
                    txt   = txt + List[step] + "'" + elem + "'";
                    step += 1;
                }
            );

            return txt + List[step];
        }
        
        if (args) {msg = parse();}

        if (fatal) {throw msg;}
        else       {console.error(msg);}
    }
}


class MyChart {
    converter = new JsonConverter()
    
    constructor(
			height = screen.height * 0.9, 
			width  = screen.width,
			style  = "white", 
			svg    = document.getElementById("BaseSVG"),
			master = document.getElementsByTagName("body")[0]
		) {
		/* Class MyChart Method constructor.

		       optional parameters: 
			       height - int - new frame height;
			       width  - int - new frame width;
			       style  - str - chart colors style from ChrtParems diction;
			       svg    - str - id object SVG from page.
			   
			   description:
				    constructor, create base carcass for chart.
					
		*/
		
		this.ChrtParems = ChrtParems[style];
		this.master     = master;
		this.plate	    = document.createElement("div");
		this.geometry   = new BaseGeometry();
        
		this.plate.style.position = "relative";
		this.plate.style.height   = this.height = height;
		this.plate.style.width    = this.width  = width;
	}
	
	create_chart(map, title="NewFrame", type="lines") {
		/* Class MyChart Method _frame_create.
			   require parameters: 
				    map - object - special Json or interior diction.
					
			   optional parameters: 
				   title    - str     - chart name;
				   interior - boolean - is map interior format or json;
				   type     - str	  - str with chart style.
				    
			   description: 
				   Method create element for chart;
				   Create chart and other elements for this.   

		*/
		
		this.master.appendChild(this.plate);
		
		if (type == "lines") {
			var lable_type = "line_label";
			this.chart = this._create_lines_frame();
            this._create_lines_chart(map);
		}
		
		this._create_element(lable_type, this.plate, title);
	}
	
	_create_lines_frame() {
		/* Class MyChart Method _create_lines_frame.
			   
			   description: 
				   Create LineChart.  

		*/
		
		var chart, linecolor, lineMargin, cursor;
		
        chart      = this._create_element("line_chart", this.plate);  	// Chart.						// Context for painting.	
        linecolor  = this.ChrtParems["line_chart"]["lineColor"];    // Color of  chart line.
		lineMargin = this.ChrtParems["line_chart"]["lineMargin"];	// Margin on chart lines.
		
		for (var elem in lineMargin) {
			this._paint(chart, chart.height * lineMargin[elem], chart.width,  linecolor);
			this._paint(chart, chart.width  * lineMargin[elem], chart.height, linecolor, false);
		} // Paint chart for chart.
		
		this.type = "lines";
		this.polylines = [];

		return chart;
	}
	
	_paint(elem, pos, iLong, color, horizontal=true, moveto=false) {
		/* Class MyChart Method _paint.
		
			   require parameters: 
				   elem        - object  - html collection element;
			       pos         - number  - start position on context;
				   iLong       - number  - line long;
				   color       - object  - line color.
			
			   optional:   
			        horizontal - boolean - create horizontal or vertical line.
					
			   description: 
				   Create line in draw element.

		*/
		
		var ctx = elem.getContext("2d");
        
		function draw(step){
			if (horizontal) {ctx.strokeRect(step, pos, 0.1, 0.1);}
			else 			{ctx.strokeRect(pos, step, 0.1, 0.1);}
			
			ctx.stroke();
			if (step < iLong) {setTimeout(function() {draw(step+1);}, 1)} // For animation.
		}
		
		
		ctx.strokeStyle = color; 
		
		if (moveto) {ctx.moveTo(moveto[0], moveto[1]);}
		draw(2);
		ctx.closePath();
	}
	
	_create_element(type, master, value=false) {
		/* Class MyChart Method _create_element.
		   
		       require parameters: 
				   type    - str     - str with keys from ChrtParems;
			       master  - object  - object HTML collection.
			
			   optional:   
			        value   - str\... - value for inner on new element.
			
			description:
				method create new element with parameters from module special diction.
				
		*/
		
		var style   = this.ChrtParems[type]["style"],
			unStyle = ChrtUni[type]["style"],
			elem    = document.createElement(ChrtUni[type]["type"]);
		
		for (var x in style)   {elem.style[x] = style[x];}
		for (var y in unStyle) {elem.style[y] = unStyle[y];}
		
		if (value) {elem.innerHTML = value}
		
		if (type in ChrtUni["activeEl"]) {
			var obj = ChrtUni["activeEl"][type];
			obj.element = elem;
			
			for (var i in obj.events) {elem.addEventListener(i, obj.events[i]);}
		}
		
		master.appendChild(elem);
		return elem;
	}
	
	_create_lines_chart(map) {
        /* Class MyChart Method _create_lines_chart.
		
			   require parameters: 
				   map - object  - special inter format chart data;

			   description: 
				   Parse data and paint chart nodes.

		*/

        var time  = this.converter.time_from_unix(map["columns"][0]),
            vals  = this.converter.vals_from_json(map["columns"].slice(1, map["columns"].length)),
            nodes = map["columns"].slice(1, map["columns"].length);
        
        this._X_line_create(time, this.chart.getBoundingClientRect().left, "lines_time_node");
        this._Y_line_create(vals, "value_node");
               
        for (var n in nodes) {
            var node   = nodes[n],
                name   = node.shift(),
                title  = map["names"][name],
                color  = map["colors"][name],
                points = this._points_create(node),
                line   = this._line_generate(points, color),
                chBox  = this._checkbox_create("line_chekbox", line, title, color);
        }
        this._cursor_create("line_cursor");
    }
    
    _checkbox_create(type, line, name, color) {
        var elem = this._create_element(type, this.plate, name),
            inp  = this._create_element("input", elem);
        
        elem.style.color = color;
        
        inp.type    = "checkbox";
        inp.line    = line;
        inp.visible = true;
        inp.checked = true;
        
        return inp;
    }
    
    _cursor_create(type) {
        var cursor = this._create_element(type, this.plate);
        cursor.id  = "ChartCursor";    
        
        return cursor;
    }
    
    _points_create(list) {
        var bottom = this.chart.getBoundingClientRect().bottom,
            left   = this.chart.getBoundingClientRect().left * 0.93,
            coef   = this.geometry.left_coeff(this.width, eval(this.chart.style.width.split("%")[0]), list.length),
            points = [],
            max    = Math.max(...list);
        
        if (max > 100000) {left *= 0.98}
        for (var n in list) {
            var node = this._create_element("node" ,this.plate);
            
            node.value      = list[n];
            node.style.left = left;
            node.style.top  = this.geometry._top_formula(this.chart, list[n], this.maxVal)*0.98;

            left += coef;
            points.push(node);
        }
        
        return points;
    }
    
    _Y_line_create(diction, type="value_node") {
        var parse  = this.converter._vals_list(diction),
            curent = parse[1],
            rect   = this.chart.getBoundingClientRect(),
            nodes  = [];
            
        this.maxVal = curent[curent.length - 1];
        this.minVal = parse[0];
        
        for (var i in curent) {
            var node = this._create_element(type,  this.plate, curent[i]),
                coef = curent[i],
                top  = this.geometry._top_formula(this.chart, coef, this.maxVal)*0.93;
            
            node.style.top = top;
            nodes.push(node);
        }
        
        return nodes;
    }
    
    _data_check(diction, constant) {
		/* Class MyChart method _data_check.
		   
		   require parameters: 
			   diction  - object - object with data for check;
			   constant - object - object with constant data format.
			   
		   optional:
			   format   - string - interior format document or else.
			
			description:
				compare diction interior key format with constant value.
				
		*/
		
        for (var i in constant) {
            if (!(i in diction)) {
                new Error(0, ["map", i]);
            }
            if (!((typeof diction[i]) == constant[i])) {
                new Error(1, [i, constant[i], typeof diction[i]]);
            }
        }
        
        return diction
    }
	
    _X_line_create(diction, point, type) {
		/* Class MyChart method _X_line_create.
		
			   require parameters: 
				   diction - object  - array with nodes data;
				   point   - number  -start position.
                   
			   description: 
				   Create lines element.

		*/
        
        var self = this;
        point += this.geometry.left_coeff(self.width, eval(self.chart.style.width.split("%")[0]), diction.hours.length)
        
        for (var cat in diction) {
            
            if (diction[cat].length < chartMaxLenght) {
                var left = point,
                    coef = this.geometry.left_coeff(self.width, eval(self.chart.style.width.split("%")[0]), diction[cat].length);

                for (var n in diction[cat]) {
                    var node = self._create_element(type, this.plate, diction[cat][n]);
                        
                    node.style.left = left;
                    left += coef;
                }
                break
            }
        }
	}
	
	_line_generate(points, color) {
		var list = [];
        
        for (var n in points) {
			if (eval(n)+1 < points.length & eval(n)+1 > 0) {
				var p1 = points[n].getBoundingClientRect(),
                    p2 = points[eval(n)+1].getBoundingClientRect();
                    
                var y1 = p1.top,
                    y2 = p2.top,
                    x1 = p1.left,
                    x2 = p2.left,
                    h  = this.geometry.calcFromLarger(y1, y2),
                    v  = this.geometry.calcFromLarger(x1, x2),
                    c  = this.geometry.rightTriangle('c', h, v);
				
                var line  = this._create_element("lines", this.plate),
					angle = this.geometry.sineToDegree(h, v);
					
				line.style.background = color
                if (y1 < y2) {angle = -this.geometry.sineToDegree(h, v);}
                
                line.style.transform = "rotate(" + angle + "deg)";

                line.style.left  = ((x1+x2)/2) - c/2;
                line.style.top   = (y1+y2)/2;
				line.style.width = c;
				line.node 		 = points[n];
                
                list.push(line);
            }
		}
        
        return list;
	}
    
    del() {
        while (this.plate.firstChild) {this.plate.removeChild(this.plate.firstChild);}
        document.body.removeChild(this.plate);
    }
}