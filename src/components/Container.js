import { Component } from "react";

import { SearchBar } from './SearchBar'
import { Results } from './Results'
import { Paging } from './Paging'

import { GITHUB_BASE_URL } from "../constants/urls";
import { MAX_RECORDS_PER_PAGE } from "../constants/paging";

export class Container extends Component{
    constructor(props){
        super(props);

        this.query = this.query.bind(this);
        this.changePage = this.changePage.bind(this);

        this.state = {
            results: [],
            currentPage: 0,
            version: 0
        };
    }

    query(query){
        const url = `${GITHUB_BASE_URL}?q=${query}`;
        fetch(url)
            .then(result => result.json())
            .then((data)=>{
                this.setState((prevState)=>{
                    return {
                        results: data.items,
                        version: prevState.version + 1
                    }
                });
            });
    }

    changePage(page){
        this.setState({currentPage: page})
    }

    render(){
        const { results, currentPage } = this.state;

        const pages = Math.floor(results.length / MAX_RECORDS_PER_PAGE);
        
        const startRecord = currentPage * MAX_RECORDS_PER_PAGE;
        const endRecord =  startRecord + MAX_RECORDS_PER_PAGE;

        return (
            <div >
                < SearchBar 
                    query={this.query} 
                    changePage={this.changePage}
                    currentPage={currentPage}
                    pages={pages} 
                />
                < Results results={results.slice(startRecord, endRecord)} />
                < Paging currentPage={currentPage} pages={pages} />
            </div>
        );
    }
}