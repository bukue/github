import { Component } from "react";

const style = {
    marginTop: "10px",
    marginBottom: "10px"
}

export class SearchBar extends Component{
    constructor(props){
        super(props);

        this.props = props;

        this.onKeyPressQuery = this.onKeyPressQuery.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
        this.onClickPrevious = this.onClickPrevious.bind(this);
        this.onClickNext = this.onClickNext.bind(this);

        this.state = {
            query: '',
            currentPage: this.props.currentPage,
            totalPages: this.props.pages
        }
    }

    componentDidUpdate(prevProps){
        if(
            prevProps.currentPage !== this.props.currentPage ||
            prevProps.pages !== this.props.pages
        ){
            this.setState({
                currentPage: this.props.currentPage,
                totalPages: this.props.pages
            })
        }
    }

    onClickPrevious(event){
        this.setState((prevState)=>{
            const prevPage = prevState.currentPage - 1;

            return {
                currentPage: prevPage >=0 ? prevPage : 0
            }
        }, ()=> this.triggerChangePage());
    }

    onClickNext(event){
        const { totalPages } = this.state;

        this.setState((prevState)=>{
            const nextPage = prevState.currentPage + 1;

            return {
                currentPage: nextPage <= totalPages ? nextPage : totalPages
            }
        }, ()=> this.triggerChangePage());

    }

    onClickSearch(event){
        this.triggerQuery();
    }

    onChangeQuery(event){
        this.setState({query: event.target.value});
    }

    onKeyPressQuery(event){
        if(event.key === 'Enter'){
            this.triggerQuery();
        }
    }

    triggerQuery(){
        const {query} =  this.state;

        this.props.query(query);
    }

    triggerChangePage(){
        const {currentPage} = this.state;
        this.props.changePage(currentPage);
    }

    render(){
        const {query, currentPage, totalPages} = this.state;

        return (
            <div style={style}>
                <input onChange={this.onChangeQuery} onKeyPress={this.onKeyPressQuery}/>
                <button onClick={this.onClickSearch} disabled={query.length === 0}> Search </button>
                <button onClick={this.onClickPrevious} disabled={currentPage === 0}> Previous </button>
                <button onClick={this.onClickNext} disabled={currentPage === totalPages-1 || totalPages === 0}> Next </button>
            </div>
        );
    }
}