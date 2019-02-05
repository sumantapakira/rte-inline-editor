
var TouchUIColorPickerCmd = new Class({
        toString: "TouchUIColorPickerCmd",

        extend: CUI.rte.commands.Command,

        isCommand: function(cmdStr) {
            return (cmdStr.toLowerCase() == INLINE_FEATURE);
        },

        getProcessingOptions: function() {
            var cmd = CUI.rte.commands.Command;
            return cmd.PO_SELECTION | cmd.PO_BOOKMARK | cmd.PO_NODELIST;
        },

        _getTagObject: function(_inlineHTMLAttrs) {
            var inlineAttr = '';
            if(_inlineHTMLAttrs.fontSize){

                inlineAttr = inlineAttr + "font-size: " + _inlineHTMLAttrs.fontSize + "px;";
            }
            if(_inlineHTMLAttrs.textColor){

                inlineAttr = inlineAttr + "color: " + _inlineHTMLAttrs.textColor +";";
            }
            if(_inlineHTMLAttrs.fontFamily){

                inlineAttr = inlineAttr + "font-family: " + _inlineHTMLAttrs.fontFamily +";";
            }
  
            return {
                "tag": "span",
                "attributes": {
                    "style" : inlineAttr
                }
            };
        },

        execute: function (execDef) {
            this.superClass.execute.call(this, execDef);
            console.log(execDef.value);
            var color = execDef.value ? execDef.value[TEXT_COLOR] : undefined,
                fontSize = execDef.value ? execDef.value[TEXT_FONT_SIZE] : undefined,
                fontFamily = execDef.value ? execDef.value[TEXT_FONT_FAMILY] : undefined,
                selection = execDef.selection,
                nodeList = execDef.nodeList;
            var consistentFormatting = [];

            function InlineHTMLAttrs (fontSize, textColor, fontFamily) {
              this.fontSize = fontSize
              this.textColor = textColor
              this.fontFamily = fontFamily

			}

            var _inlineHTMLAttrs = new InlineHTMLAttrs(fontSize,color,fontFamily);
            console.log( _inlineHTMLAttrs);

             var commonAncestor = nodeList.commonAncestor;
          while (commonAncestor) {
                consistentFormatting.push(commonAncestor);
                commonAncestor = CUI.rte.Common.getParentNode(execDef.editContext, commonAncestor);
             }


			var ans = 	nodeList.commonAncestor;
            console.log(ans);
            if (!selection || !nodeList) {
                return;
            }

            var common = CUI.rte.Common,
                context = execDef.editContext,
                tagObj = this._getTagObject(_inlineHTMLAttrs);

            if(_.isEmpty(color)){
                nodeList.removeNodesByTag(execDef.editContext, tagObj.tag, undefined, true);
                return;
            }

            var tags = common.getTagInPath(context, selection.startNode, tagObj.tag);

            if (tags != null) {
                nodeList.removeNodesByTag(execDef.editContext, tagObj.tag, undefined, true);
            }

            nodeList.removeExistingStructuresOnSurround = true;
            var isActive = common.containsTagInPath(context, nodeList.commonAncestor,
                   tagObj.tag);
            if(!isActive){
            nodeList.surround(execDef.editContext, tagObj.tag, tagObj.attributes);
            }else{
				var dpr = CUI.rte.DomProcessor;
                 nodeList = dpr.createNodeList(execDef.editContext, selection);
                nodeList.surround(execDef.editContext, tagObj.tag, tagObj.attributes);
            }


        }
    });

    CUI.rte.commands.CommandRegistry.register(INLINE_FEATURE, TouchUIColorPickerCmd);

