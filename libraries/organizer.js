// Project Organizer
// by Michael G. Braverman
// July 20, 2016

// project SETUP
function projectSetup(projectNumber, projectName) {

  var pageTitle = document.getElementById('page-title');
  pageTitle.innerHTML = doubleDigit(projectNumber) + " - " + projectName;

  var name = document.getElementById('project-name');
  name.innerHTML = doubleDigit(projectNumber) + " " +projectName;

  if (projectNumber > 1) {
    var pastProject = document.getElementById('past-project');
    pastLink = "../" + doubleDigit(projectNumber-1) + "/index.html";
    pastProject.innerHTML = "<a href='"+ pastLink+ "'>" +"back </a>";
  }

  var nextProject = document.getElementById('next-project');
  nextLink = "../" + doubleDigit(projectNumber+1) + "/index.html";
  nextProject.innerHTML = "<a href='"+ nextLink+ "'>" + "next </a>";

  function doubleDigit(n){
      return n > 9 ? "" + n: "0" + n;
  }
}
