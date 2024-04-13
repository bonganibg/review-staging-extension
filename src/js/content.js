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

for(let i = 1; i < backlogTableRows.length; i++)
{
    const backlogRow = backlogTableRows[i];
    const stagedRow = stagedTableRows[i];

    // remove the accept review link from the backlog 
    const stageReviewLink = document.createElement("a");
    stageReviewLink.textContent = "Stage Review";

    const backlogTableData = backlogRow.getElementsByTagName("td");
    const oldLink = backlogTableData[backlogTableData.length - 1].getElementsByTagName('a')[0];
    stageReviewLink.href = "#";    

    oldLink.parentNode.replaceChild(stageReviewLink, oldLink);

    stagedRow.style.display = "none";

    stageReviewLink.addEventListener("click", function(){
        stagedRow.style.display = "table-row";
        backlogRow.remove();
    })
}
