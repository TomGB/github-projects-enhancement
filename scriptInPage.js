console.log("running in page script")

const disablePrStatus = JSON.parse(localStorage.getItem('disablePrStatus'));
const disableLabels = JSON.parse(localStorage.getItem('disableLabels'));

console.log("disablePrStatus =",disablePrStatus);
console.log("disableLabels =",disableLabels);

let issues;
let issueCounter = -1;

setTimeout(() => {
    issues = $('.issue-card');
    issues.each((_index, issue) => {
        const prInfo=$("<div class='pr-info'></div>");
        $(issue).append(prInfo);
    });
    nextIssue();
    nextIssue();
    nextIssue();
    nextIssue();
    nextIssue();
}, 1000);

setTimeout(() => {
    setInterval(() => {
        processNewIssues();
    }, 500)
}, 2000);

function processNewIssues() {
    newIssues = $('.issue-card').not(":has(.pr-info)");

    newIssues.each((_index, issue) => {
        console.log()
        const prInfo=$("<div class='pr-info'></div>");
        $(issue).append(prInfo);

        const issueLink = getIssueLink(issue);

        if (issueLink) {
            console.log('new issue detected', issueLink);
            getPRForIssue(issueLink, issue);
        }
    });
}

function getPRForIssue(url, issue) {
    $.get( url, function( data ) {
        const issuePage = $.parseHTML(data);
        const allURLs = $(issuePage).find("a").map(function() {
            return this.href;
        }).get();

        const prUrls = allURLs.filter(link => {
            return link.includes('/pull/');
        });

        const firstPR = prUrls[0]

        const prInfo = $(issue).find('.pr-info');
        $(prInfo).append(getLabels(issuePage));

        if (firstPR) {
            getTitleForPR(firstPR, prInfo);
        } else {
            nextIssue();
        }
    });
}

function getTitleForPR(url, issue) {
    $.get( url, function( data ) {
        const html = $.parseHTML(data);
        const repo = $(html).find('*[data-pjax="#js-repo-pjax-container"]').html();
        const title = $(html).find(".js-issue-title").html();

        const prContent = $("<div class='pr-info-content'></div>");
        $(prContent).append("<div class='pr-link'>"+repo+": <a href='"+url+"'>"+title+"</a></div>");

        const statuses = $(html).find(".js-details-container.Details .branch-action-item");

        const prStatusContainer = $(`<div class='pr-status-content ${disablePrStatus ? 'disable-pr-status' : ''}'></div>`);

        if (statuses) {
            statuses.each((_index, status) => {
                const statusIcon = $(status).find(".completeness-indicator");
                const statusText = $(status).find(".status-heading")[0];

                if ($(statusIcon).length && $(statusText).length) {
                    const statusHTML = $("<div class='details'></div>");
                    $(statusHTML).append(statusIcon);
                    $(statusHTML).append(statusText);

                    $(prStatusContainer).append(statusHTML);
                }
            });
        }

        $(prContent).append(prStatusContainer);

        $(issue).append(prContent);

        nextIssue();
    });
}

function nextIssue() {
    if (issueCounter < issues.length - 1) {
        const issue = issues[++issueCounter];
        const issueLink = getIssueLink(issue);

        if (issueLink) {
            getPRForIssue(issueLink, issue);
        } else {
            nextIssue();
        }
    }
}

function getIssueLink(issue) {
    const issueLink = $(issue).find("a.h5")

    if($(issueLink).length) {
        return issueLink[0].href;
    } else {
        return undefined;
    }
}

function getLabels(issuePage) {
    const labels = $(issuePage).find('.discussion-sidebar-item:eq(1)');
    const labelsContainer = $(`<div class='labels-container ${disableLabels ? 'disable-lables' : ''}'></div>`);
    $(labelsContainer).append(labels);
    return labelsContainer
}
