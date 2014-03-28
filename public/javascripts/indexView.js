/**
 * Created by aalekseev on 27.03.14.
 */
var submitData={};
var imagePicker;
var questionForm;
$(document).ready(function(){
    imagePicker = $("#usersSelect");
    questionForm = $("#questionForm");

    imagePicker.imagepicker({
        hide_select : true,
        show_label  : true,
        selected:function(param){
            var selectedObject = imagePicker.data('picker').select;
            if(selectedObject.length)
                questionForm.show();
        }
    });
    $('input[type="radio"]').change(function(){
        $("#submitButton").button( "enable" );
        $('input[type="radio"]').off();
    });
    $("#submitButton").click(function(e) {
        var url = "/result"; // the script where you handle the form input.
        var value = $('input[name = "optionsRadios"]:checked').val();
        $.ajax({
            type: "POST",
            url: url,
            data: {option:value, question:"optionsRadios"}, // serializes the form's elements.
            success: function(data)
            {
                var question = data.result;
                var total = question.total;
                for(var i = 0; i<question.option.length; i++){
                    var option = question.option[i];
                    var obj = $('input[value=\"'+(i+1)+'\"]').parent();
                    var progress = obj.find(".bar");
                    progress.width(parseInt((option/total)*100)+"%");
                    obj.find('.textProgress').text(option);
                }
            }
        });
//        return false; // avoid to execute the actual submit of the form.
    });
});