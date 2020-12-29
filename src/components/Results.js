import { Component } from 'react'
import { cleanUrl } from '../utils/url'
import { humanize } from '../utils/arrays'
import { checkForOk, catchErrors, lastCommitsUsers } from '../utils/githubApi'

const HEADERS = {
    NAME: "Name",
    OWNER: "Owner",
    STARS: "Stars",
    LINK: "Link",
    DETAILS: "Details"
}

const rowStyle = {
    display: "flex",
    justifyContent: "center"
}

const baseStyle = {
    width: "100px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    border: "solid 1px gray"
}

const styles = {
    [HEADERS.NAME]: {
        ...baseStyle,
        width: "250px"
    },
    [HEADERS.OWNER]: baseStyle,
    [HEADERS.STARS]: baseStyle,
    [HEADERS.LINK]: {
        ...baseStyle,
        width: "250px"
    },
    [HEADERS.DETAILS]: baseStyle,
}

const headersStyle = {
    fontWeight: 600
}

const MAX_USER_COMMITS = 3;

export class Results extends Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    renderHeaders(){
        return (
            <div style={rowStyle}>
                {
                    Object.keys(HEADERS).map((key)=>{
                        return (
                            <div key={`${key}-header`} style={{
                                ...styles[HEADERS[key]],
                                ...headersStyle
                                }}>
                                {HEADERS[key]}
                            </div>
                        );
                    })
                }
            </div>
            
        );
    }

    onClickDetails(index){
        const {results} = this.props;

        const commitsUrl = cleanUrl(results[index].commits_url);
        const forksUrl = new URL(results[index].forks_url);

        commitsUrl.searchParams.append('per_page', MAX_USER_COMMITS);
        forksUrl.searchParams.append('per_page', 1);

        let message = [];

        fetch(commitsUrl.toString())
        .then(checkForOk)
        .then(data => {
            message.push( `Last ${MAX_USER_COMMITS} commits by ${humanize(lastCommitsUsers(data))}` );

            return fetch(forksUrl.toString());
        })
        .then(checkForOk)
        .then(data => {
            if(data.length>0){
                message.push( `The last fork was created by ${data[0].owner.login}` );

                return fetch(data[0].owner.url)
                .then(checkForOk)
                .then(data => {
                    if(data.bio){
                        message.push( `\tThe owner has this in their biography: "${data.bio}"` );
                    }else{
                        message.push( `\tThe owner has no content on its bio` );
                    }

                })
            }else{
                message.push( 'There are no forks in this repository')
            }
        })
        .then(()=> alert(message.join('\n')))
        .catch(catchErrors);
    }

    renderRow(row, index){
        return (
            <div key={row.id} style={rowStyle}>
                <div key={`${row.id}-name`} style={styles[HEADERS.NAME]}>
                    {row.name}
                </div>
                <div key={`${row.id}-owner`} style={styles[HEADERS.OWNER]}>
                    {row.owner.login}
                </div>
                <div key={`${row.id}-stars`} style={styles[HEADERS.STARS]}>
                    {row.watchers}
                </div>
                <div key={`${row.id}-link`} style={styles[HEADERS.LINK]}>
                    <a href={row.html_url} target="_blank" rel="noreferrer">
                        {row.full_name}
                    </a>
                </div>
                <div key={`${row.id}-details`} style={styles[HEADERS.DETAILS]}>
                    <button onClick={()=> this.onClickDetails(index)}>
                        Details
                    </button>
                </div>
            </div>  
        );
    }

    render(){
        const {results} = this.props;

        return (
            <div>
                { this.renderHeaders() }
                {
                    results.map((row, index)=>{
                        return this.renderRow(row, index);
                    })
                }
            </div>
        );
    }
}