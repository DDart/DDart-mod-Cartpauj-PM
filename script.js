(function($) {
  $(document).ready(function() {
    //Multi-select jQuery
    $('#message-type-select').change(function() {
      //Uncheck everything before starting
      $('.cpm_multi').attr('checked', false);
      
      if($(this).val() == 'read') {
        $('.cpm_multi_read').attr('checked', true);
      }
      if($(this).val() == 'unread') {
        $('.cpm_multi_unread').attr('checked', true);
      }
      if($(this).val() == 'all') {
        $('.cpm_multi').attr('checked', true);
      }
      if($(this).val() == 'none') {
        $('.cpm_multi').attr('checked', false);
      }
      
      return false;
    });
    
    $('a#messages-delete').click(function(e) {
      e.preventDefault();
      
      var answer = confirm(CPML10N.confirm_multi_delete);
      
      var message_ids = new Array();
      $("input:checkbox[name=message_ids]:checked").each(function() {
        message_ids.push($(this).val());
      });
      
      var data = {
        action: 'cpm_multi_delete',
        ids: message_ids
      };
      
      if(answer) {
        $('a#messages-delete').hide();
        $('img#messages-delete-pending').show();
        
        jQuery.post(CPML10N.ajaxurl, data, function(response) {
          if(response == "Success") {
            window.location.href = window.location.href;
          } else {
            alert(CPML10N.nothing_to_delete);
            $('a#messages-delete').show();
            $('img#messages-delete-pending').hide();
          }
        });
      }
    });
  });
})(jQuery);

// Surrounds the selected text with text1 and text2.
function surroundTheText(text1, text2, textarea)
{
	// Can a text range be created?
	if (typeof(textarea.caretPos) != "undefined" && textarea.createTextRange)
	{
		var caretPos = textarea.caretPos, temp_length = caretPos.text.length;

		caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text1 + caretPos.text + text2 + ' ' : text1 + caretPos.text + text2;

		if (temp_length == 0)
		{
			caretPos.moveStart("character", -text2.length);
			caretPos.moveEnd("character", -text2.length);
			caretPos.select();
		}
		else
			textarea.focus(caretPos);
	}
	// Mozilla text range wrap.
	else if (typeof(textarea.selectionStart) != "undefined")
	{
		var begin = textarea.value.substr(0, textarea.selectionStart);
		var selection = textarea.value.substr(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart);
		var end = textarea.value.substr(textarea.selectionEnd);
		var newCursorPos = textarea.selectionStart;
		var scrollPos = textarea.scrollTop;

		textarea.value = begin + text1 + selection + text2 + end;

		if (textarea.setSelectionRange)
		{
			if (selection.length == 0)
				textarea.setSelectionRange(newCursorPos + text1.length, newCursorPos + text1.length);
			else
				textarea.setSelectionRange(newCursorPos, newCursorPos + text1.length + selection.length + text2.length);
			textarea.focus();
		}
		textarea.scrollTop = scrollPos;
	}
	// Just put them on the end, then.
	else
	{
		textarea.value += text1 + text2;
		textarea.focus(textarea.value.length - 1);
	}
}

//START AUTO COMPLETE
function autosuggest(link) {
	q = document.getElementById('search-q').value;
	// Set the random number to add to URL request
	nocache = Math.random();
	http.open('get', link+'newmessage&pmjsscript=1&q='+q+'&nocache = '+nocache);
	http.onreadystatechange = autosuggestReply;
	http.send(null);
}

function createObject() {
	var request_type;
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer"){
		request_type = new ActiveXObject("Microsoft.XMLHTTP");
	}else{
		request_type = new XMLHttpRequest();
	}
	return request_type;
}

var http = createObject();

function autosuggestReply() {
	if(http.readyState == 4){
		var response = http.responseText;
		e = document.getElementById('results');
		if(response!=""){
			e.innerHTML=response;
			e.style.display="block";
		} else {
			e.style.display="none";
		}
	}
}

function fillText(v) {
	e = document.getElementById('search-q');
	e.value=v;
	document.getElementById('results').style.display="none";
}
function placeHolder(ele) {
  if (ele.value === ele.defaultValue)
    ele.value = '';
  else if (ele.value === '')
    ele.value = ele.defaultValue;
}