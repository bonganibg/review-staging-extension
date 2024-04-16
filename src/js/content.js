const stagedBacklogTable = document.getElementById("dtOutstanding");
const stagedTableRows = stagedBacklogTable.getElementsByTagName("tr");

const stagedTableHeader = document.getElementsByTagName("h3")[1];
stagedTableHeader.textContent = "Staged Reviews:"

// Copy of original backlog table
const backlogTable = stagedBacklogTable.cloneNode(true);
const backlogTableRows = backlogTable.getElementsByTagName("tr");

stagedBacklogTable.parentNode.insertBefore(backlogTable, stagedBacklogTable.nextSibling);

// Add a header to the new backlog table
const backlogTableHeading = document.createElement("h3");
backlogTableHeading.textContent = "Your Backlog:";
backlogTableHeading.style.textAlign = "center";
backlogTableHeading.style.marginTop = "50px";
backlogTableHeading.style.marginBottom = "50px";
backlogTable.parentNode.insertBefore(backlogTableHeading, backlogTable);

setSortEventListeners()

let stagedReviews = undefined;

(() => {
    stagedReviews = getStagedReviewsFromLocalStorage();
    setUpEventListeners()
    loadStagedAndBacklogTableReviews();
})()

function setSortEventListeners(){// 5 - Task, 6 - Submitted, 7 - Assigned, 8 - Deadline    
    const headers = backlogTable.querySelectorAll("thead th");    
    const taskHeader = headers[4];
    const submittedHeader = headers[5];
    const assignedHeader = headers[6];
    const deadlineHeader = headers[7];

    let ascending = false;

    taskHeader.addEventListener("click", () => {
        sortReviews(4, ascending);
        ascending = !ascending;
    })

    submittedHeader.addEventListener("click", () => {
        sortReviews(5, ascending);
        ascending = !ascending;    
    })

    assignedHeader.addEventListener("click", () => {
        sortReviews(6, ascending);
        ascending = !ascending;    
    })

    deadlineHeader.addEventListener("click", () => {
        sortReviews(7, ascending);
        ascending = !ascending;    
    })
}


function sortReviews(tableIndex, isAscending){    
    const rows = backlogTable.querySelectorAll("tbody tr");
    let sortedRows = Array.from(rows);    

    sortedRows = merge_sort(sortedRows, tableIndex);

    backlogTable.querySelector("tbody").innerHTML = "";

    sortedRows = isAscending ? sortedRows : sortedRows.reverse();
    
    for (let id = 0; id < sortedRows.length; id++) {
        const element = sortedRows[id];
        backlogTable.querySelector("tbody").appendChild(element);        
    }
}

function merge_sort(array, index){
    if (array.length === 1)
        return array;    

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    return merge(merge_sort(left, index), merge_sort(right, index), index);
}

function merge(left, right, index){
    const result = [];    

    while (left.length && right.length) {

        if (getValue(index, left[0]) < getValue(index, right[0])) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return [...result, ...left, ...right];
}

function getValue(index, row){    
    let value = row.cells[index].textContent;    
    return value;
}

/**
 * Gets a list of staged reviews from local storage
 * @returns A list of all of the staged reviews
 */
function getStagedReviewsFromLocalStorage(){
    let reviews = localStorage.getItem("stagedReviews");

    if (reviews == null || reviews === undefined)
        return [];

    reviews = JSON.parse(reviews);

    return reviews;
}

/**
 * Sets up the event listeners for the reviews in the backlog and staged table 
 */
function setUpEventListeners(){
    // Set up the event listeners for the reviews
    for(let i = 1; i < stagedTableRows.length; i++)
    {   

        // Get the rows from both table
        const backlogRow = backlogTableRows[i];
        const stagedRow = stagedTableRows[i];
        
        if (stagedRow.textContent == "No data available in table")
            break;

        // Get the accept review link from the backlog
        const backlogTableData = backlogRow.getElementsByTagName("td");
        const backlogOldLink = backlogTableData[backlogTableData.length - 1].getElementsByTagName('a')[0]; 
        
        // Set the achor tag for the staged review 
        const stagedTableData = stagedRow.getElementsByTagName("td");
        const stagedLink = stagedTableData[stagedTableData.length - 1].getElementsByTagName('a')[0];

        // Set the link to the review
        const reviewId = getReviewIdFromLink(backlogOldLink.href.toString());
        backlogRow.setAttribute("data-review-id", reviewId);
        stagedRow.setAttribute("data-review-id", reviewId);

        // remove the accept review link from the backlog 
        const stageReviewLink = document.createElement("a");
        stageReviewLink.textContent = "Stage Review";
        stageReviewLink.href = "#";
        
        // Change the accept review link to a stage review
        backlogOldLink.parentNode.replaceChild(stageReviewLink, backlogOldLink);

        // Hide the staged review
        stagedRow.style.display = "none";

        // Move review from backlog to staged
        stageReviewLink.addEventListener("click", function(){
            stagedRow.style.display = "table-row";
            backlogRow.style.display = "none";
            addToStaged(reviewId);
        });    

        stagedLink.addEventListener("click", function(){
            console.log("accepeted review")
            removeFromStaged(reviewId);
        })
    }
}

/**
 * Get the id for a review based on the contract ID
 * @param {string} acceptReviewLink accept review URL
 * @returns {string} review contract id
 */
function getReviewIdFromLink(acceptReviewLink){    
    const url = new URL(acceptReviewLink);
    return url.search.replace('?contract_id=', '')
}

/**
 * Add a review to the staged reviews table and update the localstorage value
 * @param {string} reviewId Contract IF for the review to add to staging
 */
function addToStaged(reviewId)
{    
    stagedReviews.push(reviewId);
    localStorage.setItem("stagedReviews", JSON.stringify(stagedReviews));
}

/**
 * Removes a review from the review staging table and from localstorage
 * @param {string} reviewId The contract ID for the review to remove from staging
 */
function removeFromStaged(reviewId)
{
    let index = stagedReviews.indexOf(reviewId);
    stagedReviews.splice(index, 1);

    localStorage.setItem("stagedReviews", JSON.stringify(stagedReviews));
}

/**
 * Add staged reviews from local storage to the staged table
 */
function loadStagedAndBacklogTableReviews(){
    for (let index = 1; index < stagedTableRows.length; index++) {
        const stagedRow = stagedTableRows[index];
        const backlogRow = backlogTableRows[index];

        let i = stagedReviews.indexOf(stagedRow.getAttribute("data-review-id"));

        if (i == -1)
            continue

        stagedRow.style.display = "table-row";
        backlogRow.style.display = "none";
    }
}