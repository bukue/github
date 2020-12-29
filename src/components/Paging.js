import { Component } from "react";

const style = {
    marginTop: "10px",
    marginBottom: "10px"
}

export class Paging extends Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        const {currentPage, pages} = this.props;

        return (
            <div style={style}>
                Page {currentPage + 1} of {pages === 0 ? 1 : pages}
            </div>
        );
    }
}