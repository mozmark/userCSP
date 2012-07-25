// Helper function to get the name of the selected domain in drop-down list
function getSelectedDomain() {
    var dName = document.getElementById("domainName");    
    var selectedDomain = dName.options[dName.selectedIndex].value;
    
    return selectedDomain;
} // end of "getSelectedDomain" function


// Swap the state of the User CSP Rules button:
// Store the result in global table
function swapCSPStateForDomain(cspBtn) {
    var btnVal = cspBtn.value;    
    dump("\n this = "+btnVal);
    
    var selectedDomain = getSelectedDomain();

    
     dump("\n selected Domain name = "+selectedDomain);

    if (!userCSPArray[selectedDomain]) {
        dump("\n userCSPArray doesn't exists. So I need to create it ");
        userCSPArray[selectedDomain] = new Array(11);
        dump("\n userCSP arrary is created ");
    }
    // I used 11th index for enable and disable button state
    if (btnVal.indexOf("Disable") != -1) {
        dump("\n inside disabled");
        userCSPArray[selectedDomain][10] = false;               
    } else {
        dump("\n inside enableded");
        userCSPArray[selectedDomain][10] = true;
    }
  

} //end of "swapCSPStateForSelectedDomain" function


// Helper function to remove Spaces From a Text Field Input
function removeSpaces(string) {
    return string.split(' ').join('');
}

// Helper function to add an item into list 
function insertItemInList(str) {
    var anOption = document.createElement("OPTION");
    var selectList = document.getElementById("rule1UserList");
    anOption.text = str;
    anOption.value = str;
    selectList.add(anOption);
}

// Listen for user input values 
function listenData(evt) {  
    // Dynamically add OPTION element to SELECT Tag
    var text = document.getElementById("rule1").value;
    
    // Remove spaces from a text field. 
   // text = removeSpaces(text);

    if (text) {
        //--------------------------------------------------
        // Filtering of input according to W3C CSP standard
        var flag = true;
        if (text === "'none'" || text ==="none") {
            insertItemInList(text);
            document.getElementById("rule1").value = ""; 
            return;
        }
        if (text === "'self'" || text ==="self") {//ok
            insertItemInList(text);
            document.getElementById("rule1").value = ""; 
            return;
        }
        var tokens = text.split(/\s+/);
        for (var i in tokens) {
            if (tokens[i] === "") continue;
            if (tokens[i] === "'none'" || tokens[i] ==="none") {
                insertItemInList(tokens[i]);
                continue;
            }
            if (tokens[i] === "'self'" || tokens[i] ==="self") {
                insertItemInList(tokens[i]);
                continue;
            }
            if (tokens[i].indexOf('.') != -1)
                insertItemInList(tokens[i]);
            else window.alert("Unexpected value:"+tokens[i]);
        }
        //-----------------------------------------------------
       
        // Clear the text from Input field
        document.getElementById("rule1").value = "";   
         
        // Invoke Refine policy UI
       // showHideCombine(true);
    }
} // end of "listenData" function


// Shows and hides dynamic part of UI. 
// if flag = true then it shows Combine policy part 
// otherwise  hides it.
function showHideCombine(flag) {
    var hidDiv = document.getElementById("hiddenDiv");
    var Result = "";
    if (flag) {
        hidDiv.style.display ='block';
        
    } else {
        hidDiv.style.display ='none';
    }    
} // end of "showHideCombine" function
 

// Remove selected rule/rules from Directive
function removeData(evt) {
    var flag = false;
    var selectList = document.getElementById("rule1UserList");
    for (var i= selectList.options.length-1; i>=0; i--) {
        if(selectList.options[i].selected) {
            selectList.remove(i);
            flag = true;
        }
    }
    // If some items are deleted to store only then update csp array
    if (flag) {
        var userList = document.getElementById("rule1UserList");
        var userListData="";
        for (var i=0; i < userList.options.length; i++) {
            if(userList.options[i].value)
                userListData += userList.options[i].value + " ";
        }
        var selectedDomain = getSelectedDomain();
        if (userCSPArray[selectedDomain] && previousTabId != -1) {
            userCSPArray[selectedDomain][previousTabId] = userListData;
            dump("\n @ userListData = "+ userListData + "  previousTabId = "+previousTabId);
            dump("\n @ userCSPArray contains for previousTabId = "+ userCSPArray[selectedDomain][previousTabId]);
        }

    } // end of IF(flag) loop

} // end of "removeData" function


// Add selected rule from Options list to Directive Rule list
function addData(evt) {
    var selectOptionsList = document.getElementById("rule1WebsiteList");
    for (var i= selectOptionsList.options.length-1; i>=0; i--) {
        if (selectOptionsList.options[i].selected) {
            var anOption = document.createElement("OPTION");
            var selectList = document.getElementById("rule1UserList");
            anOption.text = selectOptionsList.options[i].text;
            anOption.value = selectOptionsList.options[i].value;
            selectList.add(anOption);
        }
    }
} // end of "addData" function

function setLabelToEmptyString(labelId) {
    document.getElementById(labelId).innerHTML = "";
}

// Get user choice for domain name from drop down box
function getDomainChoice(evt) {
    var selectedDomain = getSelectedDomain();
   // var directiveList = document.getElementById("cspDirectives");

    if (previousTabId == -1) {
        // Currently selected Tab is "All"
        oldDomainValue = selectedDomain;

        // remove text from label named "combineWUCSP"
        setLabelToEmptyString("combinedWUCSP");

        // load website CSP
        if (websiteCSPAll  ||  websiteCSPAll != null) {
            if (websiteCSPAll[selectedDomain]) {
                dump("\n @@@websiteCSPAll is present for this website="+websiteCSPAll[selectedDomain]);
                document.getElementById("websiteCompleteCSP").innerHTML = websiteCSPAll[selectedDomain];
            } else{ setLabelToEmptyString("websiteCompleteCSP"); }
        }else{ setLabelToEmptyString("websiteCompleteCSP"); }

        // load user specified csp
        if (userCSPAll  ||  userCSPAll != null) {
            if (userCSPAll[selectedDomain]) {
                dump("\n @@@userCSPAll is present for this website="+userCSPAll[selectedDomain]);
                document.getElementById("userCompleteCSP").innerHTML = userCSPAll[selectedDomain];
            }else{ setLabelToEmptyString("userCompleteCSP"); }
        }else{ setLabelToEmptyString("userCompleteCSP"); }

    }else {
        // if Currently select tab is not "All"
        var userList = document.getElementById("rule1UserList");
        var websiteList = document.getElementById("rule1WebsiteList");

        // 1. Store the current directive of previous domain. 
        helperToStore(oldDomainValue);
        dump("\n oldDomainName="+oldDomainValue+" NewDomainName="+selectedDomain);
        oldDomainValue = selectedDomain;


        // 2. Empty userList multi-select drop-down box
        userList.options.length = 0;
        websiteList.options.length = 0;

        // 3. Make sure global table entry existis. If not then create it.
        if (!userCSPArray[selectedDomain]) {
            userCSPArray[selectedDomain] = new Array(11);

            // make bydefault state to Enable
            userCSPArray[selectedDomain][10] = true; 

            dump("\n new userCSP arrary is created for = "+selectedDomain);
        }   
        // 4. Get the index of selected Directive
        // var index = directiveList.selectedIndex;
        
        // 5. change oldDirective value
        // oldDirectiveValue = directiveList.options[index].value;
        // dump("\n I am in the getdomain choice2");

        // 6. Restore "rule1UserList" selected directive contents

        if (userCSPArray[selectedDomain][oldDirectiveValue]) {  
            dump("\n value to restore in list = "+userCSPArray[selectedDomain][oldDirectiveValue]);
	          restoreDirectiveRules(userCSPArray[selectedDomain][oldDirectiveValue]);
        }

        //---------------------------------------------------------------
        // 6.1 Show website CSP rules for selected directive
        if (websiteCSPArray  ||  websiteCSPArray != null) {
            if (websiteCSPArray[selectedDomain]) {
                if (websiteCSPArray[selectedDomain][oldDirectiveValue]) { 
                    showWebsiteCSPRules(websiteCSPArray[selectedDomain][oldDirectiveValue]);  
                }
            }
        }

    }
    //---------------------------------------------------------------

    dump("\nI am going in to enable or disable state");
    // 7. Change user Rule state for domain (Enable/Disable)    
    if (!userCSPArray[selectedDomain][10]) {
        dump("\nchange rule state to disable");
        document.getElementById("cspRuleDisable").checked = true;
    } else {
        dump("\nchange rule state to enbale");
        document.getElementById("cspRuleEnable").checked = true;
    }

} // end of getDomainChoice() Function


// This is a helper function for storeDirectiveData and applyUserRules
function helperToStore(domainName) {
    
    dump("\n Domain name to store = "+domainName);

    // 1. Retrive the policy from directive from the "rule1UserList"
    var userList = document.getElementById("rule1UserList");
    // if its empty then no need to store. 
    if (userList.options.length == 0)
        return;

    var userListData="";
    for (var i=0; i < userList.options.length; i++) {
        if(userList.options[i].value)
            userListData += userList.options[i].value + " ";
    }

    dump("\n userListData = "+ userListData);

    // 2. Store the user CSP policy of the directive into global table
    //    under the currently selected Domain name
    if (!userCSPArray || userCSPArray == null) {
        dump("\n userCSPArray doesn't exists. So I need to create it ");
        userCSPArray = {};
    } 
    if (!userCSPArray[domainName]) {
        userCSPArray[domainName] = new Array(11);

        // make bydefault state to Enable
        userCSPArray[domainName][10] = true; 
        document.getElementById("cspRuleEnable").checked = true;

        dump("\n userCSP arrary is created ");
    }      
    userCSPArray[domainName][oldDirectiveValue] = userListData;
    dump("\n value stored = "+userCSPArray[domainName][oldDirectiveValue]);

} //end of "helperToStore" function

// Helper function to show CSP Directive Rules set by website upon reselection of directive
function showWebsiteCSPRules(ruleString) {
    // split entries using SPACE cacharcter
    var mySplitResult = ruleString.split(" ");    
    var selectList = document.getElementById("rule1WebsiteList");    
    for(var i=0; i < mySplitResult.length; i++){
        if(mySplitResult[i] == "")
            continue;
	      var anOption = document.createElement("OPTION");
	      anOption.text = mySplitResult[i];
	      anOption.value = mySplitResult[i];
	      selectList.add(anOption);
    }
} //end of "restoreDirectiveRules" function


// Helper function to restore Directive Rules upon reselection of directive
function restoreDirectiveRules(ruleString) {
    // split entries using SPACE cacharcter
    var mySplitResult = ruleString.split(" ");    
    var selectList = document.getElementById("rule1UserList");    
    for(var i=0; i < mySplitResult.length; i++){
        if(mySplitResult[i] == "")
            continue;
	      var anOption = document.createElement("OPTION");
	      anOption.text = mySplitResult[i];
	      anOption.value = mySplitResult[i];
	      selectList.add(anOption);
    }

} //end of "restoreDirectiveRules" function

//-----------------------------------------------------------------

// Supplimentary function to change class of tab
function changeDirectiveClass(id, flag) {
    switch (id) 
    {
    case 0:
        if (!flag) 
            document.getElementById("Default-Src").className = "";
        else
            document.getElementById("Default-Src").className = "current";            
        break;
    case 1:
        if (!flag) 
            document.getElementById("Script-Src").className = "";
        else
            document.getElementById("Script-Src").className = "current";
        break;
    case 2:
        if (!flag) 
            document.getElementById("Object-Src").className = "";
        else
            document.getElementById("Object-Src").className = "current";
        break;
    case 3:
        if (!flag) 
            document.getElementById("Image-Src").className = "";
        else
            document.getElementById("Image-Src").className = "current";
        break;
    case 4:
        if (!flag) 
            document.getElementById("Media-Src").className = "";
        else
            document.getElementById("Media-Src").className = "current";
        break;
    case 5:
        if (!flag) 
            document.getElementById("Style-Src").className = "";
        else
            document.getElementById("Style-Src").className = "current";
        break;
    case 6:
        if (!flag) 
            document.getElementById("Frame-Src").className = "";
        else
            document.getElementById("Frame-Src").className = "current";
        break;
    case 7:
        if (!flag) 
            document.getElementById("Font-Src").className = "";
        else
            document.getElementById("Font-Src").className = "current";
        break;
    case 8:
        if (!flag) 
            document.getElementById("Xhr-Src").className = "";
        else
            document.getElementById("Xhr-Src").className = "current";
        break;
    case 9:
        if (!flag) 
            document.getElementById("Frame-Ancestors").className = "";
        else
            document.getElementById("Frame-Ancestors").className = "current";
        break;
    default:
        if (!flag) 
            document.getElementById("All-policies").className = "";
        else
            document.getElementById("All-policies").className = "current";  
        break;
    }
}

// Helper function to changeDirective function
function helperToChangeTab(event, curDirID) {
    // Store user CSP policy for the directive into global table in the corresponding domain name field
    // 1. get the currently selected Domain Name
    var selectedDomain = getSelectedDomain();
    helperToStore(selectedDomain);

    // Clear the "rule1UserList"
    var userList = document.getElementById("rule1UserList");
    userList.options.length = 0;

    // Clear the "rule1WebsiteList"
    var websiteList = document.getElementById("rule1WebsiteList");
    websiteList.options.length = 0;

    // Remove "current" class from oldDirective
    changeDirectiveClass(previousTabId, false);

    // Set "current" class to currently selected tab 
    changeDirectiveClass(curDirID, true);

    // Store curDirID for next reference
    oldDirectiveValue =  curDirID;
    previousTabId = curDirID;

    // Get new Directive contents for "rule1UserList" if its present.
    // 1. get the currently selected Domain Name
    selectedDomain = getSelectedDomain();
    if (userCSPArray[selectedDomain][oldDirectiveValue]) {        
	      // 2. Dynamically create OPTIONS in "rule1UserList"
	      restoreDirectiveRules(userCSPArray[selectedDomain][oldDirectiveValue]);
    }

    //---------------------------------------------------------------
    // Show website CSP rules for selected directive
    if (websiteCSPArray  ||  websiteCSPArray != null) {
        if (websiteCSPArray[selectedDomain]) {
            if (websiteCSPArray[selectedDomain][oldDirectiveValue]) { 
                showWebsiteCSPRules(websiteCSPArray[selectedDomain][oldDirectiveValue]);  
            }
        }
    }

} // end of "helperToChangeTab" function


// This fun stores CSP directive data in case of tabs
function changeDirective(event, curDirID) {
    
    if (previousTabId == curDirID)
        return;

    var dynamicDirDIV = document.getElementById("dynamicDirDiv");
    var dynamicAllTabDIV = document.getElementById("dynamicAllTabDiv");

    if (curDirID != -1 && previousTabId == -1) {
        // Hide All Tab UI and Show CSP Directive UI
        dynamicDirDIV.style.display ='block';
        dynamicAllTabDIV.style.display ='none';
       
        helperToChangeTab(event, curDirID);
        
    } else if (curDirID == -1 && previousTabId != -1) {
        // Show All Tab UI and Hide CSP Directive UI
        dynamicDirDIV.style.display ='none';
        dynamicAllTabDIV.style.display ='block';

        // Remove "current" class from oldDirective
        changeDirectiveClass(previousTabId, false);

        // Set "current" class to currently selected tab 
        changeDirectiveClass(curDirID, true);

        previousTabId = curDirID;

        var selectedDomain = getSelectedDomain();

        // remove text from label named "combineWUCSP"
        setLabelToEmptyString("combinedWUCSP");

        // load website CSP
        if (websiteCSPAll  ||  websiteCSPAll != null) {
            if (websiteCSPAll[selectedDomain]) {
                dump("\n @@@websiteCSPAll is present for this website="+websiteCSPAll[selectedDomain]);
                document.getElementById("websiteCompleteCSP").innerHTML = websiteCSPAll[selectedDomain];
            } else { setLabelToEmptyString("websiteCompleteCSP"); }
        } else { setLabelToEmptyString("websiteCompleteCSP"); }

        // Make sure that we updated userCSPAll if user added or removed rules
        var Result = "";
        Result = policyToPrint(userCSPArray,selectedDomain);
        userCSPAll[selectedDomain] = Result;

        // load user specified csp
        if (userCSPAll  ||  userCSPAll != null) {
            if (userCSPAll[selectedDomain]) {
                dump("\n @@@userCSPAll is present for this website="+userCSPAll[selectedDomain]);
                document.getElementById("userCompleteCSP").innerHTML = userCSPAll[selectedDomain];
            } else { setLabelToEmptyString("userCompleteCSP"); }
        } else { setLabelToEmptyString("userCompleteCSP"); }

    } else {
        // use change directive tab
        helperToChangeTab(event, curDirID);
        previousTabId = curDirID;
    }    

} // end of changeDirective() function

//-------------------------------------------------------------------

// This function automatically stores CSP directive data
function storeDirectiveData(event) {
    var index = event.selectedIndex;
    dump("\n Old Directive Value="+oldDirectiveValue+" New Directive Value="+event.options[index].value);

    // Store user CSP policy for the directive into global table in the corresponding domain name field
    // 1. get the currently selected Domain Name
    var selectedDomain = getSelectedDomain();
    helperToStore(selectedDomain);

    // Clear the "rule1UserList"
    var userList = document.getElementById("rule1UserList");
    userList.options.length = 0;

    // Clear the "rule1WebsiteList"
    var websiteList = document.getElementById("rule1WebsiteList");
    websiteList.options.length = 0;

     // change oldDirective value
    oldDirectiveValue = event.options[index].value;

    // Get new Directive contents for "rule1UserList" if its present.
    // 1. get the currently selected Domain Name
    selectedDomain = getSelectedDomain();
    if (userCSPArray[selectedDomain][oldDirectiveValue]) {        
	      // 2. Dynamically create OPTIONS in "rule1UserList"
	      restoreDirectiveRules(userCSPArray[selectedDomain][oldDirectiveValue]);
    }

    //---------------------------------------------------------------
    // Show website CSP rules for selected directive
     if (websiteCSPArray  ||  websiteCSPArray != null) {
         if (websiteCSPArray[selectedDomain]) {
             if (websiteCSPArray[selectedDomain][oldDirectiveValue]) { 
                 showWebsiteCSPRules(websiteCSPArray[selectedDomain][oldDirectiveValue]);  
             }
         }
     }
    //---------------------------------------------------------------

} //end of "storeDirectiveData" function


// This function gets the user CSP rules for the selected domain and 
// send it to main add-on to store it in d/b.
function applyUserRules() {
    dump("\n Apply User Rules button clicked" );
  
    // 1. get the currently selected Domain Name
    var selectedDomain = getSelectedDomain();

    if (!userCSPArray || userCSPArray == null) {
        dump("\n Cannot apply user rules. userCSPArray is empty!");
        return;
    }
    if (!userCSPArray[selectedDomain]) {
        dump("\n Cannot apply user rules. userCSPArray[selectedDomain] is empty!");
        return;
    }

    // 2. Store current directive rules into array
    var userList = document.getElementById("rule1UserList");
    // if its empty then no need to store. 
    if (userList.options.length!= 0) {
	      var userListData="";
	      for (var i=0; i < userList.options.length; i++) {
            if(userList.options[i].value)
		            userListData += userList.options[i].value + " ";
	      }

	      userCSPArray[selectedDomain][oldDirectiveValue] = userListData;
    }

    // 3. send domain rules to store in d/b 
    sendDomainRules(selectedDomain, userCSPArray[selectedDomain]);

} // end of "applyUserRules" function



// Get user choice for domain name from drop down box
function restoreCSPRules() {
    var selectedDomain = getSelectedDomain();
   // var directiveList = document.getElementById("cspDirectives");
    var userList = document.getElementById("rule1UserList");
    var websiteList = document.getElementById("rule1WebsiteList");

    // 1. Store the current directive of previous domain. 
    oldDomainValue = selectedDomain;


    // 2. Empty websiteList/userList multi-select drop-down box
    userList.options.length = 0;
    websiteList.options.length = 0;

    // 3. Make sure global table entry existis. If not then create it.
     if (!userCSPArray[selectedDomain]) {
        userCSPArray[selectedDomain] = new Array(11);
    }   
    // 4. Get the index of selected Directive
    // var index = directiveList.selectedIndex;
    
    // 5. change oldDirective value
   // oldDirectiveValue = directiveList.options[index].value;

    // 6. Restore "rule1UserList" selected directive contents
    if (userCSPArray[selectedDomain][oldDirectiveValue]) {  
        dump("\n value to restore in list = "+userCSPArray[selectedDomain][oldDirectiveValue]);
	      restoreDirectiveRules(userCSPArray[selectedDomain][oldDirectiveValue]);
    }
    //---------------------------------------------------------------
    // 6.1 Show website CSP rules for selected directive
     if (websiteCSPArray  ||  websiteCSPArray != null) {
         if (websiteCSPArray[selectedDomain]) {
             if (websiteCSPArray[selectedDomain][oldDirectiveValue]) { 
                 showWebsiteCSPRules(websiteCSPArray[selectedDomain][oldDirectiveValue]);  
             }
         }
     }
    //---------------------------------------------------------------

    dump("\nI am going in to enable or disable state");

    // 7. Change user Rule state for domain (Enable/Disable)    
    if (!userCSPArray[selectedDomain][10]) {
        dump("\nchange rule state to disable");
        document.getElementById("cspRuleDisable").checked = true;
    } else {
        dump("\nchange rule state to enbale");
        document.getElementById("cspRuleEnable").checked = true;
    }

} // end of "restoreCSPRules" function


//---------------------------------------------------------------------
// Combine Strict and Combine Loose Implementation

function policyToPrint(cspRuleArray,selectedDomain) {
    var Result = "";

    for(j=0; j<10; j++) {
        switch(j) {
        case 0:
            if (cspRuleArray[selectedDomain][j] )
                Result = "default-src " + cspRuleArray[selectedDomain][j] + "; ";
            break;
        case 1:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "script-src "+cspRuleArray[selectedDomain][j] +"; ";
                else
                    Result = "script-src " + cspRuleArray[selectedDomain][j]+"; ";
            }
            break;
        case 2:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "object-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "object-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 3:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "img-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "img-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 4:
            if (cspRuleArray[selectedDomain][j]) {
                if (Result != "")
                    Result += "media-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "media-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 5:
            if (cspRuleArray[selectedDomain][j]) {
                if (Result != "")
                    Result += "style-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "style-src " + cspRuleArray[selectedDomain][j]+"; ";
            } break;
        case 6:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "frame-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "frame-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 7:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "font-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "font-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 8:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "xhr-src "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "xhr-src " + cspRuleArray[selectedDomain][j]+"; ";
            }break;
        case 9:
            if (cspRuleArray[selectedDomain][j] ) {
                if (Result != "")
                    Result += "frame-ancestors "+cspRuleArray[selectedDomain][j]+"; ";
                else
                    Result = "frame-ancestors " + cspRuleArray[selectedDomain][j]+"; ";
            } break;
        } // end of switch(j) Loop
    } // end of For "j" Loop

    return Result;

} //end of "policyToPrint" Function



function loosePolicyToPrint(tempUserCSPArray, tempWebsiteCSPArray, tempSelectedDomain) {
    var Result = "";
    var flag = false;

    for(j=0; j<10; j++) {
        switch(j) {
        case 0:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result = "default-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "default-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
 
                flag = false;
            }
            break;
        case 1:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "script-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "script-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            }            
            break;
        case 2:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "object-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "object-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            }                        
            break;
        case 3:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "img-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "img-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            break;
        case 4:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "media-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "media-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            break;
        case 5:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "style-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "style-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            
            break;
        case 6:
             if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "frame-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "frame-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            
            break;
        case 7:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "font-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "font-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            break;
        case 8:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "xhr-src " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "xhr-src " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";

                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            break;
        case 9:
            if (tempUserCSPArray[tempSelectedDomain][j] && tempUserCSPArray[tempSelectedDomain][j] != "") {
                Result += "frame-ancestors " + tempUserCSPArray[tempSelectedDomain][j];
                flag = true;
            }
            if (tempWebsiteCSPArray[tempSelectedDomain][j] && tempWebsiteCSPArray[tempSelectedDomain][j] != "") {
                if (!flag)
                    Result += "frame-ancestors " + tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                else
                    Result += tempWebsiteCSPArray[tempSelectedDomain][j]+"; ";
                flag = false;
            } 
            
            break;
        } // end of switch(j) Loop
        
        if (flag) {
            Result += ";";
            flag = false; // reset flag
        }

    } // end of For "j" Loop

    return Result;

} // end of loosePolicyToPrint() function


//-----------------------------CombinedRules------------------------------

// Combine website and user policy strictly. 
// Only allow if it is allowed by BOTH
function combineStrict() {
    var Result = "";

    dump("\n Combine Strict is Clicked");

    // now show website and user policy for combining
    var selectedDomain = getSelectedDomain();
    if (!userCSPArray[selectedDomain])
        return;
    if (!websiteCSPArray[selectedDomain])
        return;

    
    Result = policyToPrint(userCSPArray,selectedDomain);
    userCSPAll[selectedDomain] = Result;
    
    dump("\n Complete UserCSP = " + userCSPAll[selectedDomain]);
    dump("\n Complete WebsiteCSP = " +websiteCSPAll[selectedDomain]);
   
    getCombineStrict(websiteCSPAll[selectedDomain], userCSPAll[selectedDomain], selectedDomain);
    
} // end of combineStrict() function


// Combine website and user specified CSP loosely
// Allow if it is allowed ANY ONE  or BOTH
function combineLoose() {
    var Result = "";

    dump("\n Combine Loose is Clicked");

    var selectedDomain = getSelectedDomain();
    if (!userCSPArray[selectedDomain])
        return;
    if (!websiteCSPArray[selectedDomain])
        return;

    Result = loosePolicyToPrint(userCSPArray, websiteCSPArray, selectedDomain);
    dump("\n %%Combine Loose CSP Policy = " +Result);
    document.getElementById("combinedWUCSP").innerHTML = Result;
    
} // end of combineLoose() function


// This function gets the combined CSP rules for the selected domain and 
// send it to main add-on to store it in d/b.
function applyCombinedRules() {
    dump("\n Apply Combined Rules button clicked");

    var selectedDomain = getSelectedDomain();
    if (!userCSPArray[selectedDomain])
        return;

    try {
        var cspRules = document.getElementById("combinedWUCSP").innerHTML;

        if (cspRules == null || cspRules == "")
            return;

        for (var i=0; i<10; i++) {
            userCSPArray[selectedDomain][i] = combinedCSPFilter(cspRules, i);
        }
        // send combined rules for the selected domain to store in d/b 
        sendDomainRules(selectedDomain, userCSPArray[selectedDomain]);

    }catch(e){dump("\n\n @@ Error in applyCombinedRules="+e);}

} // end of "applyCombinedRules" function


// helper function to "applyCombinedRules"
// It stores csp policy string into usercspArray format to send to d/b
function combinedCSPFilter(cspRules, index) {
switch(index)
    {
    case 0:
        var n = cspRules.search("default-src");
        if (n != -1) {
            n += 11;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else 
            return "";
        break;
    case 1:
        var n = cspRules.search("script-src");
        if (n != -1) {
            n += 10;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 2:
        var n = cspRules.search("object-src");
        if (n != -1) {
            n += 10;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 3:
        var n = cspRules.search("img-src");
        if (n != -1) {
            n += 7;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 4:
        var n = cspRules.search("media-src");
        if (n != -1) {
            n += 9;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 5:
        var n = cspRules.search("style-src");
        if (n != -1) {
            n += 9;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 6:
        var n = cspRules.search("frame-src");
        if (n != -1) {
            n += 9;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 7:
        var n = cspRules.search("font-src");
        if (n != -1) {
            n += 8;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 8:
        var n = cspRules.search("xhr-src");
        if (n != -1) {
            n += 7;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
    case 9:
        var n = cspRules.search("frame-ancestors");
        if (n != -1) {
            n += 15;
            var k = cspRules.indexOf(";", n);
            if (k != -1) {
                return cspRules.substring(n, k);
            } else {
                return cspRules.substring(n);
            }
        } else
            return "";
        break;
        
    } // end of switch statement
}// end of combinedCSPFilter function