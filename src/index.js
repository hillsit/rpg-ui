import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery'; 

class Grid extends React.Component {
  constructor(props) {
	  super(props);
	  this.refresh = this.refresh.bind(this);
  }

  refresh(commandResponse) {
  	  this.loadGridData(this.state.userId);
  	  this.setState({response:commandResponse});
  }

  componentWillMount() { // Use this to set state
	  this.setState({userId:'1'});
  }

  componentDidMount() { // Use this to fetch Ajax
	  this.loadGridData(this.state.userId);
  }

  // get game info
  loadGridData() {
    $.ajax({
      url: 'http://localhost:8080/grid?userId='+this.state.userId,
      dataType: 'json',
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
      	//alert('Failure Loading Grid Data.'+err.toString());
        console.error('#GET Error', status, err.toString());
      }.bind(this)
    });
  }

  render() {
	
    if (this.state!=null && this.state.data!=null) {  
        return (
	      <div className="board">
	        <h1>Lost in Weston</h1>
	        { 
	        	this.state.data.map(function(row,i) {
	        		return (<div className="board-row">
	        		  {
        			    row.map(function(cell,i) {
        				  return (<button className="square" >{cell}</button>)
        			    })
        			  }
        			</div>)
	        	})
	        }
	      	<InputForm userId={this.state.userId} refresh={this.refresh} /> 
	      	{this.state.response}
	      </div>
	    );
     } else {
  	  return (
  	    <div>Loading...</div>
  	  );
     }
  }
}

/*
class Rows extends React.Component {
	constructor (props) {
		super(props);
		this.state={rows:this.props.rows};
	}

	componentWillReceiveProps() {
		this.setState({rows:this.props.rows});
	}
	
	render() {
		if (this.state!=null && this.state.rows!=null) {
		    return (
		      <div>
		        {
		        	this.state.rows.map(function(row,i) {
		            return <Row row={row} key={i} />
		          })
		        }
		      </div>
		    ); 
		} else {
			return (
			  <ul><li>Empty Rows...</li></ul>
			);
		}
	}
}


class Row extends React.Component {
	constructor (props) {
		super(props);
		this.state={row:this.props.row};
	}

	componentWillReceiveProps() {
		this.setState({row:this.props.row});		
	}

	render() {
		if (this.state!=null && this.state.row!=null) {			
		    return (
		    	<div className="board-row">
		        {
		        	this.state.row.map(function(cell,i) {
		            return <button className="square" >{cell}</button>
		          })
		        }
		        </div>
		    );
		    
		} else {
			return (
			  <ul><li>Empty Row...</li></ul>
			);
		}
	}
}
*/

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '',userId:props.userId};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
	  var postCommand = $.ajax({
	        type: 'POST',
	        url: "http://localhost:8080/command?userId="+this.state.userId,
	        data: {"command":this.state.value},
	        dataType: "text",
	        success: function(resultData) {
	        	console.log(resultData);
	        	this.setState({result: resultData}); 
	        	//console.log(resultData);
	        	this.props.refresh(resultData);
	        }.bind(this)
	  });
	  //postCommand.error(function() { alert("Unable to send command!"); });
	  event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input name="command" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Go" />
      </form>
    );
  }
}


ReactDOM.render(<Grid  />, document.getElementById("root"));
