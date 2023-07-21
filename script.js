const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");
const dateInput = document.getElementById("todoDate");
const tagInput = document.getElementById("todoTags");
const todoCat = document.getElementById("todo-Category");



//VARS

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;//array will not work on -1

//TARGETTING THE DROPDOWN LIST OPTIONS


//1ST RENDER
showTodos();

//FORM SUBMITITNG

form.addEventListener('submit', function(event) {
    event.preventDefault();


    saveTodo();
    showTodos();
    localStorage.setItem('todos',JSON.stringify(todos));
});


//SAVING TO-DOS

function saveTodo(){
    const todoValue = todoInput.value;
    const todoDate = dateInput.value;
    const todotags = tagInput.value;


//Checks if the Todo is empty:
const isEmpty = todoValue ==='';
const tisEmpty = todotags ==='';

//Check for duplicate todos
const isDuplicate = todos.some((todo) => todo.value === todoValue && todo.date === todoDate);
const TagisDuplicate = todos.some((todo)=> todo.tags === todotags);
if(isEmpty){
    ShowNotification("Plz add a Todo Input!")
}
else if(tisEmpty){
    ShowNotification("Plz add some Tags!")
}
else if(isDuplicate){
        ShowNotification('Task Already Exits!')
    
}
else if(TagisDuplicate){
    ShowNotification('Tag Already Exists!')
}

else{
    const tags =todotags.split(' ').map((tag) => {
        return tag;
    });
    console.log(tags)
    if(EditTodoId>=0){
        todos = todos.map((todo,index) =>({
                ...todo,
                value : index === EditTodoId ? todoValue :todo.value,
                tags: index === EditTodoId ? tags : todo.tags,
                date: index ===EditTodoId ? todoDate:todo.date
        }));
        EditTodoId=-1;
    }else{
        todos.push({
            value: todoValue,
            date: todoDate,
            tags:tags,
            checked: false,
            color: '#019f55;' 
        });
        
    }
    todoInput.value = ''; //clear input box after adding it
    dateInput.value =''; 
    tagInput.value = ''; 
}

}

//SHOW TASKS TO USER
function showTodos(){

if(todos.length === 0){
    todosListEl.innerHTML = '<center>No Tasks To Do !</center>';
    return;
}

//CLEAR ELEMNENT BEFORE RERENDERING

todosListEl.innerHTML = '';
    todos.forEach((todo,index) => {

        const dueDate = new Date(todo.date);
        const today = new Date();
        let daysLeft = 0;


        // Calculate the number of days left using a for loop
        for (let date = today; date < dueDate; date.setDate(date.getDate() + 1)) {
            daysLeft++;
           
        }
        daysLeft+=" Days Left";
        if(daysLeft==="0 Days Left"){
            daysLeft="Overdue";
            }
        // if(today.toDateString===dueDate.toDateString){
        //     console.log(today.toDateString);
        //         daysLeft="Today";
        //     }

        
        let tagsHTML = "";

        const tagColors = ['#8B0000', '#A0522D', '#2E8B57', '#800080', '#663399' , '#191970','#483D8B','#4169E1'];
        let colorIndex = 0;

        if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach((tag) => {
            let tagColor = tagColors[colorIndex];
            colorIndex = (colorIndex + 1) % tagColors.length; 
            tagsHTML += `<span class="tag" style="background-color: ${tagColor}">${tag}</span> `;
        });
    }

    todoCat.innerHTML =`
    <div class="todo-Category">
        <select id="my-dropdown">
            <option class="opt" value="all">All</option>
            <option class="opt" value="groceries">Groceries</option>
            <option class="opt" value="work">Work</option>
            <option class="opt" value="health">Health</option>
        </select>
    </div>`


    const categoryDropdown = document.getElementById('my-dropdown');

    categoryDropdown.addEventListener('change', filterTodos);

    // const selectedCategory = categoryDropdown.value;
    //  filterTodos(selectedCategory);

    let selectedCategory = 'all';

    function filterTodos() {

        selectedCategory = categoryDropdown.value; //get value like all,groceries,work or health here
        console.log(selectedCategory)
    
        const todoItems = document.getElementsByClassName('todo'); //this is the todo div below having all the todos
      
        //This will will get each todo.value in the <p> tag and change the text to lowercase
        for (let i = 0; i < todoItems.length; i++) {
          const todoItem = todoItems[i];
          const todoText = todoItem.querySelector('p').textContent.toLowerCase();
          
          // Check if category is either ALL or is Grocieries,Work or Health and show todos accroding to that
          if (selectedCategory === 'all' ||  checkForWords(todoText, selectedCategory)){

            // Show the todo item
            console.log(checkForWords)
            todoItem.style.display = '';

          } else {

            // Hide the todo item
            todoItem.style.display = 'none';
          }
        }
      }


      //this funtion will check if each todo's todotext has the words realted to the selected categoryy
      function checkForWords(todoText,category) { 

        const categoryArray = { 
             //Category Obejct having three categories keys-value pairs 
            groceries: ['grocery', 'shopping', 'food', 'market', 'mart', 'items', 'eggs','coke','colddrinks','vegetables','food','dinner'],
            work: ['work', 'project', 'task', 'complete', 'time', 'phone', 'duedate', 'contract','sign','new','tie'],
            health: ['health', 'exercise', 'fitness', 'cycling', 'walking', 'medicine','run','running','swimming','juice','shake',]
        };

        //here the
        const CategoryActive = categoryArray[category] || [];

        for (const word of CategoryActive) {

          if (todoText.includes(word)) {
                return true; 
                //true means this todo has words related to the category
          }
        }
      
        return false;
             //false means todo is not of this Category
        //it will fiter the each todotext it recives according to the category each time it is called in above for loop
      }

        todosListEl.innerHTML += `
       
        <div class="todo" id=${index}>
            <i 
                class="fa ${todo.checked ? 'fa-check-circle"':'fa-circle-o" '}" style="color : ${todo.color}" data-action="check">
            </i>
            
            <p class="${todo.checked ? 'checked' : ''}" data-action = "check">${todo.value}</p>
            
            <div class="hashTag" id=${index}>
            <button class="tags" style="background-color: inherit" >${tagsHTML}</button> 
            </div>
            <label class="track" style="color: ${daysLeft ==='Overdue' ? 'red':'inherit'}">${daysLeft}</label>
           
            <i class="fa fa-pencil-square-o" data-action = "edit"></i>
            <i class="fa fa-trash-o"         data-action = "delete"></i>

            <div class="Duedate">
            <p>${todo.date}</p>
        </div>
    </div>  `;
    });
}






//CLICK EVENT LISTENER FOR ALL ACTIONS like EDIT DELETE THE TODOS

todosListEl.addEventListener('click',(event)=>{
    const target = event.target;
    const parentElement = target.parentNode;

    if(parentElement.className !== 'todo') return; //this will skip clicks anywhere else like body
//
    console.log(parentElement);

//To DO IDS:
    const todo = parentElement;
    const todoId = Number(todo.id);

// Target Action
const action = target.dataset.action;

action === "check" && checkToDo(todoId); 
action === "edit" && editToDo(todoId);
action === "delete" && deleteToDo(todoId);

});

//Tick & Cross A TODO

function checkToDo(todoId){
   todos = todos.map((todo,index) => ({
      ...todo,
            checked : index === todoId ?  !todo.checked : todo.checked //tick and cross if it is not 
          
    }));

    showTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

//EDIT A TASK

function editToDo(todoId){
    //All of these lines below will make the input = to the todo toggled to be edited
    const todo = todos[todoId];
    todoInput.value = todo.value;
    dateInput.value = todo.date;
    tagInput.value = todo.tags.join(' ');

}


//DELETE TODO
function deleteToDo(todoId){
        todos = todos.filter((_todo,index) => {

            return index !== todoId;

        });
    EditTodoId = -1; //back to notEdit mode
    showTodos();
    localStorage.setItem('todos',JSON.stringify(todos));


    
}


//SHOW NOTIFICATONS IN CUSTOM CSS STYLE from youtube

function ShowNotification(msg){
    //chnge msg if notifiaction
    notificationEl.innerHTML = msg; 
    // this msg will come from above SaveTodo() function 
    // upon checking the if/ else if conditions

    //Notification-show
    notificationEl.classList.add('notif-enter');

    //Notification-hide
    setTimeout(() =>{
        notificationEl.classList.remove('notif-enter');

    },3000)


}


//Made BY @Abdul Moiz