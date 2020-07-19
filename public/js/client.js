(function($) {
    
    $('.btn-edit').on('click', function(e) {
        e.preventDefault();

        let itemTextNode = $(this).parent().parent().find('span.item-text');
        let input = prompt("Edit desire item:", itemTextNode.text());

        if (input !== null && input !== itemTextNode.text()) {

            $.post('/update-item/'+$(this).data('id'), { item: input }, function(response) {
                if (response.status === 'ok') {
                    itemTextNode.html(input);
                }
            });
            
        }
    });

    $('.delete-form').on('submit', function(e) {
        e.preventDefault();

        if (confirm('Delete item permanently?')) {
            let self = $(this);

            $.post($(this).attr('action'), {}, function(response) {
                if (response.status === 'ok') {
                    
                    self.parent().parent().remove();
                }
            });
        }
    })
    
})(jQuery)