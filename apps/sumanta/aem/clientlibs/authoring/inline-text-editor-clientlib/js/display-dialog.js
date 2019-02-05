(function($,$document){
    var SENDER = "sumanta-showcase",
        REQUESTER = "requester",
        COLOR = "color",
        FONT_SIZE = "font-size",
        FONT_FAMILY= "font-family",
        ADD_COLOR_BUT = "#EAEM_CP_ADD_COLOR",
        REMOVE_COLOR_BUT = "#EAEM_CP_REMOVE_COLOR";

    if(queryParameters()[REQUESTER] !== SENDER ){
        return;
    }

    $(function(){
       _.defer(stylePopoverIframe);

    });

   function queryParameters() {
        var result = {}, param,
            params = document.location.search.split(/\?|\&/);

        params.forEach( function(it) {
            if (_.isEmpty(it)) {
                return;
            }

            param = it.split("=");
            result[param[0]] = param[1];
        });

        return result;
    }


    function stylePopoverIframe(){
        var queryParams = queryParameters(),
            $dialog = $("coral-dialog");

        var disabledFeature = window.parent.document.getElementById('assetfinder-filter').getAttribute("data-disableFeatures");
        var  array = disabledFeature.split(',');

        if(!_.isEmpty(disabledFeature)){
            for(var i=0;i<array.length;i++){

               $dialog.find("[name='"+ array[i] +"']").closest("div").hide();
            }
        }


        if(_.isEmpty($dialog)){
            return;
        }

        $dialog.css("overflow", "hidden").css("background-color", "#fff");

        $dialog[0].open = true;

        var $addColor = $dialog.find(ADD_COLOR_BUT),
            $removeColor = $dialog.find(REMOVE_COLOR_BUT),
            color = queryParameters()[COLOR],
            size = queryParameters()[FONT_SIZE],
            fontFamily = queryParameters()[FONT_FAMILY],
           $colorPicker = $document.find("coral-colorinput");
           $fontSize=$document.find("[name='./" + FONT_SIZE + "']");
          $fontFamily=$document.find("[name='./" + FONT_FAMILY + "']");

        if(!_.isEmpty(color)){
            color = decodeURIComponent(color);

            if(color.indexOf("rgb") == 0){
                color = CUI.util.color.RGBAToHex(color);
            }

            $colorPicker[0].value = color;
        }

        if(!_.isEmpty(size)){
              $fontSize[0].value = size;
        }

        if(!_.isEmpty(fontFamily)){
              $fontFamily[0].value = fontFamily;
        }


        adjustHeader($dialog);

        $colorPicker.css("margin-bottom", "285px");

        $(ADD_COLOR_BUT).css("margin-left", "220px");

        //$addColor.click(sendDataMessage);

        $removeColor.click(sendRemoveMessage);
    }

    function adjustHeader($dialog){

         var $header = $dialog.css("background-color", "#fff").find(".coral3-Dialog-header");

        //$header.find(".cq-dialog-submit").remove();
        $dialog.find(".cq-dialog-submit").click(function(event){
            event.preventDefault();
             sendDataMessage();
        });

        $header.find(".cq-dialog-cancel").click(function(event){
            event.preventDefault();

            $dialog.remove();

            sendCancelMessage();
        });
    }

    function sendCancelMessage(){
        var message = {
            sender: SENDER,
            action: "cancel"
        };

        parent.postMessage(JSON.stringify(message), "*");
    }

    function sendRemoveMessage(){
        var message = {
            sender: SENDER,
            action: "remove"
        };

        parent.postMessage(JSON.stringify(message), "*");
    }

    function isHidden(hiddenElement,$dialog){

        return $dialog.find("[name='./" + hiddenElement + "']").closest("div").css('display') == 'none';

    }

    function sendDataMessage(){
        var message = {
            sender: SENDER,
            action: "submit",
            data: {}
        }, $dialog, color,size,fontFamily;

        $dialog = $(".cq-dialog");

        color = $dialog.find("[name='./" + COLOR + "']").val();
        size = $dialog.find("[name='./" + FONT_SIZE + "']").val();
        fontFamily = $dialog.find("[name='./" + FONT_FAMILY + "']").val();

        if(color && color.indexOf("rgb") >= 0){
            color = CUI.util.color.RGBAToHex(color);
		   }

        if(!isHidden(FONT_FAMILY,$dialog)){
            message.data[FONT_FAMILY] = fontFamily;
           }

        if(!isHidden(FONT_SIZE,$dialog)){
            message.data[FONT_SIZE] = size;
           }

        if(!isHidden(COLOR,$dialog)){
            message.data[COLOR] = color;
           }

        parent.postMessage(JSON.stringify(message), "*");
    }
})(jQuery, jQuery(document));

