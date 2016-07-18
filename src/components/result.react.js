import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Result extends Component {
  constructor(props){
    super(props);
  }

  sqlQuery(jsonData){}

  sqlResult(jsonData){
    const rows = jsonData.rows;
    if (rows.length <= 0) {
      return (
        <div className="sql-result no-table">
          クエリで得られた表がありません
        </div>
      );
    }
    
    const fields = Object.keys(rows[0]);
    var headerAttr = fields.map((field) => {
      return <tr>{field}</tr>
    });
    
    const bodyAttr = rows.map( row => {
      return (
        <tr>
          <td>{row['id']}</td>
          <td>{row['title']}</td>
          <td>{row['name']}</td>
        </tr>
      );
    });
    
    return (
      <table className="table table-bordered table-striped sql-result">
        <thead>
          {headerAttr}
        </thead>
        <tbody>
          {bodyAttr}
        </tbody>
      </table>
    );
  }

  syntaxHighlight(){
    // syntax hilight
    // $(document).ready(function(){
    //   $('pre code').each(function(i, block){
    //     hljs.highlightBlock(block);
    //   });
    // });
  }

  render(){
    var mockData = [
      { type: 'sql/query', sql: "select * from table;" },
      { type: 'sql/result',
        rows: [
          { id: 1, title: "Neuromancer", name: "Armitage"},
          { id: 2, title: "Count Zero", name: "Marly"},
          { id: 3, title: "Mona Lisa Overdrive", name: "Bobby"}
        ]
      },
      { type: 'sql/error' }
    ];
    //wsOnMessage(event);
    var ret = mockData[2];
    var tags = null;
          
    if (!ret.type) {
      console.log('no data');
    } else if (ret.type === 'sql/query') {
      tags = (
        <div className="alert alert-success">
          <pre>
            <code className="sql">{ret.sql}</code>
          </pre>
        </div>
      );
    } else if (ret.type === 'sql/result') {
      tags = this.sqlResult(ret);

    } else if (ret.type === 'sql/error') {
      tags = <div className="alert alert-danger">
        Error Message
      </div>;
    }

    return (
      <div id="results">
        {tags}
      </div>
    );
  }
}

module.exports = Result;
