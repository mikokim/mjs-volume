/**
 * @module ui/scene-graph-tree.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    Dict = require("collections/dict"),
    SceneTreeFactory = require("./core/scene-tree-factory").SceneTreeFactory,
    Montage = require("montage").Montage,
    Node = require("runtime/node").Node,

    DEFAULT_VALUES = {
        indentValue: 10,
        indentUnit: "px"
    };

/**
 * @class SceneGraphTree
 * @extends Component
 */
exports.SceneTree = Component.specialize(/** @lends SceneGraphTree# */ {

    constructor: {
        value: function SceneGraphTree() {
            this.super();

            this._treeFactory = SceneTreeFactory.create();
            this.configuration = Dict();

            this._populateConfiguration();
        }
    },

    _treeFactory: {
        value: null
    },

    configuration: {
        value: null
    },

    scene: {
        value: null
    },

    selectedNode: {
        value: null
    },

    _sceneGraphTree: {
        value: null
    },

    sceneGraphTree: {
        set: function (tree) {
            if (tree) {
                this._sceneGraphTree = this._treeFactory.buildWithGlTFTree(tree);
            }
        },
        get: function () {
            return this._sceneGraphTree;
        }
    },

    enterDocument: {
        value: function (firstime) {
            if (firstime) {
                if (this.scene.status === "loaded") {
                    this.handleStatusChange(this.scene.status);
                }

                this.scene.addOwnPropertyChangeListener("status", this);
                this.addOwnPropertyChangeListener("selectedNode", this);
            }
        }
    },

    _populateConfiguration: {
        value: function () {
            var self = this;

            Object.keys(DEFAULT_VALUES).forEach(function (key) {
                self.configuration.set(key, DEFAULT_VALUES[key]);
            });
        }
    },

    _createNodeFromGlTFElement: {
        value: function(glTFNode) {
            var m3dNode = new Node();

            this.scene.glTFElement.ids[glTFNode.baseId] = glTFNode;
            m3dNode.scene = this.scene;
            m3dNode.id = glTFNode.baseId;
            glTFNode.component3D = m3dNode;

            return m3dNode;
        }
    },

    _getComponent3DFromGlTFElement: {
        value: function (GlTFElement) {
            return GlTFElement.component3D ? GlTFElement.component3D : this._createNodeFromGlTFElement(GlTFElement);
        }
    },

    handleStatusChange: {
        value: function(status) {
            if (status === "loaded" && this.scene) {
               this.sceneGraphTree = this.scene.rootNode.glTFElement;
            }
        }
    },

    handleSelectedNodeChange: {
        value: function (selectedNode) {
            var content = selectedNode.content;

            if (content && content.glTFElement) {
                var component3D = this._getComponent3DFromGlTFElement(content.glTFElement);

                this.dispatchEventNamed("sceneNodeSelected", true, true, component3D);
            }
        }
    }

});
