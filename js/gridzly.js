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
            
            this.grid =  $('#'+opts.id).find('.gridzlyGrid-inner');
            $grid = this.grid;
            var dat = $grid.parent().data();
            dat.title = opts.gridTitle;
            dat.id = opts.id;
            dat.opts = opts;
            if(opts.gridTitle !== undefined){
               $grid.append('<div class="gridzlyGridTitle"><span>'+opts.gridTitle+'</span></div>');
            }
            if(opts.filter !== undefined){
               if($grid.find('.gridzlyGridTitle').length !== 0){ //adding the filter if the title exists
                 $grid.find('.gridzlyGridTitle').append('<span class="gridzlyGridTitle-filter"><i class="gridzly-sIco"></i><input type="text"></span>');
               }else{
                $grid.append('<div class="gridzlyGridTitle"></div>');
                $grid.find('.gridzlyGridTitle').append('<input type="text" class="gridzlyGridTitle-filter">');
               }
            }
            var recordObject = self.prep(o); //has rows and colHead if applicable
            if(recordObject.colHead !== undefined){
                $grid.append('<div class="gridzlyHeadRow">'+recordObject.colHead+'</div>');
            }
            self.addInnerRows($grid,recordObject);
                               
                      self.bind($grid);
                      
                         self.addRow(5,$grid.parent().find('.gridzlyGrid-inner'), "Load More");
                });
            },
        buildHtml : function(id){
        var html = "<div id='"+id+"' class='gridzlyGrid'><div class='gridzlyGrid-inner'></div></div>";
        return html;
        },
        addInnerRows : function($grid,recordObject){
          $('.gridzly-temp').empty().remove();
          var self = this;
            $grid.find('.gridzlyGrid-innerRows').remove();
            if($grid.find('.gridzlyGrid-inner')[0] === undefined){
            $grid.append('<div class="gridzlyGrid-innerRows">'+recordObject.rows+'</div>');

            }else{
               $grid.find('.gridzlyGrid-inner').append('<div class="gridzlyGrid-innerRows">'+recordObject.rows+'</div>');
            }
                                 var isIt = self.checkOverflow($grid.find('.gridzlyGrid-innerRows')[0]);
                             
                                 if(isIt == true){
                                  $grid.find('.gridzlyHeadRow').css({"overflow-y" : "scroll"});
                                 }else{
                                  self.addRow(5,  $grid.find('.gridzlyGrid-inner'), "Load More");
                                   $grid.find('.gridzlyHeadRow').css({"overflow-y" : "hidden"});
                                 }
        },
        prep : function(o){
            var rowHtml = "";
            if(this.opts.colHeaders){
            var headerHtml = "";
            var colNum = 0;
             for(var x = 0; x<o.colHeaders.length; x++){
              colNum++;
                      var t;
                      if($(o.colHeaders[x]).text()){
                        t = $(o.colHeaders[x]).text();
                      }else{
                        t = o.colHeaders[x];
                      }
                var h = "<div class='gridzly-header row-"+colNum+"' title='"+t+"' >"+o.colHeaders[x]+"</div>"; //loops through for the headers
                headerHtml += h;
             }
          
            }
            rNum = o.rows[0].length;
            for(var y = 0; y<o.rows.length; y++){
                var rowHolder = "<div class='rowHolder'  value='"+this.rows+"'>"; //loops through for the rows
                for(var r = 0; r<o.rows[y].length; r++){
                  var grNum = 0;
                    for(var j in o.rows[y]){
                      grNum++;
                      var t;
                      if($(o.rows[y][j]).text()){
                        t = $(o.rows[y][j]).text();
                      }else{
                        t = o.rows[y][j];
                      }
                        var r = "<div name='"+o.colHeaders[j]+"' title='"+t+"' class='gridzly-row row-"+grNum+"'>"+o.rows[y][j]+"</div>";
                       rowHolder += r;
                    }
               
                }
                
                rowHolder += "</div>";
                rowHtml += rowHolder;
                  this.rows++; //iterate the num of rows
            }
            this.rNum = rNum;
       
            var spl = Number(this.gridWidth.split('px')[0]);
           
            this.rowWidth = (spl)/(rNum)/spl*100; //automatic resizing columns
            $("<style>.gridzly-row,.gridzly-header { width: "+this.rowWidth+"%; }</style>").appendTo(document.getElementsByTagName("head"));
            return {"colHead" : headerHtml, "rows" : rowHtml};
        },
        bind : function($grid){
          var self = this;
          var id = $grid.attr('id');
          var opt = $grid.parent().data().opts;
          opt.tim = setTimeout;
        $grid.delegate('.gridzly-row', 'click', function(){
          var nClass = $(this).attr('class').split(' ')[1];
          var head = document.getElementsByTagName('head');
          $('.gridzly-temp').empty().remove();
          var grw = Number(self.gridWidth.split('px')[0]);
         
          var ggw = (0.3*grw); //30 percent of the total
         
          var grWidth = (grw-ggw); //maths to get new row widths
         
          var r = (grWidth)/(self.rNum);
          var total = r+10;
         

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
          $grid.delegate('.gridzly-more', 'click', function(){
            var par = $(this).parents('.gridzlyGrid');
            var opts = par.data().opts;
           var deffer = self.addRecords(opts.maxRecordsShowing,par.attr('id'),opts.recordsUrl);
            deffer.success(function(data){
              
               var par = $('#'+opts.id);
                           var isIt = self.checkOverflow(par.find('.gridzlyGrid-innerRows')[0]);
                                 if(isIt == true){
                                  par.find('.gridzlyHeadRow').css({"overflow-y" : "scroll"});
                                 }else{
                                   par.find('.gridzlyHeadRow').css({"overflow-y" : "hidden"});
                                 }
                                 
              $('#'+opts.id).find('.gridzlyGrid-innerRows').append(self.prep(JSON.parse(data)).rows);
                $('.gridzly-temp').empty().remove();
                });
            });
         //$grid.find('.gridzlyGrid-innerRows').scroll(function(e){
         // var parent = $(this).parents('.gridzlyGrid');
         // console.log(parent.data().load);
         //  if($(this)[0].offsetHeight + $(this)[0].scrollTop == ($(this)[0].scrollHeight-5)){
         //   if(parent.data().load){
         //     self.addRow(parent.find('.rowHolder:last-child').attr('value'),$(this));
         //      parent.data().load = false;
         //      }
         //  }
         // });
         $grid.delegate("button", 'click', function(){
          var val = $(this).attr('value'),
          name = $(this).attr('name'),
          html = $(this).html(),
          par = $(this).parents('.gridzlyGrid'),
          title = par.data().title,
          row = $(this).parents('.gridzly-row').attr('name'),
          rowVal = $(this).parents(".rowHolder").attr('value'),
          ob = {name : name, content : html, gridTitle : title, row : row, rowID : rowVal, value : val };
          par.data().opts.onButtonChange(ob);
          
          });
         $grid.delegate("select", 'change', function(){
          var val = $(this).find('option:selected').attr('value'),
          name = $(this).find('option:selected').attr('name'),
          html = $(this).find('option:selected').html(),
          par = $(this).parents('.gridzlyGrid'),
          title = par.data().title,
          row = $(this).parents('.gridzly-row').attr('name'),
          rowVal = $(this).parents(".rowHolder").attr('value'),
          ob = {name : name, content : html, gridTitle : title, row : row, rowID : rowVal, value : val };
          par.data().opts.onSelectChange(ob);
          
          });
         
         if(opt.filter = true){
          var self = this;
          $grid.find('.gridzlyGridTitle-filter').keyup(function(){
            var par = $(this).parents('.gridzlyGrid');
            var opts = par.data().opts;
            var sel = $(this);
             opts.tim = setTimeout(function(){
               clearTimeout(opts.tim);
                var deffer = self.addRecords(opts.maxRecordsShowing,opts.id,opts.recordsUrl,sel.val());
                deffer.success(function(data){

                self.addInnerRows(par,self.prep(JSON.parse(data)));
                });
              },300);
            })
          .keydown(function(){
              var opts = $(this).parents('.gridzlyGrid').data().opts;
              clearTimeout(opts.tim);
            });
         }
         
        },
        addRow : function(row,el, type){
         
          var parent = el.parents('.gridzlyGrid');
           parent.find('.gridzly-loading').remove();
           parent.data().load = true;
            el.append('<div class="gridzly-loading gridzly-more">Load More</div>');

        },
        destroy : function(id){ //will be exported as public method
        
            
        },
       checkOverflow : function (el)
{
   var curOverflow = el.style.overflow;
   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   var isOverflowing = el.clientWidth < el.scrollWidth 
      || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
      },
        addRecords : function(number,id,url,filter){
 
           var ob = filter !== undefined ? {"getRecords" : number, "filter" : filter} : {"getRecords" : number};
            var rec = $.post(url,ob,"json");
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