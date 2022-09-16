var $ = jQuery;

$(document).ready(function(){
    // Ajax test call 
    // $.ajax({
    //     type: "POST",
    //     url: example_call.ajaxurl,
    //     data: ({ 
    //         action: "example_call", 
    //     }),
    //     success: function(response) {
    //         console.log(response)
    //     },
    // });
    
});

var $ = jQuery;

window.ready(function () {

	/**
	 * 
	 * Position suffixes
	 * 
	 */
	$(".has-suffix").each(function(){

		var inputElement = this;
        var suffixElement = $(this).siblings('.suffix')[0];

		updateSuffix(inputElement, suffixElement);
    });
	
	// reposition suffix if its input changes
	$('.has-suffix').on('input', function() {
		var inputElement = this;
        var suffixElement = $(this).siblings('.suffix')[0];
		
		updateSuffix(inputElement, suffixElement);
	});
	
	function updateSuffix(inputElement, suffixElement) {
		var width = getTextWidth(inputElement.value, '22px Bliss');
		suffixElement.style.left = width + 'px';
	}

	// uses canvas.measureText to return the width of the given text of given font in pixels
	function getTextWidth(text, font) {
		// re-use canvas object for better performance
		var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
		var context = canvas.getContext("2d");
		context.font = font;
		var metrics = context.measureText(text);
		return metrics.width;
	}

	
	/**
	 * Comma format all input values with relevant class
	 */
	$(".comma-format-value").each(function(){
		commaFormatInputValue($(this));
	});

	function commaFormatInputValue(_obj){

		var num = getNumber(_obj.val());
		if(num==0){
			_obj.val('');
		}else{
			_obj.val(num.toLocaleString());
		}

		function getNumber(_str){
			var arr = _str.split('');
			var out = new Array();
			for(var cnt=0;cnt<arr.length;cnt++){
				if(isNaN(arr[cnt])==false){
					out.push(arr[cnt]);
				}
			}
			return Number(out.join(''));
		}
	}

	/**
	 * Mortgage repayments
	 * 
	 * ref: first answer here https://stackoverflow.com/questions/17101442/how-to-calculate-mortgage-in-javascript
	 */
	function calculateMortgageRepayments(){
		
		// form inputs
		let price = parseFloat($("#js-mortgage-price").val().replace(/,/g, ''));// remove commas for the calc
		let deposit = parseFloat($("#js-mortgage-deposit").val().replace(/,/g, ''));// remove commas for the calc
		let years = parseFloat($("#js-mortgage-period").val());
		let interestRate = parseFloat($("#js-mortgage-interest").val());

		// re-run comma formatting on input values with relevant class 
		$(".comma-format-value").each(function(){
			commaFormatInputValue($(this));
		});

		var loan = price - deposit;
		var monthlyInterestRate = interestRate / 100 / 12;
		var numberOfPayments = years * 12;

		// formula
		function calculateMonthlyPayment(p, n, i) {
			return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
		}

		// calculation
		var monthlyRepayments;
		monthlyRepayments = calculateMonthlyPayment(loan, numberOfPayments, monthlyInterestRate);	

		// round the figure to 2 decimal places
		var roundedReplayments = Math.round((monthlyRepayments + Number.EPSILON) * 100) / 100;
		// comma format the figure
		var commaFormatReplayments = roundedReplayments.toLocaleString();

		// update the result
		$("#js-mortgage-result").text(commaFormatReplayments);
	}

	// run mortgage calculation when any input value changes
	$(function(){
		$(".mortgage-calc-input").on("change keyup", calculateMortgageRepayments)
	});


	/**
	 * 
	 * Stamp duty
	 * 
	 */
	function calculateStampDuty(){
		
		// form input
		let price = parseFloat($("#js-stamp-duty-price").val().replace(/,/g, ''));// remove commas for the calc

		var homeStatusSelection = $( "#home-status option:selected" ).val();

		var stampDutyTotal = 0;
		
		var intervals = {
		  0: {
			'from': 0,
			'to': 125000,
			'rate': 0
		  },
		  1: {
			'from': 125001,
			'to': 250000,
			'rate': 2
		  },
		  2: {
			'from': 250001,
			'to': 925000,
			'rate': 5
		  },
		  3: {
			'from': 925001,
			'to': 1500000,
			'rate': 10
		  },
		  4: {
			'from': 1500001,
			'to': parseInt(price),
			'rate': 12
		  }
		};

		if(homeStatusSelection == 'first-home' && price < 500001) {// first time buyer of a home under 500k
			var intervals = {
				1: {
				  'from': 300001,
				  'to': 500000,
				  'rate': 5
				}
			}
		}
		
		for(var interval in intervals) {
		  if(price > 1500000 || intervals[interval]['from'] == 0 || price > intervals[interval]['from']) {
			
			if(homeStatusSelection == 'second-home') {// second home attracts extra 3% on top
			  intervals[interval]['rate'] += 3;
			}
			
			if(price < intervals[interval]['to']) {
			  intervals[interval]['to'] = price;
			}
			
			intervals[interval]['due'] = ((intervals[interval]['to'] - intervals[interval]['from'])/100)*intervals[interval]['rate'];

			stampDutyTotal += intervals[interval]['due'];
			
		  } else {
			delete intervals[interval];
		  }
		}

		// round the figure up to integer
		var roundedUpStampDuty = Math.ceil(stampDutyTotal);
		// comma format the figure
		var commaFormatStampDuty = roundedUpStampDuty.toLocaleString();

		// update the result
		$("#js-stamp-duty-result").text(commaFormatStampDuty);
	}

	// run stamp duty calculation when submit is clicked
	$(function(){
		$("#js-stamp-duty-submit").click(calculateStampDuty);
	})

	// run comma formatting when value changes
	$("#js-stamp-duty-price").on("change keyup", function(){
		commaFormatInputValue($(this));
	});

});
var $ = jQuery;

$(document).ready(function () {
	
	$('.block-form-valuation__form, .person-modal__form').submit(function(e){
		e.preventDefault();
		$('.block-form-valuation__submit, .person-modal__button-submit').attr("disabled", "disabled");
		$('.block-form-valuation__submit, .person-modal__button-submit').addClass("submit-active");
		let form = this;
		
		let messageBox = form.getElementsByClassName('block-form-valuation__message')[0];
		messageBox.innerHTML = '';
		messageBox.classList.remove("block-form-valuation__message--active");
		messageBox.classList.remove("block-form-valuation__message--success");
		messageBox.classList.remove("block-form-valuation__message--error");
		
		let post_url = $('input[name="post_url"]')[0];
		if(post_url) {
			post_url.value = window.location.href;
			post_url.placeholder = 'Post URL';
		}
		
		let form_title = $('input[name="form_title"]')[0];
		if(form_title) {
			form_title.placeholder = 'Form Title';
		}
		
		
		let inputs = form.getElementsByTagName('input');
		let inputsObject = {};
		let termsValidated = false;
		
		Array.from(inputs).forEach(input => {
			if(input.name == 'terms') {
				termsValidated = input.checked ? true : false;
			} else if(input.type == 'radio' && !input.checked) {
				
			} else {
				inputsObject[input.name] = {
					name: input.name,
					value: input.value,
					placeholder: input.placeholder,
				};
			}
		});
		
		if(termsValidated == false) {
			console.log(messageBox);
			messageBox.classList.add("block-form-valuation__message--active");
			messageBox.classList.add("block-form-valuation__message--error");			
			messageBox.innerHTML = 'Error: Please agree to the terms to continue.';
			$('.block-form-valuation__submit, .person-modal__button-submit').removeClass("submit-active");
			$('.block-form-valuation__submit, .person-modal__button-submit').removeAttr("disabled", "disabled");
			return;
		}
		
		if (grecaptcha.getResponse(form.getElementsByClassName('g-recaptcha')[0].dataset.widgetid) == ""){
			messageBox.classList.add("block-form-valuation__message--active");
			messageBox.classList.add("block-form-valuation__message--error");			
			messageBox.innerHTML = 'Error: Please complete the recaptcha to continue.';
			$('.block-form-valuation__submit, .person-modal__button-submit').removeClass("submit-active");
			$('.block-form-valuation__submit, .person-modal__button-submit').removeAttr("disabled", "disabled");
			return;
		}
		
		let textAreas = form.getElementsByTagName('textarea');
		Array.from(textAreas).forEach(input => {
			inputsObject[input.name] = {
				name: input.name,
				value: input.value,
				placeholder: input.placeholder,
			};
		});
		
		let select = form.getElementsByTagName('select');
		Array.from(select).forEach(input => {
			inputsObject[input.name] = {
				name: input.name,
				value: input.value,
				placeholder: input.name,
			};
		});
		
		let utmParams = [
			{id: 'utm_id', name: 'Campaign ID'},
			{id: 'utm_source', name: 'Campaign Source'},
			{id: 'utm_campaign', name: 'Campaign Name'},
			{id: 'utm_medium', name: 'Campaign Medium'},
			{id: 'utm_term', name: 'Campaign Term'},
			{id: 'utm_content', name: 'Campaign Content'},
			{id: 'referrerUrl', name: 'Referrer URL'}
		]
		
		utmParams.forEach(item => {
			if(sessionStorage.getItem(item.id)) {
				inputsObject[item.id] = {
					name: item.id,
					value: sessionStorage.getItem(item.id),
					placeholder: item.name
				}
			}
		});
		
		console.log(inputsObject);
		$.ajax({
			type: "POST",
			timeout: 0,
			url: send_email_from_form.ajaxurl,
			data: ({ 
				action: "send_email_from_form",
				data: inputsObject
			}),
			success: function(response) {
				if(response == 'true'){//Success
					form.classList.add('hide'); //Hide form
					// Create a new element
          if(!form.classList.contains('block-form-valuation__form')) {
					  let newNode = document.createElement('div');
            form.parentNode.insertBefore(newNode, form.nextSibling);
            newNode.innerHTML = 'Email successfully sent.';
            newNode.classList.add("block-form-valuation__message--active");
            newNode.classList.add("block-form-valuation__message--success");
          } else {
						let inputs = form.querySelectorAll('input, textarea, .block-form-valuation__datetime-placeholder, .g-recaptcha, .block-form-valuation__checkbox-label');
						inputs.forEach(input => {
							input.classList.add('faded');
						});

            messageBox.classList.add("block-form-valuation__message--active");
            messageBox.classList.add("block-form-valuation__message--success");							
            messageBox.innerHTML = 'Email successfully sent.';	
          }
					
				} else {//Failed requests
					console.log('error');
					console.log(response);
					messageBox.classList.add("block-form-valuation__message--active");
					messageBox.classList.add("block-form-valuation__message--error");							
					messageBox.innerHTML = 'Error: Message failed to send.';
					$('.block-form-valuation__submit, .person-modal__button-submit').removeAttr("disabled", "disabled");
					$('.block-form-valuation__submit, .person-modal__button-submit').removeClass("submit-active");
				}
			}
		});		
	})
	
});

window.ready(function () {
	/* Custom Inputs Modals to match desired design */
	let inputsModalGroup = document.querySelectorAll('.paws-inputs-modal');

    inputsModalGroup.forEach((inputsModal, index) => {

		let inputsType = inputsModal.getAttribute('data-input-type');
		let modalTrigger = inputsModal.querySelector('.paws-inputs-modal__trigger');

		// =============== Create modal ============================== /
		if(inputsType == 'select'){
			let modalBox = document.createElement('ul');
			modalBox.classList.add('paws-inputs-modal__box');
			inputsModal.appendChild(modalBox);
				
			let selectEl     = inputsModal.querySelector('select');

			inputsModal.querySelectorAll("select option").forEach((option, index) => {
				//Generate markup from native inputs
				let optionText     = option.text;
				let optionValue    = option.value;
				let optionSelected = option.selected;

				//Create list item
				let listItem = document.createElement('li');
				listItem.setAttribute('data-option-value', optionValue);
				listItem.setAttribute('data-option-index', index);
				optionSelected === true ? listItem.classList.add('active') : '';
				listItem.innerHTML += optionText;

				//Add to modal
				modalBox.appendChild(listItem);

			});

			// =============== Select option ============================== /
			modalBox.querySelectorAll('li').forEach((item, index) => {
				item.onclick = (() => {
					//Get values from the HTML Native input
					let itemOptionValue = item.getAttribute('data-option-value');
					let itemOptionIndex = item.getAttribute('data-option-index');
					let itemOptionText  = item.innerHTML;
					
					//Update active item 
					modalBox.querySelector('li.active').classList.remove('active');
					item.classList.add('active');

					//Update checked value on the HTML Native input (matching index)
					selectEl.selectedIndex = itemOptionIndex;

					//Replace text of the trigger
					inputsModal.querySelector('.paws-inputs-modal__trigger').innerHTML = itemOptionText;

					//Close the modal
					closeModal();
				});
			}); 

			// =============== Show modal ============================== /
			modalTrigger.onclick = (() => {
				showModal(modalBox);
			});
		} else {
			let modalBox = inputsModal.querySelector('.paws-inputs-modal__box');
			
			modalTrigger.onclick = (() => {
				showModal(modalBox);
			});
		}
		
	});


	document.addEventListener('click', (event) => clickedOutsideOfModal(event));
	
	// =============== Show modal ============================== /
	const showModal = (modalBox) => {
		setTimeout(function() {
			modalBox.classList.add('visible');
		}, 10);
	}

	const clickedOutsideOfModal = (e) => {
		if (!e.target.closest('.paws-inputs-modal__box') || e.target.closest('.paws-inputs-modal__mobile-box--exit')) {
			closeModal(e);
		}
	}
	const closeModal = (e) => {
		let modalBoxes = document.querySelectorAll('.paws-inputs-modal__box');
		modalBoxes.forEach((modal) => {
			modal.classList.remove('visible');
		})
	}
})

//Script for Dynamic sliders ( Content and Properties )
window.ready(function () {
	if (document.body.contains(document.getElementsByClassName('dynamic-slider')[0])) {
		document.querySelectorAll('.dynamic-slider').forEach((sliderEl, index) => {
			var dynamicSlider = tns({
				container: sliderEl.querySelector('.dynamic-slider__slider-js'),
				slideBy: 'page',
				autoplay: false,
				mouseDrag: true,
				controls: false,
				nav: false,
				items: 1,
				responsive: {
					766: {
						items: 2
					},

					1080: {
						items: 3
					}
				}

			});

			sliderEl.querySelector(".dynamic-slider__next").onclick = (() => {
				dynamicSlider.goTo("next");
			})

			sliderEl.querySelector(".dynamic-slider__prev").onclick = (() => {
				dynamicSlider.goTo("prev");
			});
		})
	}
})
//Footer
window.ready(function () {
	let tabTrigger = document.querySelector('.footer__searches-trigger');
	let footerTab  = document.querySelector('.footer__searches-tab');
	if (document.body.contains(tabTrigger)) {
		tabTrigger.onclick = (() => { 
			tabTrigger.classList.toggle('active');
			footerTab.classList.toggle('visible');
		})
	}
});
var $ = jQuery;

$(document).ready(function(){
  
  let valuationForms = document.querySelectorAll('.block-form-valuation');
  
  valuationForms.forEach(form => {
    let formHeight = form.querySelector('.block-form-valuation__form').clientHeight;
    let contentHeight = form.querySelector('.block-form-valuation__content').clientHeight;
    let imageHeight = form.querySelector('.block-form-valuation__image-wrapper') ? form.querySelector('.block-form-valuation__image-wrapper').clientHeight : 0;
    console.log(imageHeight);
    let imageWrapperHeight = formHeight - contentHeight - imageHeight + 60;
    //console.log(imageWrapperHeight);
    form.querySelector('.block-form-valuation__image-wrapper--blank').style = `height: ${imageWrapperHeight}px;`
    //console.log(formHeight);
  })

});

/*
* Google Analytics Events
*/
window.ready(function () {
	//List of event triggers
	let triggerDownloadBrochure    = document.querySelector(".js-download-brochure");
	let triggerPhoneNumber         = document.querySelectorAll("a[href^='tel:']");
	let triggerPdfLink             = document.querySelectorAll("a[href*='.pdf']");
	let triggerRelatedServices     = document.querySelectorAll(".service-box-permalink");
	let triggerStampDutyCalculator = document.getElementById("js-stamp-duty-submit");
	let triggerMortgageCalculator  = document.querySelectorAll(".mortgage-calc-input");
	let triggerContactForm         = document.querySelector(".person-modal__button-submit");
	let triggerCaseStudy           = document.querySelectorAll(".js-case-study-link");
	let triggerResearch            = document.querySelectorAll(".js-research-link");

	let contactFormPerson          = document.querySelector(".person-modal__form");
	let contactFormValuation       = document.querySelector(".block-form-valuation__form");
	let currentPageUrl = window.location.href;
	let usedOnceMortgage = false;


	//Download brochure -----------------------------------------------------------
	if (document.body.contains(triggerDownloadBrochure)) {
		triggerDownloadBrochure.onclick = ((e) => { 
			let pageUrl = e.target.href;

			ga('send', {//Click
				hitType: 'event',
				eventCategory: 'Brochure',
				eventAction: 'Download',
				eventLabel: pageUrl
			});
		});
	}

	//Download PDF -----------------------------------------------------------
	if (document.body.contains(triggerPdfLink[0])) {
		triggerPdfLink.forEach(function (el) {
			el.onclick = ((e) => { 
				let pdfUrl = e.target.href;
				ga('send', {//Click
					hitType: 'event',
					eventCategory: 'View / Download PDF Report',
					eventAction: 'Download',
					eventLabel: pdfUrl
				});
			});
		});
	}

	//Clicks on Phone Numbers -------------------------------------------------------
	if (document.body.contains(triggerPhoneNumber[0])) {
		triggerPhoneNumber.forEach(function (el) {
			el.addEventListener('click', function (e) {
				let phoneNumber    = e.target.href;

				ga('send', {//Number Clicked
					hitType: 'event',
					eventCategory: 'Phone',
					eventAction: 'Click',
					eventLabel: currentPageUrl
				});

				ga('send', {//Number Called
					hitType: 'event',
					eventCategory: 'Phone',
					eventAction: 'Call',
					eventLabel: phoneNumber
				});
			});
		});
	}

	//Stamp Duty Calculator -----------------------------------------------------------
	if (document.body.contains(triggerStampDutyCalculator)) {
		triggerStampDutyCalculator.onclick = ((e) => { 
			let pageUrl = e.target.href;

			ga('send', {//Click
				hitType: 'event',
				eventCategory: 'Stamp Duty Calculator',
				eventAction: 'Click',
				eventLabel: pageUrl
			});
		});
	}

	//Mortgage Calculator -----------------------------------------------------------
	if (document.body.contains(triggerMortgageCalculator[0])) {//TODO: Check with Cluttons to avoid SPAM GA calls
		triggerMortgageCalculator.forEach(function (el) {
			el.addEventListener('keyup', function(e){
				if(!usedOnceMortgage){
					usedOnceMortgage = true;
					ga('send', {//Click
						hitType: 'event',
						eventCategory: 'Mortgage Calculator',
						eventAction: 'Click',
						eventLabel: currentPageUrl
					});
				}
			});
		})
	}

	//Contact Form  -----------------------------------------------------------
	if (document.body.contains(triggerContactForm)) {
		contactFormPerson.addEventListener('submit', function(e){
			let pageUrl = e.target.href;
			let inputs = contactFormPerson.getElementsByTagName('input');
			let inputsObject = {};
			Array.from(inputs).forEach(input => { inputsObject[input.name] = input.value; });
			let postType = inputsObject.post_type;
			if(postType == 'person'){
				let personName = inputsObject.post_from;
				ga('send', {//Contact Team Member - Name of Person 
					hitType: 'event',
					eventCategory: 'Contact Team Member',
					eventAction: 'Submit',
					eventLabel: `Contact ${personName}`
				});
			} else if(postType == 'residential' || postType == 'commercial'){
				let propertyTypeText = '';
				let RentOrSale = inputsObject.property_rent_sale;
				postType == 'residential' ? propertyTypeText = 'Residential' : propertyTypeText = 'Commercial';

				ga('send', {//Residential / Commercial - Lettings Enquiry
					hitType: 'event',
					eventCategory: postType + ' - ' + RentOrSale + ' Enquiry',
					eventAction: 'Submit',
					eventLabel: pageUrl
				});
			} else if(postType == 'office'){//Contact Office 
				let officeName = inputsObject.post_from;
				ga('send', {//Residential / Commercial - Lettings Enquiry
					hitType: 'event',
					eventCategory: 'Contact Office',
					eventAction: 'Submit',
					eventLabel: `Office ${officeName}`
				});
			}
		});
	}

	//Valuation form
	if (document.body.contains(contactFormValuation)) {
		contactFormValuation.addEventListener('submit', function(e){

			let inputs = contactFormValuation.getElementsByTagName('input');
			let inputsObject = {};
			Array.from(inputs).forEach(input => { inputsObject[input.name] = input.value; });
			let eventLabelValue = '';
			let gaLabel = inputsObject.form_ga_label;
			inputsObject["form_ga_label"] !== undefined ? eventLabelValue = gaLabel : eventLabelValue = currentPageUrl;

			ga('send', {//Valuation
				hitType: 'event',
				eventCategory: 'Valuation',
				eventAction: 'Submit',
				eventLabel: eventLabelValue
			});
		});
	}
	

	//Case study -----------------------------------------------------------
	if (document.body.contains(triggerCaseStudy[0])) {
		triggerCaseStudy.forEach(function (el) {
			el.onclick = ((e) => { 
				let pageUrl = e.target.href;
				ga('send', {//Click
					hitType: 'event',
					eventCategory: 'Case study',
					eventAction: 'Click',
					eventLabel: pageUrl
				});
			});
		});
	}

	//Case study -----------------------------------------------------------
	if (document.body.contains(triggerResearch[0])) {
		triggerResearch.forEach(function (el) {
			el.onclick = ((e) => { 
				let pageUrl = e.target.href;
				ga('send', {//Click
					hitType: 'event',
					eventCategory: 'Case study',
					eventAction: 'Click',
					eventLabel: pageUrl
				});
			});
		});
	}

	//Related Services -----------------------------------------------------------
	if (document.body.contains(triggerRelatedServices[0])) {
		triggerRelatedServices.forEach(function (el) {
			el.onclick = ((e) => { 
				let pageUrl = e.target.href;
				ga('send', {//Click
					hitType: 'event',
					eventCategory: 'Related Services Click',
					eventAction: 'Click',
					eventLabel: pageUrl
				});
			});
		});
	}


});

let map;

function initMap() {
	document.querySelectorAll('.map').forEach((mapObject, index) => {
		let lat = parseFloat(mapObject.getAttribute('data-lat'));
		let lng = parseFloat(mapObject.getAttribute('data-lng'));
		let zoomLevel = parseFloat(mapObject.getAttribute('data-zoom'));
		let dataBounds = mapObject.getAttribute('data-bounds');
		let myLatLng = {
			lat: lat,
			lng: lng
		};

		mapObject.addEventListener("click", (event) => {
			let propertyPreview = document.getElementById('property-preview')
			if (propertyPreview && propertyPreview.classList.contains('open')) {
				propertyPreview.classList.remove('open');
			}
		});

		if((!lat.isInteger || !lng.isInteger) && typeof newCoords !== 'undefined') {
			myLatLng = {
				lat: (newCoords.north + newCoords.south) / 2,
				lng: (newCoords.east + newCoords.west) / 2,
			}
		}

		map = new google.maps.Map(mapObject, {
			center: myLatLng,
			zoom: zoomLevel ? zoomLevel : 14,
			disableDefaultUI: true,
			streetViewControl: true,
			zoomControl: true,
			styles: styleSettings
		});
		
		if(typeof newCoords !== 'undefined') {
			map.fitBounds({
				south: newCoords.south,
				west: newCoords.west,
				north: newCoords.north,
				east: newCoords.east
			}, {
				top: -100,
				bottom: -100
			});
		}

		const svg = `
		<svg width="149px" height="182px" viewBox="0 0 149 182" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="Artboard" transform="translate(-114.000000, -20.000000)" fill-rule="nonzero">
								<g id="Cluttons_Iconography-08" transform="translate(116.000000, 22.000000)">
										<path d="M144.110012,72.0800023 C144.12001,32.2900023 111.87001,0.020002325 72.0800101,0 C32.2900101,-0.00999767505 0.0200101356,32.2400023 0,72.0300023 C-0.00998986437,90.8800023 7.38001014,108.980002 20.5600101,122.450002 L20.5600101,122.460002 L71.7600101,176.640002 L116.57001,128.710002 C132.55001,111.220002 144.110012,95.0700023 144.110012,72.0800023 Z" id="Path_736" stroke="#FFFFFF" stroke-width="4" fill="#1CAFDA"></path>
										<path d="M72.0600101,41.0500023 L35.6800101,70.9000023 L45.7400101,70.9000023 L45.7400101,108.260002 L61.2000101,108.260002 L61.2000101,88.7300023 C61.2000101,84.0800023 65.8000101,80.3100023 71.4600101,80.3100023 C77.1300101,80.3100023 81.7300101,84.0800023 81.7300101,88.7300023 L81.7300101,108.250002 L97.1900101,108.250002 L97.1900101,70.9000023 L108.45001,70.9000023 L72.0600101,41.0500023 Z" id="Path_737" fill="#FFFFFF"></path>
								</g>
						</g>
				</g>
		</svg>`


		const newSvgMarker = {
			path: "M291.548,107.553a30.411,30.411,0,1,0-52.141,21.264v0l21.607,22.865,18.911-20.23C286.668,124.071,291.548,117.255,291.548,107.553Z",
			fillColor: "#00afda",
			fillOpacity: 1,
			strokeWeight: 2,
			strokeColor: "#ffffff",
			rotation: 0,
			scale: 0.75,
			anchor: new google.maps.Point(262, 155),
			labelOrigin: new google.maps.Point(260, 110)
		};

		if (mapArray.length > 0) {
			const markers = mapArray.map(marker => {

				let newLatLng = {
					lat: parseFloat(marker.lat),
					lng: parseFloat(marker.lng)
				};

				let newMarker;

				if (marker.name) {
					//console.log(marker);

					const newMarker = new google.maps.Marker({
						position: newLatLng,
						icon: {
							origin: new google.maps.Point(0,0),
							anchor: new google.maps.Point(24,59),
							scaledSize: new google.maps.Size(49, 59),
							url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
						},
						map: map,
					});

					const contentString =
						`<div id="content" class="gmaps-infobox"><h1 class="gmaps-infobox__title">Office - ${marker.name.rendered}</h1>` +
						'<div id="bodyContent">' +
						`<p class="gmaps-infobox__text">${marker.unformatted}</p>` +
						`<a class="gmaps-infobox__link" href="/office/${marker.slug}">View more</a>` +
						"</div>" +
						"</div>";
					const infowindow = new google.maps.InfoWindow({
						content: contentString,
					});

          google.maps.event.addListener(map, "click", function(event) {
            infowindow.close();
            //autoCenter();
          });

					newMarker.addListener("click", () => {
						infowindow.open({
							anchor: newMarker,
							map,
							shouldFocus: false,
						});
					});
				} else if (marker.title) {
					newMarker = new google.maps.Marker({
						position: newLatLng,
						icon: {
							origin: new google.maps.Point(0,0),
							anchor: new google.maps.Point(24,59),
							scaledSize: new google.maps.Size(49, 59),
							url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
						},
						map: map,
					});

					const contentString =
						``
					newMarker.addListener("click", () => {
						document.getElementById('property-preview-img').src = marker.img;
						document.getElementById('property-preview-title').innerHTML = marker.title;
						document.getElementById('property-preview-price').innerHTML = marker.price;
						document.getElementById('property-preview').href = marker.permalink;

						//document.getElementById('property-preview').style.transform = "translateX(" + e.pixel.x + "px)"; //Position the modal to the pin marker
						//document.getElementById('property-preview').style.transform += "translateY(" + e.pixel.y + "px)"; //Position the modal to the pin marker
		
						setTimeout(() => {
							document.getElementById('property-preview').classList.add('open');
						}, 200);
					});
				} else {
					newMarker = new google.maps.Marker({
						position: newLatLng,
						icon: {
							origin: new google.maps.Point(0,0),
							anchor: new google.maps.Point(24,59),
							scaledSize: new google.maps.Size(49, 59),
							url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
						},
						map: map,
					});
				}

				return newMarker;

			});

			const renderer = {
				render({
					count,
					position
				}) {

					return new google.maps.Marker({
						label: {
							text: String(count),
							color: "#ffffff",
							fontSize: "18px",
						},
						position,
						icon: newSvgMarker,
						// adjust zIndex to be above other markers
						zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
					})
				}
			}


			new markerClusterer.MarkerClusterer({
				map,
				markers,
				renderer
			});
		}
    
		if (dataBounds === "use") {
			new google.maps.Rectangle({
				strokeColor: "#00afda",
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: "#00afda",
				fillOpacity: 0.35,
				map,
				bounds: {
					north: newCoords.north,
					south: newCoords.south,
					east: newCoords.east,
					west: newCoords.west,
				},
			});
		}
    
	});

}


let styleSettings = [{
		"featureType": "administrative.land_parcel",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi.business",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "road",
		"elementType": "labels.icon",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "road.local",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "transit",
		"stylers": [{
			"visibility": "on"
		}]
	}
]
//Header

window.ready(function () {
	
	let desktopArray = ['res-country', 'res-distance', 'com-distance'];
	let mobileArray = ['res-country-mobile', 'res-distance-mobile', 'com-distance-mobile'];
	
	let addAttribute = items => {
		items.forEach(item => {
			let itemId = document.getElementById(item);
			if(itemId) {
				itemId.disabled = false;
			}
		});
	}
	
	let removeAttribute = items => {
		items.forEach(item => {
			let itemId = document.getElementById(item);
			if(itemId) {
				itemId.disabled = true;
			}
		});
	}
	
	window.addEventListener('resize', function(event) {
		if (window.innerWidth >= 1080) {
			document.querySelector("body").classList.remove("menu-active");
			removeAttribute(mobileArray);
			addAttribute(desktopArray);
		} else {
			addAttribute(mobileArray);
			removeAttribute(desktopArray);
		}
	}, true);
	
	let setMenuSize = () => {
		if (window.innerWidth >= 1080) {
			removeAttribute(mobileArray);
			addAttribute(desktopArray);
		} else {
			addAttribute(mobileArray);
			removeAttribute(desktopArray);
		}
	};
	
	setMenuSize();
	
	let searchTargets = document.querySelectorAll(".header-nav__target-search");
	let mobileMenu = false;
	// ===== OPEN MOBILE MENU ======================================================================
	document
	.querySelector(".header__burger")
	.addEventListener("click", (event) => {
		document.querySelector("body").classList.toggle("menu-active");
		if(mobileMenu) {
			document.body.style.overflow = '';
			mobileMenu = false;
		} else {
			document.body.style.overflow = 'hidden';
			mobileMenu = true;
		}     
		
		
		//Close search form
		document.querySelector(".header-search").classList.remove("opened");
		searchTargets[0].classList.remove("active");
		searchTargets[1].classList.remove("active");
	});
	
	// ===== OPEN DROPDOWN MENU CHILD =================================================================
	const dropdownTargets = document.querySelectorAll('.header-nav__target-dropdown');
	dropdownTargets.forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			var parentElement = el.parentElement;
			el.classList.toggle("opened"); //Update chevron style
			parentElement.nextElementSibling.classList.toggle("dropdown-active"); //Show dropdown
		})
	});
	
	// ===== OPEN LOGIN FORM =====================================================================
	document
	.querySelector(".header-nav__target-user")
	.addEventListener("click", (event) => {
		document.querySelector(".header-nav__target-user").classList.toggle("active");
		document.querySelector(".header-login-modal").classList.toggle("opened");
		
		//Close search form
		document.querySelector(".header-search").classList.remove("opened");
		var searchTargets = document.querySelectorAll(".header-nav__target-search");
		searchTargets[0].classList.remove("active");
		searchTargets[1].classList.remove("active");
		//Close menu
		document.querySelector("body").classList.remove("menu-active");
	});
	
	
	// ===== OPEN SEARCH FORM =====================================================================
	searchTargets.forEach(function (el) {
		el.addEventListener('click', function (e) {

      if (window.location.href.includes("/search/")) {
        searchPage();
      } else {
        activeSearch();	
			  document.querySelector(".header-search").classList.toggle("opened");
      }
			
			//Close menu
			document.querySelector("body").classList.remove("menu-active");
			
			//Close login modal
			document.querySelector(".header-nav__target-user").classList.remove("active");
			document.querySelector(".header-login-modal").classList.remove("opened");
		})
	});
	
	function activeSearch(){
		searchTargets.forEach(function (el) {
			el.classList.toggle("active");
		})
	}

  function searchPage(){
    let searchInput = document.getElementById('search-page-input');
    searchInput.value = '';
    searchInput.focus();
  }
	
});



document.addEventListener("DOMContentLoaded", function() {
	if (
		document.body.contains(document.getElementsByClassName('block-person__button')[0])
		||
		document.body.contains(document.getElementsByClassName('js-email-contact-modal')[0])
	) {
		//CREATE OVERLAY AND ADD TO DOM
		let modal = document.getElementById('contact-modal');
		let modalOverlay;
		let bodyEl = document.querySelector('body');

		if( !document.getElementsByClassName('overlay') ){
			modalOverlay = document.createElement('div');
			modalOverlay.className = 'overlay';
			bodyEl.prepend(modalOverlay);
		}
		else {
			modalOverlay = modal.parentNode;
		}

		const closeSpan				= document.getElementsByClassName("close")[0];
		const modalTriggers			= document.querySelectorAll('.block-person__button');
		const modalTriggerEmail		= document.querySelectorAll('.js-email-contact-modal');
		const modalTriggerPerson	= Array.from(modalTriggers);
		
		if( document.body.contains(closeSpan) ){
			closeSpan.onclick = (() => {
				hideModal();
			});
		}
		
		modalOverlay.onclick = ((e) => {
			if( e.target === e.currentTarget ){
				hideModal();
			}
		});
		
		//HIDE MODAL
		const hideModal = () => {
			modal.classList.remove('visible');
			bodyEl.classList.remove('has-overlay');
			modalOverlay.classList.remove('visible');
			document.body.style.overflow = '';
		}
		
		modalTriggerPerson.map((data) => {
			data.addEventListener('click', (e) => {
				e.preventDefault();
				document.body.style.overflow = 'hidden';
				modalOverlay.classList.add('visible');
				modal.classList.add('visible')
				modal.querySelector("[data-modal-person-photo]").src = data.getAttribute('data-person-photo') ? data.getAttribute('data-person-photo') : '';
				modal.querySelector("[data-modal-person-job]").innerHTML = data.getAttribute('data-person-job');
        if(modal.querySelector("[data-modal-person-name-short]")) {
          modal.querySelector("[data-modal-person-name-short]").innerHTML = data.getAttribute('data-person-name') ? data.getAttribute('data-person-name').split(' ')[0] : '';
        }
				modal.querySelector("[data-modal-person-name]").innerHTML = data.getAttribute('data-person-name');
				modal.querySelector("[data-modal-person-phone]").innerHTML = data.getAttribute('data-person-phone') ? 'T +44 (0) ' + data.getAttribute('data-person-phone') : '';
				modal.querySelector("[data-modal-post-from]").value = data.getAttribute('data-post-from');
				modal.querySelector("[data-post-type]").value = data.getAttribute('data-post-type');
				modal.querySelector("[data-modal-post-id]").value = data.getAttribute('data-post-id');
				
			});
		});
		
		/*
		* Email contact
		*/
		modalTriggerEmail.forEach( function(el){
			el.addEventListener('click', function(e){
				e.preventDefault();
				document.body.style.overflow = 'hidden';
				modalOverlay.classList.add('visible');
				modal.classList.add('visible');

				if(
					modal.querySelector("[data-post-type]").value !== 'residential'
					&&
					modal.querySelector("[data-post-type]").value !== 'commercial'
				) {
					modal.querySelector("[data-modal-post-from]").value = el.getAttribute('data-post-from');
					modal.querySelector("[data-modal-post-id]").value = el.getAttribute('data-post-id');
					modal.querySelector("[data-post-type]").value = el.getAttribute('data-post-type');
				}
			})
		});
	}
});



window.ready(function () {
    //Filters for the listing pages 
    document.querySelectorAll('.js-post-filter').forEach((filterElement, index) => {
        let filterName  = filterElement.getAttribute('data-filter-name');
        let filterValue = filterElement.getAttribute('data-filter-value');
        let currentUrl  = document.location.search;

        filterElement.onclick = (() => {
           
            if(filterValue){
                if(filterName == 'post_letter'){
                    let fullUrl = document.location;
                    let fullUrlHref = fullUrl.href;

                    if(!fullUrlHref.includes("?")){//Add if no param yet
                        fullUrlHref += '?';
                    }

                    fullUrlHref = addUrlParam(fullUrlHref, filterName, filterValue);

                    //Reset pagination
                    fullUrlHref = fullUrlHref.replace(/[0-9]/g, '');
                    fullUrlHref = fullUrlHref.replace('/page/', '');
                    window.location = fullUrlHref; //Redirect
                } else if(filterName == 'category_name' || filterName == 'property_type'){//Category name filter
                    let fullUrl = document.location;
                    let fullUrlHref = fullUrl.href;
                       if(!fullUrlHref.includes("?") && filterValue){//Add if no param yet
                        fullUrlHref += '?';
                    }
                    fullUrlHref = addUrlParam(fullUrlHref, filterName, filterValue);

                    //Reset pagination
                    fullUrlHref = fullUrlHref.replace(/[0-9]/g, '');
                    fullUrlHref = fullUrlHref.replace('/page/', '');

                    window.location = fullUrlHref; //Redirect
                }else {//Any other filters
                    if(currentUrl.indexOf(filterName + '=' + filterValue) > -1) {
                        currentUrl = currentUrl.replace(filterName + '=' + filterValue,'');
                    }
                    let newUrl =  addUrlParam(currentUrl, filterName, filterValue);
                    window.location.search = newUrl; //Redirect
                }
                  
            } else {//Remove from url if empty
                let fullUrl     = document.location;
                let fullUrlHref = fullUrl.href;
                let newUrl      = removeUrlParam(fullUrlHref, filterName, '');
                    newUrl      = newUrl.replace(/[0-9]/g, '');
                    newUrl      = newUrl.replace('/page/', '');
                if(filterName = 'post_letter' && !filterValue) {
                    newUrl      = newUrl.replace('?', '?');
                } else {               
                    newUrl      = newUrl.replace('?', '');
                }
                    
				window.location = newUrl; //Redirect
            }
        });
    });
})
var $ = jQuery;

window.ready(function () {
  //Smooth Anchors

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top 
                    }, 500, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    //Property page detail
    if (document.body.contains(document.getElementsByClassName('block-property-details')[0])) {
        var previousUrl = document.referrer;

        if(	window.history.length > 1 && !previousUrl.includes('wp-admin')){//Show Back to property listing button
            document.querySelector('.block-property-details__back').classList.add('visible');
        }
    }
});

 
var addUrlParam = function(search, key, val){
    var newParam = key + '=' + val,
        params = '?' + newParam;
  
    // If the "search" string exists, then build params from it
    if (search) {
      // Try to replace an existance instance
      params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);
  
      // If nothing was replaced, then add the new param to the end
      if (params === search) {
        params += '&' + newParam;
      }
    }
  
    return params;
  };

var removeUrlParam = function(search, key, val){
    if (search) {
        // Remove param from url
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + '');
    }

    return params;
};

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState != 'loading')
                fn();
        });
    }
}
window.ready(function () {
	let blocksSearchBox = document.querySelectorAll('.block-search-box');

	blocksSearchBox.forEach((block, index) => {
		block.querySelectorAll('.block-search-box__tab').forEach((filterElement, index) => {
			let filterValue = filterElement.getAttribute('data-filter-value');
			
			filterElement.onclick = (() => { 
				let otherTab = 0;
				index == 0 ? otherTab = 1 : '';

				//Hide current form
				block.querySelectorAll('.block-search-box__tab')[otherTab].classList.remove('active');
				block.querySelectorAll('.block-search-box__form')[otherTab].classList.remove('visible');

				//Show other form
				filterElement.classList.add('active');
				block.querySelectorAll('.block-search-box__form')[index].classList.add('visible');

				block.querySelectorAll('.block-search-box__mobile-show-filters.active').forEach(block => {
					block.classList.remove('active');
				});
				block.querySelectorAll('.block-search-box__filters.active').forEach(block => {
					block.classList.remove('active');
				});

			});
		});

		let showFilterButton = block.querySelectorAll('.block-search-box__mobile-show-filters');

		showFilterButton.forEach(block => {

			let filters = block.nextElementSibling.children[0];

			block.addEventListener('click', () => {
					block.classList.contains('active') ? block.classList.remove('active') : block.classList.add('active');
					filters.classList.toggle('active');
			}, false);
		})
	});

	let forms = document.querySelectorAll('.block-search-box__form');

	forms.forEach(form => {
		form.addEventListener('submit', function () {
			var allInputs = form.querySelectorAll('input,textarea,select');
	
			for (var i = 0; i < allInputs.length; i++) {
					var input = allInputs[i];
	
					if (input.name && !input.value) {
							input.name = '';
					}
			}
		});
	})
})
window.ready(function () {
	if (document.body.contains(document.getElementsByClassName('share-js')[0])) {
		document
			.querySelector(".share-js")
			.addEventListener("click", (event) => {
				document.querySelector(".social-share__icons").classList.toggle("active");
			});
	}
});
//Script for Sliders
window.ready(function () {
	//Slider block
	if (document.body.contains(document.getElementsByClassName('block-slider')[0])) {
		document.querySelectorAll('.block-slider').forEach((sliderEl, index) => {
			console.log(index);
			let activeSlideNumber = document.getElementsByClassName('block-slider__current-slide')[index];
			let totalSlidesNumber = document.getElementsByClassName('block-slider__total-slide')[index];

			var slider = tns({
				container: sliderEl.querySelector('.block-slider__slides'),
				slideBy: 'page',
				autoplay: false,
				controls: false,
				nav: false,
				items: 1,
			});

			let info = slider.getInfo(),
				totalSlides = info.slideCount,
				indexCurrent = info.displayIndex;

			totalSlidesNumber.textContent = totalSlides;
			activeSlideNumber.textContent = indexCurrent;

			sliderEl.querySelector(".block-slider__next").onclick = (() => {
				slider.goTo("next");
				let info = slider.getInfo(),
					indexCurrent = info.displayIndex;
				activeSlideNumber.textContent = indexCurrent;
			})

			sliderEl.querySelector(".block-slider__prev").onclick = (() => {
				slider.goTo("prev");
				let info = slider.getInfo(),
					indexCurrent = info.displayIndex;
				activeSlideNumber.textContent = indexCurrent;
			});
		});
	}

	//Property Gallery Slider
	if (document.body.contains(document.getElementsByClassName('block-property-gallery')[0])) {
		document.querySelectorAll('.block-property-gallery').forEach((sliderGalleryEl) => {
	
			var sliderGallery = tns({
				container: sliderGalleryEl.querySelector('.block-property-gallery__slides'),
				autoplay: false,
				controls: false,
				nav: true,
				items: 1,
				navAsThumbnails: true,
				navContainer: '.block-property-gallery__previews',
				mouseDrag: true
			});
	
			sliderGalleryEl.querySelector(".block-property-gallery__next").onclick = (() => {
				sliderGallery.goTo("next");
			})
	
			sliderGalleryEl.querySelector(".block-property-gallery__prev").onclick = (() => {
				sliderGallery.goTo("prev");
			});
		});
	}

	//Search result sliders
	if (document.body.contains(document.getElementsByClassName('block-search-result__slider')[0])) {
		document.querySelectorAll('.block-search-result__slider').forEach((sliderSearchEl) => {
	
			var sliderSearchResult = tns({
				container: sliderSearchEl.querySelector('.block-search-result__slides'),
				autoplay: false,
				controls: false,
				nav: false,
				items: 1,
				mouseDrag: true,
			});
	
			sliderSearchEl.querySelector(".block-search-result__next").onclick = ((e) => {
				e.preventDefault();
				sliderSearchResult.goTo("next");
			})
	
			sliderSearchEl.querySelector(".block-search-result__prev").onclick = ((e) => {
				e.preventDefault();

				sliderSearchResult.goTo("prev");
			});
		});
	}
})
var $ = jQuery;

$(document).ready(function () {
	// alert('test');
	$('.acf-synchronize__button').click(function(e){
		e.preventDefault();
		var type = this.getAttribute('data-type');
		var target = this;
		target.classList.add("loading");

		$.ajax({
			type: "POST",
			timeout: 0,
			url: synchronize_from_platform.ajaxurl,
			data: ({ 
				action: "synchronize_from_platform",
				type: type
			}),
			success: function(response) {
				target.classList.remove("loading");

				if(response == 'true'){//Success

					console.log('success request');
					$('.acf-synchronize-message').addClass('success');
					$('.acf-synchronize-message').text('Successful synchronization');
					setTimeout(function () {
						$('.acf-synchronize-message').removeClass('success');
					}, 2000);

				} else {//Failed request

					$('.acf-synchronize-message').addClass('error');
					$('.acf-synchronize-message').text('Error in the request');
					setTimeout(function () { 
						$('.acf-synchronize-message').removeClass('error');
					}, 2000);
				}
			}
		});
	})

});
//Script for Video Gutenberg Block
window.ready(function () {
	//Video - Vimeo block
	if (document.body.contains(document.getElementsByClassName('block-video')[0])) {
		let footer                 = document.querySelector('.footer');
		let bodyEl                 = document.querySelector('body');
		let videoPlayButtons       = document.querySelectorAll('.block-video__play-button');
		let videoModal             = document.createElement('div');
		    videoModal.className   = 'video-modal';
		    videoModal.innerHTML   = '<div class="video-modal__wrapper"><div class="video-modal__content"></div>	<div class="video-modal__close"><button class="video-modal__close-icon"><span></span><span></span><span></span></button></div></div>';
		let videoOverlay           = document.createElement('div');
		    videoOverlay.className = 'overlay';
		let vimeoRegex             = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;

		//Add elements to DOM
		footer.parentNode.insertBefore(videoModal, footer); //Create video modal
		bodyEl.prepend(videoOverlay); //Create overlay

		let videoModalEl      = document.querySelector('.video-modal');
		let videoModalContent = document.querySelector('.video-modal__content');
		let closeModalButton  = document.querySelector('.video-modal__close');


		// ===== TRIGGER VIDEO =====================================================================
		document.querySelectorAll('.block-video').forEach((videoEl, index) => {
			let videoSrc = videoEl.getAttribute('data-video-link');
			if(videoSrc){
				videoPlayButtons[index].onclick = (() => {
					showModal(videoSrc);
				});
			}
		});

		videoOverlay.onclick = (() => {
			hideModal();
		});

		// ===== SHOW MODAL ========================================================================
		const showModal = (videoSrc) => {
			bodyEl.classList.add('has-overlay');
			var result = videoSrc.match(vimeoRegex);
			let videoId           = result[1];

			//Show overlay
			videoOverlay.classList.add('visible');

			//Create vimeo iframe
			videoModalContent.innerHTML = '<iframe class="video-modal__iframe" src="https://player.vimeo.com/video/' + videoId + '" width="100%" height="auto" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			videoModalEl.classList.add('visible');

			closeModalButton.onclick = (() => {//Hide modal
				hideModal();
			});
		}

		// ===== HIDE MODAL =====================================================================
		const hideModal = () => {
      videoModalContent.innerHTML = '';
			videoModalEl.classList.remove('visible');
			bodyEl.classList.remove('has-overlay');
			videoOverlay.classList.remove('visible');
		}

	}
	//Property video
	if (document.body.contains(document.getElementsByClassName('block-property-video')[0])) {//VIMEO 
		let footer                 = document.querySelector('.footer');
		let bodyEl                 = document.querySelector('body');
		let videoPlayButtons       = document.querySelectorAll('.block-property-video__play-button');
		let videoModal             = document.createElement('div');
			videoModal.className   = 'video-modal';
			videoModal.innerHTML   = '<div class="video-modal__wrapper"><div class="video-modal__content"></div>	<div class="video-modal__close"><button class="video-modal__close-icon"><span></span><span></span><span></span></button></div></div>';
		let videoOverlay           = document.createElement('div');
			videoOverlay.className = 'overlay';
		let vimeoRegex             = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;

		//Add elements to DOM
		footer.parentNode.insertBefore(videoModal, footer); //Create video modal
		bodyEl.prepend(videoOverlay); //Create overlay

		let videoModalEl      = document.querySelector('.video-modal');
		let videoModalContent = document.querySelector('.video-modal__content');
		let closeModalButton  = document.querySelector('.video-modal__close');


		// ===== TRIGGER VIDEO =====================================================================
		document.querySelectorAll('.block-property-video').forEach((videoEl, index) => {
			let videoSrc = videoEl.getAttribute('data-video-link');
			if(videoSrc){
				videoPlayButtons[index].onclick = (() => {
					showModal(videoSrc);
				});
			}
		});

		videoOverlay.onclick = (() => {
			hideModal();
		});

		// ===== SHOW MODAL ========================================================================
		const showModal = (videoSrc) => {
			bodyEl.classList.add('has-overlay');
			var result = videoSrc.match(vimeoRegex);
			let videoId           = result[1];

			//Show overlay
			videoOverlay.classList.add('visible');

			//Create vimeo iframe
			videoModalContent.innerHTML = '<iframe class="video-modal__iframe" src="https://player.vimeo.com/video/' + videoId + '" width="100%" height="auto" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
			videoModalEl.classList.add('visible');

			closeModalButton.onclick = (() => {//Hide modal
				hideModal();
			});
		}

		// ===== HIDE MODAL =====================================================================
		const hideModal = () => {
      videoModalContent.innerHTML = '';
			videoModalEl.classList.remove('visible');
			bodyEl.classList.remove('has-overlay');
			videoOverlay.classList.remove('visible');
		}

	}
})