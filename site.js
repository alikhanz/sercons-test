/**
 * Created by damned on 05.06.15.
 */

/**
 * Constructor
 *
 * @param container
 */
var categoriesLoader = function(container) {
    this.selectors = {
        'innerContainer': '.js-categories-container',
        'button': '.js-load-categories'
    };

    this.elements = {};
    this.elements.container = container;

    this.init();
    this.bindEvents();
};

/**
 * Implement methods
 * @type {{}}
 */
categoriesLoader.prototype = {
    /**
     * Initialize elements
     *
     * @return void
     */
    init: function() {
        this.elements.innerContinaer = this.elements.container.find(this.selectors.innerContainer);
        this.elements.button = this.elements.container.find(this.selectors.button);
    },
    /**
     * Bind dom-events
     *
     * @return void
     */
    bindEvents: function() {
        var self = this;

        this.elements.button.on('click', function(e){
            $.ajax(self.elements.container.data('url'))
                .success(function(data){
                    self.elements.innerContinaer.html(self.renderCategories(data));
                })
                .error(function(){
                    alert('Server Error');
                });
        });
    },
    /**
     * Render categories
     *
     * @param categories
     * @returns {string}
     */
    renderCategories: function(categories) {
        var html = '<ul>';
        var self = this;

        $.each(categories, function(i, category){
            html += '<li>' + category['name'] + '</li>';

            if (category['children'] && category['children'].length > 0) {
                html += self.renderCategories(category['children']);
            }

        });

        html += '</ul>';

        return html;
    }
};

new categoriesLoader($('.js-categories-loader'));
