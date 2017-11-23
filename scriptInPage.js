console.log("running in page script")

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
        console.log('new issue detected')
        const prInfo=$("<div class='pr-info'></div>");
        $(issue).append(prInfo);

        const issueLink = getIssueLink(issue);

        console.log(issueLink)
        if (issueLink) {
            getPRForIssue(issueLink, issue);
        }
    });
}

function getPRForIssue(url, issue) {
    $.get( url, function( data ) {
        const allURLs = $($.parseHTML(data)).find("a").map(function() {
            return this.href;
        }).get();

        const prUrls = allURLs.filter(link => {
            return link.includes('/pull/');
        });

        const firstPR = prUrls[0]

        const prInfo = $(issue).find('.pr-info');

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
        $(issue).append("<div class='pr-link'>"+repo+": <a href='"+url+"'>"+title+"</a></div>");

        const statuses = $(html).find(".js-details-container.Details .branch-action-item");

        if (statuses) {
            statuses.each((_index, status) => {
                const statusIcon = $(status).find(".completeness-indicator");
                const statusText = $(status).find(".status-heading")[0];

                if ($(statusIcon).length && $(statusText).length) {
                    const statusHTML = $("<div class='details'></div>");
                    $(statusHTML).append(statusIcon);
                    $(statusHTML).append(statusText);

                    $(issue).append(statusHTML);
                }
            });
        }

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
