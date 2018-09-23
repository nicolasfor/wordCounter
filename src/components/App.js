import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import Dropzone from 'react-dropzone'
import TreeView from 'react-treeview';
import blackList from '../config/blackList'
import 'react-treeview/react-treeview.css'
class App extends Component {

  constructor(state)
  {
      super(state);
      this.state = {files:null,dictionary:null,plainText:null,toCollapse:false}
      this.handleClick = this.handleClick.bind(this)
      this.collapseAll = this.collapseAll.bind(this)
  }
  onDrop(files) {
    this.createDictionary(files)
  }
  async createDictionary(files)
  {
    //console.log("files",files);
    var dictionary = {};
    let promises=[];
    if(Array.isArray(files) && files.length>0)
    files.forEach((item,index)=>{
      //console.log("about to call");
        promises.push(this.readerPromise(item))
      })

    try{
      let results = await Promise.all(promises);
      if(results && results.length>0)
      {
        let plainText = results.join(' ');
        plainText.toLowerCase().split(' ')
        .forEach((word,index)=>{
          word= word.replace(/[^\w\s]/gi, '').replace(/\r?\n|\r/)
          if(word)
          {
            let validWord = blackList.find((item,index)=>item==word);
            if(!validWord )
            {
              let firstLetter = word[0];
              if(!dictionary[firstLetter])
                dictionary[firstLetter]={};
              if(!dictionary[firstLetter][word])
              dictionary[firstLetter][word]=1;
              else
              dictionary[firstLetter][word]+=1;
            }
          }
        })
       console.log("dictionary",dictionary);
        this.setState({dictionary,plainText,collapsedBookkeeping:Object.keys(dictionary).map((item,index)=>true)})
      }
      
    }

    catch(error){
      console.log("error",error);
      alert("Error: "+error)
    }
  }

  readerPromise(file)
  {
    return new Promise((resolve,reject)=>{
      var reader = new FileReader();
      reader.onload = ()=> {
        console.log("reader.result",reader.result);
        if(file.type.match('text/plain'))
          resolve(reader.result);
        else
          reject(file.name+" is not a valid format")
      }
      reader.onerror = ()=> {
        reject("Opps something happened!");
      }
      reader.readAsText(file)
    })
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
    let {dictionary,plainText,toCollapse,collapsedBookkeeping} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Verification and Validation</h1>
        </header>
        <div className="App-intro">
          <div className="card">
            <div className="card-header">
              <b>Text Processing:</b>
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
                      // Let's make it so that the tree also toggles when we click the
                      // label. Controlled components make this effortless.
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
            <div className="card-footer text-muted">
              <Dropzone className="dropfiles" onDrop={this.onDrop.bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
