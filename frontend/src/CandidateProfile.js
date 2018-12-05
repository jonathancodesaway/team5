import React from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery'; 

// This class should take a candidate as prop from some method
// and display the candidates profile page
class CandidateProfile extends React.Component {
    constructor(props){
        super(props)

        //all the data streaming in as props
        console.log(this.props)
        this.goBack = this.goBack.bind(this);
        this.state = {
            has_data: true,
            cand_loading: false,
            fec_loading: false,
            news_loading: false,
            cand_info: [],
            fec_info: [],
            news: []
        }
    }

    goBack() {
        this.props.history.goBack();
    }

    componentDidMount() {
        console.log("Component Mounted!")
        ReactDOM.findDOMNode(this).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
        this.getCandInfo()
        this.getFecInfo()
        this.scrapeNews()
    }

    getCandInfo() {    
        console.log("Requesting data from /getCandidatesInfo for", this.props.name);
        $.ajax({
            url : 'http://localhost:5000/getCandidatesInfo',
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
                name: this.props.name,
                state: this.props.state
            },
            success:(data)=>{
                console.log(data)
                this.setState({
                    cand_info: data.candidate_information
                });
                console.log(this.state.cand_info.photo)
            },
            error:function(){
                console.log("Error.")
            }
        })
    }

    getFecInfo() {
        // /getFecInfo
        console.log("Requesting data from /getFecInfo");
        $.ajax({
            url : 'http://localhost:5000/getFecInfo',
            type: 'POST',
            cache: false,
            dataType: 'json',
            data: {
                name: this.props.name,
                state: this.props.state
            },
            success:(data)=>{
                console.log(data)
                this.setState({
                    fec_info: data.fec_information
                });
                console.log(this.state.fec_info)
            },
            error:function(){
                console.log("Error.")
            }
        })
    }

    scrapeNews() {
        let cand_url = 'http://localhost:5000/' + this.props.name;
        console.log("Scraping the web for", this.props.name);
        $.ajax({
            url : cand_url,
            type: 'GET',
            cache: false,
            dataType: 'json',
            success:(data)=>{
                console.log(data)
                this.setState({
                    news: data.results
                });
            },
            error:function(){
                console.log("Error.")
            }
        })
    }

    renderNews() {
        const links = this.state.news.map((i) => (
            <div key={this.state.news.indexOf(i)}>
                <li>
                    <a href={i.url} className="list-group-item">{i.topic}</a>
                </li>
            </div>
        ));

        return (
            <ul className="list-group list-group-flush news">
                {links}
            </ul>
        )
    }

    render() {
        return (
            <div className="candyprofilewrapper shadow-lg mb-5 rounded" ref={this.MyRef}>
                <div className="row">
                    <div className="col-4 text-center leftcandy">
                        <h4>{this.state.cand_info.preferredName} {this.state.cand_info.lastName}</h4>
                        <img src={this.state.cand_info.photo} className="rounded" alt=""></img>
                    </div>
                    <div className="col-4 text-center midcandy">
                        <h4>In the News</h4>
                        {this.renderNews()}
                    </div>
                    <div className="col-3 rightcandy text-center">
                        <h4>FEC Data</h4>
                    </div>
                    <div className="col-1 rightcandy text-right">
                        {this.props.action &&
                        <button type="button" className="close" aria-label="Close" onClick={this.props.action}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 leftcandy text-left">
                    <table className="table table-sm">
                        <tbody>
                            <tr>
                            <th scope="row">Title</th>
                            <td colSpan="4">{this.state.cand_info.title}</td>
                            </tr>
                            <tr>
                            <th scope="row">Parties</th>
                            <td colSpan="4">{this.state.cand_info.parties}</td>
                            </tr>
                            <tr>
                            <th scope="row">Birthdate</th>
                            <td colSpan="4">{this.state.cand_info.birthDate}</td>
                            </tr>
                            <tr>
                            <th scope="row">Birthplace</th>
                            <td colSpan="4">{this.state.cand_info.birthPlace}</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="col-4 midcandy text-left">
                    </div>
                    <div className="col-4 rightcandy text-center">
                        FEC Data here
                    </div>
                </div>
            </div>
        )
    }

}

export default CandidateProfile;