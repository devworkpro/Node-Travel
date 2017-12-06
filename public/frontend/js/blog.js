
$(document).ready(function() {

  var images =[];
    var videos =[];
$('.showReply').hide();
  $('.loading').hide();
 $( ".mainFil" ).keypress(function() {
if($(this).parents('.mainContainer').find('input').hasClass('gCParnt')){
var parent = $(this).parents('.mainContainer').find('.gCParnt:last').val();
var  parent = parseFloat(0.01) + parseFloat(parent)
//.toFixed(1);
$(this).parents('.messageCounter').find('.order').val(parent);


}

});
 // search result
 $( ".searchBlog" ).keypress(function() {

var obj ={};
var val = $(this).val();
if(val != ''){
  obj.keyword = val;
  
       $.ajax({

                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                url: '/searchBlog',
                success: function(e) {
                   console.log(e);
                   $('.showFind').html(e);
                }
                });
     }
   
});
 //ON CLICK ON SEARCH CLICK
  $( ".serchRES" ).click(function() {
 $( ".searchBlog" ).keypress();
 });
    // on change //

    /*********** for blog page*******/
  
   $('.subB').click( function(e) {
       var file = $('.filenAme').val();
       var chatBox = $('.chatBox').val();
     if(file == '' && chatBox == '' ){
        e.preventDefault();
     }else{
       if($('.filenAme').val() !== ''){
     
   $("#postMessage").attr("enctype","multipart/form-data")
    }
   $('#postMessage').submit();
 }
 });

$('.clearify').click( function (){
  var file = $('.filenAme').val('');
       var chatBox = $('.chatBox').val('');
       $('.del').html('');
});

   /***********end for blog page*******/
    
    $(".file").on('change', function(event) {
        //alert($(this).get(0).files.length);
      for (var i = 0; i < $(this).get(0).files.length; ++i) {
      //  names.push($(this).get(0).files[i].name);
    var d=$(this)[0].files[0].size/ 1024;
      //alert (d);
      //var s=true;
      if(d>=10)
      {

        var imgsrc = $(this).val();

        var ext = imgsrc.split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg','JPEG','JPG','PNG']) == -1) {
            alert('This file is not allowed');
            $(this).val('');
            
        } 
        else {
            var files = !!this.files ? this.files : [];
            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

            if (/^image/.test(files[0].type)) { // only image file
                var reader = new FileReader(); // instance of the FileReader
                reader.readAsDataURL(files[i]); // read the local file

                
                reader.addEventListener("load", function(e){
                var pic = e.target; 
                $('.filenAme').val(pic); 
            
                    $('.showMe').find(".uploaded_image_video").prepend(imgsrc ? "<div class='del'><img class='addedImage' width='100px' height='100px' src='" + this.result + "'><span data-type='image' attr-id='"+i+"' class='del_now' title='Remove'>X</span></div>" : "");


                });
           
                    $('.showMe').find('.uploaded_image_video').show();
                    $('.showMe').find('.previousAdd').hide();
               images.push($(this).get(0).files[i]);


            } else if (/^video/.test($(this).get(0).files[i])) {
                var video_data = new FormData();
                var video = $(this).prop('files')[0]
                video_data.append('video', video);
                $('#progress-wrp').show();
                $('.previousAdd').hide();
                $.ajax({
                    url: '/uploadImgVideo',
                    type: "POST",
                    data: video_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    xhr: function() {
                        //upload Progress
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            xhr.upload.addEventListener('progress', function(event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                //update progressbar
                                $(".progress-bar").css("width", +percent + "%");
                                $(".status").text(percent + "%");
                            }, true);
                        }
                        return xhr;
                    },
                    mimeType: "multipart/form-data"
                }).done(function(e) { //
                    var response = $.parseJSON(e);
                    if (response.success == true) {
                        videos.push(response.video_name);
                        $('#progress-wrp').hide();
                        $('.uploaded_image_video').show();
                        $(".uploaded_image_video").prepend("<video class='addedVideo' width='150px' height='150px'><source src='/library/videos/" + response.uid + "/" + response.video_name + "'></video>");
                    }
                });

            }

        }
      }
else{
  alert("Please choose file size greater than 135KB");
}

    }

    }); 
 /************************** clear array **********************************/
  
    
/*************************** remove unwanted photo *************************/       
 $(document).on("click", ".del_now", function(e) { 

  var id = $(this).attr('attr-id');
  var type = $(this).attr('data-type');
  if( $("#postMessage").find('.filenAme').val()){
    $('.filenAme').val('');
    $('.fileCheck').val('');
  }
  if(type == 'image'){
        images.splice(id,1);
    }
    else{
     videos.splice(id,1);
    }
    $(this).prev().remove();
    $(this).parents('.del').empty();
    $(this).remove();
     
});
/********************************************/

/***Comment on post**/
 $(document).on("submit", ".uploadComment", function(event) {

 var commtId ='';
  if($(this).find('.type').val() == 'comment'){

 if($(this).parents('.mainContainer').find('.parent').html()){

 var parnt = $(this).parents('.messageCounter').parents('.mainContainer').find('.parent:last');

}else{
  
var parnt =  $(this).parents('.mainContainer').find('.septComment');
}
    }else{
 var commtId = $(this).find('.commtId').val();

   var parnt = $(this).parents('.parent').find('.showReply');  
    }
          event.preventDefault();
           var mainField = $(this).find('.text_data');
     var field = $(this).find('.text_data').val();
          if(field){
            
      if($('#logOrNot').val()){
       
        var form_data = new FormData();
  
       
      
         var blogId = $(this).find('.blogId').val();
         var type = $(this).find('.type').val();
             var parentId = $(this).find('.parent_id').val();
             var order = $(this).find('.order').val();

            form_data.append('field', field);
               form_data.append('commtId', commtId);
             form_data.append('blogId', blogId);
             form_data.append('type', type);
              form_data.append('parentId', parentId);
              form_data.append('order', order);
        
        
    
$.ajax({
            url: '/sendCommentInDb',
            type: 'POST',
            dataType: 'text',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false
        })
                .done(function(e) {
                  // e = $.parseJSON(e);
                // JSON.stringify(e);
 // $( ".septComment" ).append(e); 
 if(type == 'comment') {

 parnt.after(e); 
 }else{
 parnt.before(e); 
 parnt.hide();
 }   
mainField.val('');
});
              }else{
                 $('.modeG').modal();
              }
            }else{
              return false;
            }
            });



/*********like post********/
/************************** Event Like *****************************/
$(document).on("click", ".ev_like", function(event) {
   if($('#logOrNot').val()){
  $(this).prop('disabled', true);
  var like = $(this).parents('.likes');
   obj ={};
        var ids = $(this).attr('b_Id');
       var type ="blog";
   
    obj.ids = ids;
    obj.type = type;
  
       $.ajax({

                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                url: '/likeBlog',
                success: function(e) {
                     like.find('.ev_unlike').prop('disabled', false);
                    JSON.stringify(e);
                    console.log(e);
                   like.find('.ev_like').hide();
                   like.addClass('blue');
                   like.find('.ev_unlike').show();
                   if(e > 0){
                   like.find('.counter').text(e);
                 }else{
                   like.find('.counter').text('');
                 }
                }
                });
   }else{
     $('.modeG').modal();
   }

    });

    
    // unlike 
    
    $(document).on("click", ".ev_unlike", function(event) {
    if($('#logOrNot').val()){
   $(this).prop('disabled', true);
    var like = $(this).parents('.likes');
    obj ={};
     var type ="blog";
         var ids = $(this).attr('b_Id');
    obj.ids = ids;
    obj.type = type;
      
              
       $.ajax({

                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                url: '/dislikeBlog',
                success: function(e) {
                    like.find('.ev_like').prop('disabled', false);
                      like.find('.ev_like').show();
                      like.removeClass('blue');
                   like.find('.ev_unlike').hide();
                    like.find('.counter').text(e);
                }
                });
    }else{
     $('.modeG').modal();
   }

    });

            
    
    
/*****end of like/dislike********/
// reply
 $(document).on("click", ".replyNow", function(event) {

  var blogId = $(this).parents('.parent').find('.comment:last').find('.blogId').val();
   var type = $(this).parents('.parent').find('.comment:last').find('.type').val();
   var order = $(this).parents('.parent').find('.comment:last').find('.order').val();
   var parentId = $(this).parents('.parent').find('.comment:last').find('.parent_id').val();
var commtId = $(this).parents('.parent').find('.comment:last').find('.commtId').val();
$(this).parents('.parent').find('.showReply').show();

 if($(this).parents('.parent').find('.showReply').is(":visible")){
$(this).parents('.parent').find('.showReply').focus();
 }else{ 
var html =  '<div class="showReply"><form class="uploadComment"><input type="hidden" class="blogId" ><input type="hidden" class="parent_id"><input type="hidden" class="order"><input type="hidden" class="commtId"><input type="hidden" class="type"><input type="text" name="comments" class="form-control text_data" onkeypress="fastSending(event);"><button type="submit" class="sendComment btn btn_main">Send</button></form></div>';
 var data = $(this).parents(".parent").append(html);
$(this).parents('.parent').find('.showReply').focus();
}
$(this).parents('.parent').find('.showReply').find('.blogId').val(blogId);
$(this).parents('.parent').find('.showReply').find('.type').val(type);
$(this).parents('.parent').find('.showReply').find('.order').val(order);
$(this).parents('.parent').find('.showReply').find('.parent_id').val(parentId);
$(this).parents('.parent').find('.showReply').find('.commtId').val(commtId);

var val = parseFloat(0.0001)+parseFloat(order);
//.toFixed(1);
$(this).parents('.parent').find('.showReply').find('.order').val(val);
});


   window.funy = 'yes';
    $(window).scroll(function() {
        if (window.funy == 'yes') {
          
          if($('body').find('.getBigBlog').attr('class')){
             $('.loading').show();
            var hT = $('.getBigBlog .mainContainer:last').offset().top,
                hH = $('.getBigBlog .mainContainer:last').outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();
            if (wS > (hT + hH - wH)) {
                window.funy = 'no';
                var lastId = $('.getBigBlog').find('.mainContainer:last').attr('cmntid');

                if (lastId) {
                    $.ajax({
                        url: '/loadMoreBlog?id=' + lastId,
                        type: 'POST',
                        success: function(msg) {
                           $('.loading').hide();
                        if (msg != false) {
                                $(".getBigBlog").append(msg);
                                window.funy = 'yes';
                            } else {
                                $('.resBlogNot').html('No More Result..');
                            }
                        }

                    });
                }
            }
        }
      }
    });


 window.funny = 'yes';
    $(window).scroll(function() {
        if (window.funny == 'yes') {
        
          if($('body').find('.getBig').attr('class')){
               $('.loading').show();
            var hT = $('.getBig .mainContainer:last').offset().top,
                hH = $('.getBig .mainContainer:last').outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();
            if (wS > (hT + hH - wH)) {
                window.funny = 'no';
                var lastId = $('.getBig').find('.mainContainer:last').attr('cmntid');
var val = $('.val').val();
                if (lastId) {
                    $.ajax({
                        url: '/loadBlogTag?id=' + lastId +'&val='+ val,
                        type: 'POST',
                        success: function(msg) {
                           $('.loading').hide();
                        if (msg != false) {
                                $(".getBig").append(msg);
                                window.funny = 'yes';
                            } else {
                                $('.resBNot').html('No More Result..');
                            }
                        }

                    });
                }
            }
        }
      }
    });


$('.comnt').click( function(){
   $('html, body').animate({
      'scrollBottom' : $(".mainFil").position().top
    });
$(this).parents('.mainContainer').find('.mainFil').focus();
});

});


function fastSending(e){
        if(e.keyCode === 13){
 $(".uploadComment").submit(e);

     }
   } 
