var defaultTasks=[	{id: 1, task: 'Laundry', complete: false},
					{id: 2, task: 'Take out the Trash', complete: true},
					{id: 3, task: 'Homework', complete: false}	];
var currentTasks = [];
var completedTasks = 0;
var incompleteTasks = 0;

	
function addDefaultTasks()
{
	var i,savedTasksString,savedTasks;
	google.charts.load('current', {'packages':['corechart']});
	savedTasksString = localStorage.getItem("savedTasks");
	if(savedTasksString.length !== 0)
	{
		savedTasks = JSON.parse(savedTasksString);
		for (i=0; i<savedTasks.length; i++)
		{
			addSingleTask(savedTasks[i]);
		}	
	}
	if(currentTasks.length === 0)
	{
		for (i=0; i<defaultTasks.length; i++)
		{
			addSingleTask(defaultTasks[i]);
		}		
	}

}

function addSingleTask(newTask)
{
	var i,taskTable,row,cell,NewIDFound,IDExists;
	
	if (newTask === null)
	{
		return;
	}	
	
	if (newTask.id === "")
	{
		if (newTask.task === "")
		{
			alert("Task name cannot be empty.");
			return;
		}
		
		for(i=0; i<currentTasks.length; i++)
		{
			if (currentTasks[i].task === newTask.task)
			{
				alert("Task " + newTask.task + " already exists.");
				return;
			}
		}
		
		newTask.id = 0;
		NewIDFound = false;
		while(!NewIDFound)
		{
			newTask.id++;
			NewIDFound = true;
			for(i=0; i<currentTasks.length; i++)
			{
				if (currentTasks[i].id === newTask.id)
				{
					NewIDFound = false;
					break;
				}
			}
		}
		document.getElementById("taskInput").value = "";
	}
	
	taskTable = document.getElementById("taskTable");
	if (taskTable === null)
	{
		return;
	}
	
	row = taskTable.insertRow(taskTable.rows.length);
	row.id = "row"+newTask.id;
	row.className = "grayRow";
	cell = row.insertCell(0);
	if (newTask.complete)
	{
		completedTasks++;
		cell.innerHTML = "<input type='checkbox' id='complete" + newTask.id + "' onclick='toggleTask(this)' checked></input>";
	}
	else
	{
		incompleteTasks++;
		cell.innerHTML = "<input type='checkbox' id='complete" + newTask.id + "' onclick='toggleTask(this)'></input>";
	}	
	cell.className = "taskCheckbox";
	cell = row.insertCell(1);
	cell.innerHTML = newTask.task;
	cell.className = "taskText";
	cell = row.insertCell(2);
	cell.innerHTML = "<button id='delete" + newTask.id + "' onclick='deleteTask(this)'>Delete</button>";
	cell.className = "rightColumn";
	currentTasks.push(newTask);
	updateTaskCountTable();
	updateVisualization();
}

function updateTaskCountTable()
{
	var taskCountTable,row;
	taskCountTable = document.getElementById("taskCountTable");
	if (taskCountTable === null)
	{
		return;
	}
	row = taskCountTable.rows[1];
	row.cells[0].innerHTML = completedTasks;
	row.cells[1].innerHTML = incompleteTasks;
	row.cells[2].innerHTML = completedTasks+incompleteTasks;
}

function addTask()
{
	var inputValue;
	inputValue = document.getElementById("taskInput").value;
	addSingleTask({id: "", task: inputValue, complete: false});
}

function toggleTask(element)
{
	var elementID,taskID,i;
	if (element === null)
	{
		return;
	}
	elementID = element.id;
	taskID = elementID.substring(8,elementID.length);
	for(i=0; i<currentTasks.length; i++)
	{
		if (currentTasks[i].id.toString() === taskID)
		{
			currentTasks[i].complete = !currentTasks[i].complete;
			if (currentTasks[i].complete)
			{
				completedTasks++;
				incompleteTasks--;
			}
			else
			{
				completedTasks--;
				incompleteTasks++;
			}
			break;
		}
	}
	updateTaskCountTable();
	updateVisualization();
}

function deleteTask(element)
{
	var elementID,taskID,i,taskTable,j;
	if (element === null)
	{
		return;
	}
	elementID = element.id;
	taskID = elementID.substring(6,elementID.length);
	for(i=0; i<currentTasks.length; i++)
	{
		if (currentTasks[i].id.toString() === taskID)
		{
			if (currentTasks[i].complete)
			{
				completedTasks--;
			}
			else
			{
				incompleteTasks--;
			}			
			currentTasks.splice(i,1);
			element.parentNode.parentNode.remove();		
			break;
		}
	}
	updateTaskCountTable();
	updateVisualization();
}


function saveTasks()
{
	var savedTasksString;
	savedTasksString = JSON.stringify(currentTasks);
	localStorage.setItem("savedTasks", savedTasksString);
}

function updateVisualization(){   
    google.charts.setOnLoadCallback(drawChart);
}
function drawChart() {
    
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Tasks');
    data.addRows([
      ['Completed', completedTasks],
      ['Incomplete', incompleteTasks]
    ]);
    
    // Set chart options
    var options = {'title':'Task Visualization'};
    
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('visualization'));
    chart.draw(data, options);
}
