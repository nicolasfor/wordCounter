import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import Dropzone from 'react-dropzone'
import TreeView from 'react-treeview';
import blackList from '../config/blackList'
import 'react-treeview/react-treeview.css'
class Dictionary extends Component {

  constructor(props)
  {
      super(props);
      let collapsedBookkeeping = Object.keys(this.props.dictionary.dictionary).map((item,index)=>true)
      this.state = {collapsedBookkeeping,toCollapse:false}
      this.handleClick = this.handleClick.bind(this)
      this.collapseAll = this.collapseAll.bind(this)
  }

  onDrop(files) {
    this.createDictionary(files)
  }


  handleClick(i) {
    let [...collapsedBookkeeping] = this.state.collapsedBookkeeping;
    collapsedBookkeeping[i] = !collapsedBookkeeping[i];
    let index = collapsedBookkeeping.findIndex((item,index)=>item==false?true:false)
    this.setState({collapsedBookkeeping: collapsedBookkeeping,toCollapse:index>=0?true:false});
  }

  collapseAll() {
    let {toCollapse} = this.state
    this.setState({
      collapsedBookkeeping: this.state.collapsedBookkeeping.map(() => toCollapse),
      toCollapse:!toCollapse
    });
  }

  render() {
    let {toCollapse,collapsedBookkeeping} = this.state
    let {dictionary,plainText,name} = this.props.dictionary
    return (
          <div className="card">
            <div className="card-header">
              <b>{"Text Processing for: "+name}</b>
            </div>
            {dictionary && plainText &&
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    {plainText}
                  </div>
                  <div className="col-sm tree-view-custom">
                  <button type="button" onClick={this.collapseAll} className="btn btn-primary">{toCollapse?"Collapse all":"Expand all"}</button>
                    {Object.keys(dictionary).sort().map((node, i) => {
                      const label =
                        <span className="node" onClick={this.handleClick.bind(null, i)}>
                          Letter: {node}
                        </span>;
                      return (
                        <TreeView
                          key={i}
                          nodeLabel={label}
                          collapsed={collapsedBookkeeping[i]}
                          onClick={this.handleClick.bind(null, i)}>
                          {Object.keys(dictionary[node]).map(entry => <div className="info" key={entry}>{entry+": "+dictionary[node][entry]}</div>)}
                        </TreeView>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            }
            </div>
    );
  }
}

export default Dictionary;
