function readURL(input, length, fileSize) {
    if (input.files.length != 0) {
        $('.formloading')
            .transition('jiggle')
    }
    if (input.files && input.files[0]) {
        if (input.files.length > length) {

            $('#inscriptionmodal').modal({
                onHide: function () {
                    $('#modaltitlecontentError').text('')
                    $('#modaltitleError').hide()
                    $('#mehdiv').empty()
                },
                onShow: function () {
                    $('#modaltitleError').show()

                    $('#modaltitlecontentError').text('Maximum ' + length + 'fichiers!')
                    $('#mehdiv').append('<i class="meh big outline red icon"></i>')
                },
                onApprove: function () {
                    $('#modaltitlecontentError').text('')
                    $('#modaltitleError').hide()
                    $('#mehdiv').empty()
                }
            }).modal('show');
            $('.formloading')
                .fadeOut()
            return
        }

        $('.file-upload-image').hide()

        for (let index = 0; index < input.files.length; index++) {

            var reader = new FileReader();

            reader.onload = function (e) {


                $('.file-upload-image' + '.' + index).attr('src', e.target.result);

            };
            let arrayOfBadFiles = []
            let maxFileSize = parseInt(fileSize)
            for (let index = 0; index < input.files.length; index++) {
                if (input.files[index].size / 1024 / 1024 > maxFileSize) {
                    arrayOfBadFiles.push(input.files[index])

                }

                $('.file-upload-image' + '.' + index).attr('data-fileName', input.files[index].name)
                $('.file-upload-image' + '.' + index).show();
            }
            if (arrayOfBadFiles.length > 0) {
                $('#modaltitlecontentError').text('Fichier(s) trop volumineux: maximum 1MB par fichier')


                for (let index = 0; index < arrayOfBadFiles.length; index++) {
                    $('#modalcontent').append('<span>' + arrayOfBadFiles[index].name + '<span><br>')
                }

                $('#inscriptionmodal').modal({
                    onHide: function () {
                        $('#modaltitlecontentError').text('')
                        $('#modaltitleError').hide()
                        $('#modalcontent').empty();
                        $('#modalcontent').hide()
                        $('#mehdiv').empty()
                    },
                    onShow: function () {
                        $('#modaltitleError').show()
                        $('#modalcontent').show()
                        $('#mehdiv').append('<i class="meh big outline red icon"></i>')
                    },
                    onApprove: function () {
                        $('#modaltitlecontentError').text('')
                        $('#modaltitleError').hide()
                        $('#modalcontent').empty();
                        $('#modalcontent').hide()
                        $('#mehdiv').empty()
                    }
                }).modal('show');


                arrayOfBadFiles = []
                removeUpload()

                return
            }
            $('.image-upload-wrap').hide();
            $('.file-upload-content').show();

            reader.readAsDataURL(input.files[index])

        }
        let arrayOfCorruptedFiles = []
        $('.file-upload-image').on('error', function () {



            let fileName = $(this).attr('data-fileName')
            arrayOfCorruptedFiles.push(fileName)
            $('#modalcontent').empty()
            arrayOfCorruptedFiles.forEach(element => {
                $('#modalcontent').append('<span>' + element + '</span><br>')
            });

            if ($('#mehdiv').is(':empty')) {
                $('#mehdiv').append('<i class="meh big outline red icon"></i>')


                $('#inscriptionmodal').modal({
                    onHide: function () {
                        $('#modaltitlecontentError').text('')
                        $('#modaltitleError').hide()
                        $('#modalcontent').empty();
                        $('#modalcontent').hide()
                        $('#mehdiv').empty()
                        arrayOfCorruptedFiles = []
                    },
                    onShow: function () {

                        $('#modaltitlecontentError').text('Erreur fichier(s) corrompu!!')

                        $('#modaltitleError').show()
                        $('#modalcontent').show()
                        $('#mehdiv').show()
                    },
                    onApprove: function () {
                        $('#modaltitlecontentError').text('')
                        $('#modaltitleError').hide()
                        $('#modalcontent').empty();
                        $('#modalcontent').hide()
                        $('#mehdiv').empty()
                        arrayOfCorruptedFiles = []
                    }
                }).modal('show');
            }


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
    $('.formloading')
        .fadeOut()

}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});
