
var EAEMColorPickerDialog = new Class({
        extend: CUI.rte.ui.cui.AbstractDialog,

        toString: "EAEMColorPickerDialog",

        initialize: function(config) {
            this.exec = config.execute;
        },

        getDataType: function() {
            return DIALOG;
        }
    });




var TouchUIColorPickerPlugin = new Class({
       toString: "TouchUIColorPickerPlugin",

        extend: CUI.rte.plugins.Plugin,

        pickerUI: null,


        getFeatures: function() {
            return [ INLINE_FEATURE ];
        },



        initializeUI: function(tbGenerator) {
            var plg = CUI.rte.plugins;
            // Storing into some data element for disabled features
			var el = document.getElementById('assetfinder-filter');
            el.setAttribute('data-disableFeatures', this.config.disableFeatures);

            if (!this.isFeatureEnabled(INLINE_FEATURE)) {
                return;
            }

            this.pickerUI = tbGenerator.createElement(INLINE_FEATURE, this, false, { title: "Inline Text edit" });
            tbGenerator.addElement(GROUP, plg.Plugin.SORT_FORMAT, this.pickerUI, 10);

            var groupFeature = GROUP + "#" + INLINE_FEATURE;
            tbGenerator.registerIcon(groupFeature, "actions");
        },

        execute: function (id, value, envOptions) {


            if(!isValidSelection()){
                return;
            }

            var context = envOptions.editContext,
                selection = CUI.rte.Selection.createProcessingSelection(context),
                ek = this.editorKernel,
                startNode = selection.startNode;

            if ( (selection.startOffset === startNode.length) && (startNode != selection.endNode)) {
                startNode = startNode.nextSibling;
            }

            var tag = CUI.rte.Common.getTagInPath(context, startNode, "span"), plugin = this, dialog,
                color = $(tag).css("color"),
                fontSize = $(tag).css("font-size"),
                fontFamily = $(tag).css("font-family"),
                dm = ek.getDialogManager(),
                $container = CUI.rte.UIUtils.getUIContainer($(context.root)),
                propConfig = {
                    'parameters': {
                        'command': this.pluginId + '#' + INLINE_FEATURE
                    }
                };

            console.log($(tag).css("color"));

            if(this.eaemColorPickerDialog){
                dialog = this.eaemColorPickerDialog;
            }else{
                dialog = new EAEMColorPickerDialog();

                dialog.attach(propConfig, $container, this.editorKernel);

                dialog.$dialog.css("-webkit-transform", "scale(0.9)").css("-webkit-transform-origin", "0 0")
                    .css("-moz-transform", "scale(0.9)").css("-moz-transform-origin", "0px 0px");

                dialog.$dialog.find("iframe").attr("src", getPickerIFrameUrl(color,fontSize,fontFamily));
               this.eaemColorPickerDialog = dialog;


            }

            dm.show(dialog);


            registerReceiveDataListener(receiveMessage);

            function isValidSelection(){
                var winSel = window.getSelection();
                return winSel && winSel.rangeCount == 1 && winSel.getRangeAt(0).toString().length > 0;
            }

            function getPickerIFrameUrl(color,fontSize,fontFamily){
                var url = PICKER_URL + "?" + REQUESTER + "=" + GROUP;

                if(!_.isEmpty(color)){
                    url = url + "&" + TEXT_COLOR + "=" + color;
                }
                if(!_.isEmpty(fontSize)){
                    fontSize = fontSize.substring(0, fontSize.lastIndexOf("px"));
                    url = url + "&font-size="+fontSize;
                }
                if(!_.isEmpty(fontFamily)){
                    url = url + "&font-family="+fontFamily;
                }

			console.log(url);
                return url;
            }

            function removeReceiveDataListener(handler) {
                if (window.removeEventListener) {
                    window.removeEventListener("message", handler);
                } else if (window.detachEvent) {
                    window.detachEvent("onmessage", handler);
                }
            }

            function registerReceiveDataListener(handler) {
                if (window.addEventListener) {
                    window.addEventListener("message", handler, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onmessage", handler);
                }
            }

            function receiveMessage(event) {
                if (_.isEmpty(event.data)) {
                    return;
                }

                var message = JSON.parse(event.data),
                    action;

                if (!message || message.sender !== GROUP) {
                    return;
                }

                action = message.action;

                if (action === "submit") {
                    if (!_.isEmpty(message.data)) {
                        ek.relayCmd(id, message.data);
                    }
                }else if(action === "remove"){
                    ek.relayCmd(id);
                }else if(action === "cancel"){
                    plugin.eaemColorPickerDialog = null;
                }
                dialog.hide();

                removeReceiveDataListener(receiveMessage);
            }
        },

        //to mark the icon selected/deselected
        updateState: function(selDef) {
            var hasUC = this.editorKernel.queryState(INLINE_FEATURE, selDef);

            if (this.pickerUI != null) {
                this.pickerUI.setSelected(hasUC);
            }
        }
    });



    CUI.rte.plugins.PluginRegistry.register(GROUP,TouchUIColorPickerPlugin);

