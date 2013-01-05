/*gridzly grid system
 *author: austin
 *2012 Dyologic
 *MIT License
 */


  (function($){
    var defaults = {
        recordsUrl : "php/gridzly.php", //where to get records JSON
        maxRecordsShowing : "50",
        shadow : true,
        colHeaders : true
        
    };
    
    var methods = {
        opts : null,
        rows : 0,
        done : false,
        gridWidth : null,
        style : null,
        rowWidth : null,
        grid : null,
        init : function(opts){
            this.opts = opts;
            var self = this;
            var baseHtml = this.buildHtml(opts.id);
            
            $(opts.el).append(baseHtml);
            $('#'+opts.id).css({'width' : opts.width}); //set fixed width
            this.gridWidth = opts.width;
            var gettingRecords = this.addRecords(opts.maxRecordsShowing,opts.id,opts.recordsUrl);
            gettingRecords.success(function(data){
                var o = JSON.parse(data);
            var recordObject = self.prep(o); //has rows and colHead if applicable
            this.grid =  $('#'+opts.id).find('.gridzlyGrid-inner');
            $grid = this.grid;
            
            if(opts.gridTitle !== undefined){
               $grid.append('<div class="gridzlyGridTitle"><span>'+opts.gridTitle+'</span></div>');
            }
            if(opts.filter !== undefined){
               if($grid.find('.gridzlyGridTitle').length !== 0){ //adding the filter if the title exists
                 $grid.find('.gridzlyGridTitle').append('<input type="text" class="gridzlyGridTitle-filter">');
               }else{
                $grid.append('<div class="gridzlyGridTitle"></div>');
                $grid.find('.gridzlyGridTitle').append('<input type="text" class="gridzlyGridTitle-filter">');
               }
            }
            if(recordObject.colHead !== undefined){
                $grid.append('<div class="gridzlyHeadRow">'+recordObject.colHead+'</div>');
            }
                      $grid.append('<div class="gridzlyGrid-innerRows">'+recordObject.rows+'</div>');
                      self.bind($grid);
                });
            },
        buildHtml : function(id){
        var html = "<div id='"+id+"' class='gridzlyGrid'><div class='gridzlyGrid-inner'></div></div>";
        return html;
        },
        prep : function(o){
            var rowHtml = "";
            if(this.opts.colHeaders){
            var headerHtml = "";
            var colNum = 0;
             for(var x = 0; x<o.colHeaders.length; x++){
              colNum++;
                var h = "<div class='gridzly-header row-"+colNum+"'>"+o.colHeaders[x]+"</div>"; //loops through for the headers
                headerHtml += h;
             }
          
            }
            rNum = o.rows[0].length+1;
            for(var y = 0; y<o.rows.length; y++){
                var rowHolder = "<div class='rowHolder' value='"+this.rows+"'>"; //loops through for the rows
                for(var r = 0; r<o.rows[y].length; r++){
                  var grNum = 0;
                    for(var j in o.rows[y]){
                      grNum++;
                        var r = "<div class='gridzly-row row-"+grNum+"'>"+o.rows[y][j]+"</div>";
                       rowHolder += r;
                    }
               
                }
                
                rowHolder += "</div>";
                rowHtml += rowHolder;
                  this.rows++; //iterate the num of rows
            }
            this.rNum = rNum;
              console.log(rNum);
            var spl = Number(this.gridWidth.split('px')[0]);
            this.rowWidth = (spl)/(rNum)/spl*100; //automatic resizing columns
            $("<style>.gridzly-row,.gridzly-header { width: "+this.rowWidth+"%; }</style>").appendTo(document.getElementsByTagName("head"));
            return {"colHead" : headerHtml, "rows" : rowHtml};
        },
        bind : function($grid){
          var self = this;
          var id = $grid.attr('id');
        $grid.delegate('.gridzly-row', 'click', function(){
          var nClass = $(this).attr('class').split(' ')[1];
          var head = document.getElementsByTagName('head');
          $('.gridzly-temp').empty().remove();
          var grw = Number(self.gridWidth.split('px')[0]);
          var ggw = (0.3*grw);
        console.log(ggw);
          var grWidth = (grw-ggw); //maths to get new row widths
          var total = (grWidth)/(self.rNum);
          $(head).append('<style class="gridzly-temp">.'+nClass+'{width : '+ggw+'px !important;}\
                         .gridzly-row,.gridzly-header{width : '+total+'px;}</style>')
          });
         $(document).click(function(e){
          if(e.target.className.match(/gridzly/g)){
            
          }else{
            $('.gridzly-temp').empty().remove();
          }
          });
          $grid.parent().data().load = true;
      
         $grid.find('.gridzlyGrid-innerRows').scroll(function(e){
          var parent = $(this).parents('.gridzlyGrid');
          console.log(parent.data().load);
           if($(this)[0].offsetHeight + $(this)[0].scrollTop == ($(this)[0].scrollHeight-5)){
            if(parent.data().load){
              self.addRow(parent.find('.rowHolder:last-child').attr('value'),$(this));
               parent.data().load = false;
               }
           }
          });
        },
        addRow : function(row,el){
          var parent = el.parents('.gridzlyGrid');
            console.log( parent.data())
           parent.data().load = true;
              console.log(parent)
            el.append('<div class="gridzly-loading">Loading</div>');
            
           
            console.log( parent.data())
        },
        destroy : function(id){ //will be exported as public method
            console.log(id);
            
        },
        addRecords : function(number,id,url){
            console.log(url);
            var rec = $.post(url,{"getRecords" : number},"json");
            return rec;
            
        },
        slide : function(){
            
            
        }
    };
    
    $.fn.gridzly = function(opts){
        var id = "gridzly_"+Math.round(Math.random()*9000); //generate new id for the grid
        opts.id = id;
        opts.el = this;
        var nOpts = $.extend(opts,defaults); //extending and sending
        methods.init(nOpts);
        return {destroy : function(){ methods.destroy(id); }}
    };
    
    }(jQuery));