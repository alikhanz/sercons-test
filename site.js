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
    init: function() {
        this.elements.innerContinaer = this.elements.container.find(this.selectors.innerContainer);
        this.elements.button = this.elements.container.find(this.selectors.button);
        this.entryLevel = 0;
    },
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
    renderCategories: function(categories) {
        var html = '';
        var self = this;

        $.each(categories, function(i, category){
            var preName = Array(self.entryLevel + 1).join('--');
            html += '<li>'+ preName + category['name'] + '</li>';

            if (category['children'] && category['children'].length > 0) {
                self.entryLevel++;
                html += self.renderCategories(category['children']);
                self.entryLevel--;
            }
        });

        return html;
    }
};


new categoriesLoader($('.js-categories-loader'));