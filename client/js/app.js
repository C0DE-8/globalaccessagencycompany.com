$(document).ready( function(){
    $('#track-form').on('submit', function(e){
        e.preventDefault();
        let btn = $('#track-btn').html();
        let formData = $(this).serialize();
        $.ajax({
            url:"track/xhrTrack",
            method:"POST",
            data:formData,
            dataType:"JSON",
            beforeSend:function(){
                $('#track-btn').html('<i class="fa fa-spin fa-spinner"></i>');
            },
            success:function(data){
                if(data.type === 'success'){
                    window.location.href = data.message;
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: data.message,
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                        confirmButtonColor: '#1f425d'
                      })
                    $('#track-btn').html(btn);
                }
            }
        })
    })
    $("#contact-form").on("submit", function (event) {
        event.preventDefault();
        let form_data = $("#contact-form").serialize();
        $.ajax({
            url:'contact/xhrSendMessage',
            method:"POST",
            data:form_data,
            beforeSend:function(){
                $('#contact-btn').html('<i class="fa fa-spin fa-spinner"></i>');
            },
            success:function(data){
                if(data==='success'){
                    Swal.fire({
                        title: 'Success!',
                        text: "Your message has been sent.",
                        icon: 'success',
                      })
                      $("#contact-form")[0].reset();
                }else{
                    Swal.fire({
                        title: 'Error!',
                        text: data,
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                        confirmButtonColor: '#1f425d'
                    })
                }
                $('#contact-btn').html('Send Message');
                
            }
        })
    });
})
