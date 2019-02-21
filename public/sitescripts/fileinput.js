function readURL(input, length) {
    if (input.files && input.files[0]) {
        if (input.files.length > length) {
            alert('Maximum ' + length + ' images.')
            return
        }

        $('.file-upload-image').hide()

        for (let index = 0; index < input.files.length; index++) {

            var reader = new FileReader();

            reader.onload = function (e) {


                $('.file-upload-image' + '.' + index).attr('src', e.target.result);

              


            };
            for (let index = 0; index < input.files.length; index++) {
                $('.file-upload-image' + '.' + index).show();
            }
            $('.image-upload-wrap').hide();
            $('.file-upload-content').show();

            reader.readAsDataURL(input.files[index])
           
        }
        $('.file-upload-image').on('error',function(){
           
            removeUpload();
          
        })  
    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
