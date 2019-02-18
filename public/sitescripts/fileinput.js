
 function readURL1(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap.1').hide();

      $('.file-upload-image.1').attr('src', e.target.result);
      $('.file-upload-content.1').show();
console.log(input.files)
      $('.image-title.1').html('');
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload('1');
  }
}
$('#remove1').click(function(){
   removeUpload('1')
})

function readURL2(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap.2').hide();
  
        $('.file-upload-image.2').attr('src', e.target.result);
        $('.file-upload-content.2').show();
  
        $('.image-title.2').html('');
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload('2');
    }
  }
  $('#remove2').click(function(){
     removeUpload('2')
  })
  
 function readURL3(input) {
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('.image-upload-wrap.3').hide();
  
        $('.file-upload-image.3').attr('src', e.target.result);
        $('.file-upload-content.3').show();
  
        $('.image-title.3').html('');
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload('3');
    }
  }
  $('#remove3').click(function(){
     removeUpload('3')
  })
function removeUpload(id) {
  $('.file-upload-input.'+id+'').replaceWith($('.file-upload-input.'+id+'').clone());
  $('.file-upload-content.'+id+'').hide();
  $('.image-upload-wrap.'+id+'').show();
}

$('.image-upload-wrap.3').bind('dragover', function () {
        $('.image-upload-wrap.3').addClass('image-dropping.3');
    });
    $('.image-upload-wrap.3').bind('dragleave', function () {
        $('.image-upload-wrap.3').removeClass('image-dropping.3');
});


$('.image-upload-wrap.2').bind('dragover', function () {
    $('.image-upload-wrap.2').addClass('image-dropping.2');
});
$('.image-upload-wrap.2').bind('dragleave', function () {
    $('.image-upload-wrap.2').removeClass('image-dropping.2');
});

$('.image-upload-wrap.1').bind('dragover', function () {
    $('.image-upload-wrap.1').addClass('image-dropping.1');
});
$('.image-upload-wrap.1').bind('dragleave', function () {
    $('.image-upload-wrap.1').removeClass('image-dropping.1');
});