$(document).ready(function() {

	// initialize select box
    $('select').material_select();

    // initialize datepicker
	$('.datepicker').pickadate({
		onSet: function( arg ){
	        if ( 'select' in arg ){ //prevent closing on selecting month/year
	            this.close();
	        }
	    },
		onClose: function(){
	        $(document.activeElement).blur()
	    },
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15, // Creates a dropdown of 15 years to control year
		format: 'dd-mmm-yyyy',
	});

	// initialize modal
	$('.modal').modal();


	// ---------------------- API PROCESSES ---------------------------

	// ------------------ Populate Origin select box ------------------
	$.getJSON("./api.php?option=GetOrigin", function(data){
		// show loading
		$('.se-pre-con').fadeIn('slow');

		var states = "";
        $.each(data, function(state, obj){
        	var up = "<optgroup label='"+state+"'>";
        	var options= "";

        	for(var i=0;i<obj.length;i++)
        	{
        		options += "<option value='"+obj[i].Code+"'>"+obj[i].Nama+"</option>";
        	}

        	var down = "</optgroup>";

        	states += up+options+down;
            
        });

        // add additional options, temp fix for select box overlap under footer bug.
        var addop = '<option value="" disabled></option><option value="" disabled></option>';

        // append to select box
        $("#originSelect").append(states+addop);
    	$('#originSelect').material_select();

    	// hide loading
		$('.se-pre-con').fadeOut('slow');

		Materialize.toast('Origins loaded.', 2000);
    });


	// ------------------ Populate Destination select box ------------------
	$('#originSelect').change(function(){

		// clear previous data before append new one
		$('#destSelect').empty();
		$('#destSelect').append('<option value="" disabled selected>Select Destination</option>');

		var originCode = $('#originSelect').val();

		$.getJSON("./api.php?option=GetDest&Origin="+originCode, function(data){
			// show loading
			$('.se-pre-con').fadeIn('slow');

			var states = "";
	        $.each(data, function(state, obj){
	        	var up = "<optgroup label='"+state+"'>";
	        	var options= "";

	        	for(var i=0;i<obj.length;i++)
	        	{
	        		options += "<option value='"+obj[i].Code+"'>"+obj[i].Nama+"</option>";
	        	}

	        	var down = "</optgroup>";

	        	states += up+options+down;
	            
	        });

	        // add additional options, temp fix for select box overlap under footer bug.
        	var addop = '<option value="" disabled></option><option value="" disabled></option>';

	        // append to select box
	        $("#destSelect").append(states+addop);
	    	$('#destSelect').material_select();

	    	// hide loading
			$('.se-pre-con').fadeOut('slow');

			Materialize.toast('Destinations loaded.', 2000);
	    });
	});

	// ------------- Focus to date picker and show message to select date ---------------
	$('#destSelect').change(function(){
		$("#searchBar").removeClass('animated'); // remove animation, this cause a bug
		$('#datepicker').focus();
		Materialize.toast('Please choose the travel date', 2000);
	});


	// ------------------ Get train list ------------------
	$('#datepicker').change(function(){

		// clear previous train list before append new
		$('#trainList').empty();

		var originCode = $('#originSelect').val();
		var destCode = $('#destSelect').val();
		var date = $('#datepicker').val();

		if(originCode != null || destCode != null)
		{
			$.getJSON("./api.php?option=GetTrain&Origin="+originCode+"&Destination="+destCode+"&Date="+date, function(data){
				// show loading
				$('.se-pre-con').fadeIn('slow');

				var sep = "<br><hr><br>";
				var cards = "";
				var delay = 0.4;

		        $.each(data, function(index, obj){
		        	
		        	var arrival = obj.Arrival;
		        	var departure = obj.Departure;
		        	var trainnum = obj.TMT_TNM_NUMBER;
		        	var trainname = obj.TNM_NAME;
		        	
		        	cards += '<div class="row">'+
								'<div class="col s12">'+
									'<div class="card animated fadeInLeft" style="animation-delay: '+delay+'s;">'+
										'<div class="card-content">'+
											'<span class="card-title"><b>('+trainnum+') '+trainname+'</b></span>'+
											'<table>'+
												'<tr>'+
													'<th>Departure</th><td> : </td><td>'+ departure + '</td>'+
												'</tr>'+
												'<tr>'+
													'<th>Arrival</th><td> : </td><td>' + arrival + '</td>'+
												'</tr>'+
											'</table>'+
										'</div>'+
										'<div class="card-action">'+
											'<button class="waves-effect waves-light btn blue darken-2" id="showCoach" value="'+trainnum+'"><i class="material-icons left">view_list</i>Show Coach</button>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';

					// increase delay time for each cards
					delay += 0.4; 
		            
		        });

		        // append train list
		        $('#trainList').append(sep+cards);

		    	// hide loading
				$('.se-pre-con').fadeOut('slow');

				Materialize.toast('Trains and Coaches loaded.', 2000);
		    });
		}
		else
		{
			Materialize.toast('Error!', 2000);
		}

	});


	// ------------------ Show coach details ------------------
	$(document).on('click','#showCoach',function(){
		// empty/clear previous data before append new one
		$('#coachDetail').empty();

		var originCode = $('#originSelect').val();
		var destCode = $('#destSelect').val();
		var date = $('#datepicker').val();
		var train = $(this).val();

		// show progress bar
		$('.progress').fadeIn('slow');

		// open modal
		$('#coachModal').modal('open');

		$.getJSON("./api.php?option=GetCoach&Origin="+originCode+"&Destination="+destCode+"&Date="+date+"&Train="+train, function(data){

			var table = "";

	        $.each(data, function(index, obj){
	        	
	        	var details = obj.Keterangan;
	        	var coachpic = obj.Gambar;

	        	table += "<table>"+
	        				"<tr>"+
					   			"<td colspan='3' style='text-align: center'>"+
					   				"<img src='https://intranet.ktmb.com.my/e-ticket/Images/Coach/"+coachpic+"' class='responsive-img'/>"+
					   			"</td>"+
					   		"</tr>"+
	        				details+
	        			"</table><br><hr><br>";
	            
	        });

	        // hide progress bar
	        $('.progress').fadeOut('slow');

	        // append coach detail
	        $('#coachDetail').append(table);

			Materialize.toast('Coach details loaded.', 2000);
	    });


		
	});

});