(function($) {

    function taskTemplate(task) {
        return `<li class='list-group-item list-group-item-action d-flex align-items-center justify-content-between'>
        <span class='item-text'>${task.text}</span>
        <div class='ml-auto d-flex'>
            <button type='button' class='btn btn-secondary mr-2 btn-edit' data-id='${task._id}'>Edit</button>
            <form action='/delete-item/${task._id}' method='POST' class='delete-form'>
                <button type='submit' class='btn btn-danger'>Delete</button>
            </form>
        </div>
        </li>`;
    }

    $.get('/load-items', function(response) {
        if (response.count === 0) {
            $('.loading').text('No Task');
        }

        let html = '';

        response.data.forEach(function(item) {
            html += taskTemplate(item);
        });

        $('#item-wrap').html(html);
    });

    $(document).on('submit', '#insert-form', function(e) {
        e.preventDefault();
        const textField = $('input[name="item"]');

        $.post('/save-item', { item: textField.val() }, function(response) {
            if (response.status === 'ok') {
                $('#item-wrap').append(taskTemplate(response.task));
            }

            textField.val('');
            textField.focus();
        });
    });
    
    $(document).on('click', '.btn-edit', function(e) {
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

    $(document).on('submit', '.delete-form', function(e) {
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