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

let stagedReviews = getStagedReviewsFromLocalStorage();

// Set up the event listeners for the reviews
for(let i = 1; i < stagedTableRows.length; i++)
{
    // Get the rows from both table
    const backlogRow = backlogTableRows[i];
    const stagedRow = stagedTableRows[i];

    // Get the accept review link from the backlog
    const backlogTableData = backlogRow.getElementsByTagName("td");
    const oldLink = backlogTableData[backlogTableData.length - 1].getElementsByTagName('a')[0];    

    // Set the link to the review
    const reviewId = getReviewIdFromLink(oldLink.href.toString());
    backlogRow.setAttribute("data-review-id", reviewId);
    stagedRow.setAttribute("data-review-id", reviewId);

    // remove the accept review link from the backlog 
    const stageReviewLink = document.createElement("a");
    stageReviewLink.textContent = "Stage Review";
    stageReviewLink.href = "#";
    
    // Change the accept review link to a stage review
    oldLink.parentNode.replaceChild(stageReviewLink, oldLink);

    // Hide the staged review
    stagedRow.style.display = "none";

    // Move review from backlog to staged
    stageReviewLink.addEventListener("click", function(){
        stagedRow.style.display = "table-row";
        backlogRow.style.display = "none";
        addToStaged(reviewId);
    });
}

loadStagedAndBacklogTableReviews();

// Display historically staged reviews

function getStagedReviewsFromLocalStorage(){
    let reviews = localStorage.getItem("stagedReviews");

    if (reviews == null || reviews === undefined)
        return [];

    reviews = JSON.parse(reviews);

    return reviews;
}

function getReviewIdFromLink(acceptReviewLink){    
    const url = new URL(acceptReviewLink);
    return url.search.replace('?contract_id=', '')
}


function addToStaged(reviewId)
{    
    stagedReviews.push(reviewId);
    localStorage.setItem("stagedReviews", JSON.stringify(stagedReviews));
}

function removeFromStaged(reviewId)
{
    let index = stagedReviews.indexOf(reviewId);
    stagedReviews.splice(index, 1);

    localStorage.setItem("stagedReviews", JSON.stringify(stagedReviews));
}

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
