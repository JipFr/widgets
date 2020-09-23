// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: check-circle;


// Variables
const userId = 834;
const API = "https://api.getmakerlog.com/";

  // Colors
let textSecondary = new Color("#9ad8a5");
let textPrimary = new Color("#ffffff");
let textPrimary2 = new Color("#cdf0d4");

// Widget config
let data = await getData();
let widget = await createWidget(data);

if (!config.runsInWidget) {
	await widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();

// Makerlog data
async function getData() {
	
	// Get days
	let d = new Date();
	let daysData = [];
	let url = `${API}users/${userId}/stream/`;
	for(let i = 0; i < 7; i++) { 

		let day = await getDay(url);
		daysData.push(day);
		url = day.previous_url;

	}

	// Get tasks from all data
	let tasks = daysData.map(d => d.data).flat();
	let statuses = tasks.map(task => task.done ? "done" : "todo");
	let statusCount = {
		"done": 0,
		"todo": 0
	};
	for(let status of statuses) {
		statusCount[status]++;
	}

	return statusCount;
}

async function getDay(url) {
	// Request data
	let dataReq = new Request(url);
	let data = await dataReq.loadJSON();
	return data;

}

// Widget
async function createWidget(counts) {

	// Generate widget
	let widget = new ListWidget();

	  // Bg colors
	widget.backgroundColor = new Color("#00B77A");

	  // Content
	widget.addSpacer();

	  // Top subtitle
	addSubtitle(widget, "Recent to-dos");

	 // to-do count
	addTitle(widget, `${counts.todo} to-do${counts.todo !== 1 ? "s" :""}`);

	// Bottom content
	widget.addSpacer(8);

	// Done tasks
	addSubtitle(widget, "Recently done")
	addAltTitle(widget, `${counts.done} tasks`);


	// End of content
	widget.addSpacer();

	return widget;
}

function addSubtitle(widget, str) {
	let subtitle = widget.addText(str);
	subtitle.font = Font.boldSystemFont(16);
	subtitle.textColor = textSecondary;
	return subtitle;
}
function addTitle(widget, str) {
	let title = widget.addText(str);
	title.font = Font.boldSystemFont(24);
	title.textColor = textPrimary;
	return title;
}

function addAltTitle(widget, str) {
	let title = widget.addText(str);
	title.font = Font.boldSystemFont(24);
	title.textColor = textPrimary2;
	return title;
}


function prettyPrint(json) {
	let str = JSON.stringify(json, null, 2);
	QuickLook.present(str);
}