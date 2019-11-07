function generateForm(requireAnswer, formConfig) {
	// Generate HTML Form Entries based off form data provided in inputs.json
	
	var formHTML = ''; // Container for generated HTML

	for (const category of formConfig) {
		// Iterate through Category objects

		if (category.type) {
			// Category is actually an item in a Top-level Category with Sub-Categories -> Generate Item HTML instead of Category HTML

			formHTML = generateItem(requireAnswer, category);
			continue; // Prevent "Category" from being parsed normally
		} 

		formHTML += '<div class="form-category">\n<p class="form-categoryTitle">' + category.name + '</p>\n'; // Category-Level Division & Title

		if (category.categories) {
			// Category is a Top-level Category with Sub-Categories -> Iterate One Level Deeper

			formHTML += generateForm(requireAnswer, category.categories);

		} else {
			// Category is normal -> parse Items

			for (const item of category.items) {
				// Iterate through Items in current Category
	
				formHTML += generateItem(requireAnswer, item);
	
			}
		}

		formHTML += '</div>\n'; // Break Category-Level Division
	}

	return formHTML; // Return generated Form HTML
}

function generateItem(requireAnswer, item) {
	// Generate HTML Entries for a given Form Item

	var itemHTML = ''; // Container for generated HTML
	var additionalArguments = ''; // Additional arguments to add to end of Item element
	var titleSuffix = '' // Characters to add to the end of the Item Title
	var itemRequired = requireAnswer && item.required != false; // Determine Whether Item is Required

	if (itemRequired) { // If Item Required, add 'required' to additionalArguments
		additionalArguments += ' required';
		titleSuffix += '<span class="form-required">*</span>'
	}

	if (item.id === undefined) throw Error(`[FORM] Item ${item.name} does not have an id:\n${JSON.stringify(item, false, 3)}`); // Check for Missing Item IDs

	switch (item.type) {
		// Generate Item HTML based on Item Type

		case 'int': // Integer Input Field
			itemHTML += '<div class="form-item form-int">\n<p class="form-item-name">' + item.name + titleSuffix + '</p>\n<div class="form-down"></div>\n<input type="number" id="' + item.id + '" class="form-input" name="' + item.id + '" max="' + item.max + '" min="' + item.min + '"' + additionalArguments + '/>\n<div class="form-up"></div>\n'; // Item Division & Content
		break;

		case 'dropdown': // Dropdown Box
			itemHTML += '<div class="form-item form-dropdown">\n<p class="form-item-name">' + item.name + titleSuffix + '</p>\n<select id="' + item.id + '" class="form-select" name="' + item.id + '"' + additionalArguments + '>\n'; // Item-level Division, Title, & Select Open Tag

			if (!itemRequired) { // If Item is not required, add blank option HTML to dropdown
				itemHTML += '<option value="na">N/A</option>\n';
			}

			for (const option of item.options) {
				// Iterate through dropdown Item options

				itemHTML += '<option value="' + option.value + '">' + option.optionName + '</option>\n'; // Individual dropdown option HTML
			}

			itemHTML += '</select>\n'
		break;

		case 'string': // Text Input Field
			itemHTML += '<div class="form-item form-string">\n<p class="form-item-name">' + item.name + titleSuffix + '</p>\n<input type="text" id="' + item.id + '" class="form-input" name="' + item.id + '" maxlength="' + item.max + '" minlength="' + item.min + '"' + additionalArguments + '/>\n'; // Item Division & Content
		break;

		case 'longString': // Textarea (Paragraph) Field
			itemHTML += '<div class="form-item form-longString">\n<p class="form-item-name">' + item.name + titleSuffix + '</p>\n<textarea type="text" id="' + item.id + '" class="form-textarea" name="' + item.id + '" maxlength="' + item.max + '" minlength="' + item.min + '"' + additionalArguments + '></textarea>\n'; // Item Division & Content
		break;

	}

	itemHTML += '</div>\n'; // Break Item-level Division

	return itemHTML; // return generated Item HTML
}

module.exports = { // Exports to expose to main.js
	generateHTML: generateForm
}