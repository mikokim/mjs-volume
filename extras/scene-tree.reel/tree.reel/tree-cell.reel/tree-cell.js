/**
 * @module ui/tree-cell.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TreeCell
 * @extends Component
 */
exports.TreeCell = Component.specialize(/** @lends TreeCell# */ {

    constructor: {
        value: function TreeCell() {
            this.super();
        }
    },

    hasChildren: {
        value: false
    },

    configuration: {
        value: null
    },

    fulfilled: {
        value: false
    },

    name: {
        value: null
    },

    selected: {
        value: null
    },

    _node: {
        value: null
    },

    node: {
        set: function (iteration) {
            if (iteration && typeof iteration === "object" && iteration.content) {
                iteration.expanded = iteration.content.root ? true : iteration.expanded;

                if (iteration.content.rawChildren) {
                    this.hasChildren = Object.keys(iteration.content.rawChildren).length > 0;
                }

                this.name = iteration.content.name;
                this._node = iteration;
            }
        },
        get: function () {
            return this._node;
        }
    },

    draw: {
        value: function () {
            if (this.node) {
                var indentValue = this.configuration.get("indentValue") * (this.node.depth - 1);

                this.element.style.marginLeft = indentValue + this.configuration.get("indentUnit");
            }
        }
    }

});
