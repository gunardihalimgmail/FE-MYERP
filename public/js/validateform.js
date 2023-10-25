$(function() {
    $(".form").validate({
        rules: {
            password: {
                required: true,
                minlength: 3
            },
            old_password: {
                required: true,
                minlength: 3
            }
        }
    });
})