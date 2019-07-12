$(document).ready(() => {
    $('.delete-movie').on('click', (e) => {
        $target = $(e.target);
        const genre = $target.attr('data-genre');
        $.ajax({
            type: 'DELETE',
            url: '/movies/' + genre,
            success: function(response) {
                alert('Delete Movie');
                window.location.href = '/';
            },
        });
    });
});