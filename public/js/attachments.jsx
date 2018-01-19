import React from 'react'
import { getToken, ghClient } from './githubClient'

const p = pipefyClient.init();
const Promise = pipefyClient.Promise;
const octicons = require("octicons")

class Attachments extends React.Component {
  constructor(props) {
    super(props)
    this.state = { pullRequests: [], loading: true }
  }

  componentDidMount() {
    window.xprops.renderCallback(() => {
      this.refetchAttachments()
    });
  }

  componentDidUpdate() {
    pipefyClient.resizeTo('#attachments');
  }

  authorizeGithub(e) {
    e.preventDefault()

    p.oAuthAuthorize(window.location.origin + '/authorize', {
      width: '500px',
      height: '800px'
    }).then((token) => {
      p.set('pipe', 'private', 'token', token).then(() => {
        this.refetchAttachments()
      });
    });
  }

  getRequests(attachments) {
    return attachments.map(function(a){
      var matches = a.url.match(/github.com\/(.+)\/(.+)\/pull\/(.+)/)
      var owner = matches[1]
      var repo = matches[2]
      var number = matches[3]

      return ghClient(p).then(function(github) {
        var prPromise = github.getRepo(owner, repo).getPullRequest(number)
        var issues = github.getIssues(owner, repo)
        var issuePromise = issues.getIssue(number)

        return Promise.all([prPromise, issuePromise]).then(function(results) {
          var prResult = results[0]
          var issueResult = results[1]

          return {
            pipefyId: a.id,
            pullRequest: prResult.data,
            issue: issueResult.data
          }
        });
      });
    });
  }

  refetchAttachments() {
    p.cardAttachments().then((attachments) => {

      var githubAttachments = attachments.filter(function(attachment){
        return attachment.url.indexOf('https://github.com') === 0;
      });

      Promise.all(this.getRequests(githubAttachments)).then((prs) => {
        const newPRs = prs.map(({ pipefyId, pullRequest, issue }) => {
          return ({
            pipefyId,
            id: pullRequest.id,
            title: pullRequest.title,
            url: pullRequest.html_url,
            number: pullRequest.number,
            merged: pullRequest.merged,
            state: pullRequest.state,
            statusesUrl: pullRequest.statuses_url,
            patchUrl: pullRequest.patch_url,
            createdBy: pullRequest.user,
            head: pullRequest.head,
            base: pullRequest.base,
            labels: issue.labels,
          })
        })

        this.setState({ pullRequests: newPRs, loading: false, failed: false})
      }).catch((err) => {
        const newPRs = githubAttachments.map((attachment) => {
          return ({
            pipefyId: attachment.id,
            title: attachment.name,
            url: attachment.url,
          })
        });
        this.setState({ pullRequests: newPRs, loading: false, failed: true});
      });
    });
  }

  renderLabels(labels) {
    return Object.keys(labels).map((key) => {
      const label = labels[key]
      return (
        <div className="pp-labels pp-inline-flex" key={label.id}>
          <span className="pp-labels-title">
            <span className="pp-label" style={{background: "#" + label.color}}></span>
            <span>{label.name}</span>
          </span>
        </div>
      )
    });
  }

  renderIcon(pr) {
    let icon = 'git-pull-request'
    let color = null;

    if (pr.state === 'closed' && pr.merged) {
      icon = 'git-merge'
      color = '#6f42c1'
    } else if (pr.state == 'open') {
      color = '#28a745'
    } else {
      color = '#cb2431'
    }
    return (<span
      style={{ color: color, position: 'absolute', left: '1px' }}
      dangerouslySetInnerHTML={{__html: octicons[icon].toSVG({ "width": 16 })}}
    />)
  }

  renderFailedPR(pr) {
    return (
      <div key={pr.pipefyId} className="pp-open-card-apps" style={{ paddingLeft: '10px' }}>
        <a href={pr.url} target="blank" title="View on github" className="pp-open-card-apps-link" tabIndex="1">
          <strong>{ pr.title }</strong>
        </a>
        <p>
          <a href="#" onClick={this.authorizeGithub.bind(this)}>
            Authorize your Github account to get more info
          </a>
        </p>
      </div>
    )
  }

  renderPR(pr) {
    if (this.state.failed) { return this.renderFailedPR(pr) }

    return (
      <div key={pr.pipefyId} className="pp-open-card-apps" style={{ paddingLeft: '24px' }}>
        <a href={pr.url} target="blank" title="View on github" className="pp-open-card-apps-link" tabIndex="1">
          { this.renderIcon(pr) }
          <strong>{ pr.title }</strong>
        </a>
        <a href="#remove" title="Remove" className="pp-ico-close" onClick={(e) => { e.preventDefault(); p.dettach(pr.pipefyId) }} />
        <div className="pp-open-card-apps-descriptions">Repository: #{pr.head.repo.full_name}</div>
        <div className="pp-open-card-apps-descriptions">#{pr.number} opened by {pr.createdBy.login}</div>
        <div className="pp-open-card-apps-descriptions">merge <span className="pp-bg-highlight">{pr.head.label}</span>
        </div>
        <div className="pp-open-card-apps-descriptions">
          into <span className="pp-bg-highlight">{pr.base.label}</span>
        </div>
        <br />
        { this.renderLabels(pr.labels) }
      </div>
    )
  }

  renderEmpty() {
    return <p>You don't have Github Pull Requests attached to this card.</p>
  }

  render() {
    if (this.state.loading) { return <p>Loading...</p> }
    if (!this.state.pullRequests.length) { return this.renderEmpty() }
    return this.state.pullRequests.map(pr => this.renderPR(pr));
  }
}

export default Attachments;
