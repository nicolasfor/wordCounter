import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import Dropzone from 'react-dropzone'
import TreeView from 'react-treeview';
import blackList from '../config/blackList'
import 'react-treeview/react-treeview.css'
import Dictionary from './Dictionary'
class App extends Component {

  constructor(state)
  {
      super(state);
      this.state = {files:[],dictionaries:[]}
  }
  onDrop(files) {
    let newFiles = this.state.files.concat(files);
    this.setState({files:newFiles})
    this.createDictionary(files)
  }
  async createDictionary(files)
  {
    var {dictionaries} = this.state;
    let promises=[];
    if(Array.isArray(files) && files.length>0)
    files.forEach((item,index)=>{
      console.log("item",item);
        promises.push(this.readerPromise(item))
      })

    try{
      let results = await Promise.all(promises);

      results.forEach((plainText,index)=>{
        if(plainText)
        {
          let dictionary = {}
          plainText.toLowerCase().split(' ')
          .forEach((word,index)=>{
            word= word.replace(/[^\w\s]/gi, '').replace(/\r?\n|\r/,'').replace(/\s/g, '')
            if(word && word.length>0)
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
         dictionaries.push({dictionary,plainText,name:files[index].name})
        }
      })
      this.setState({dictionaries})
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

  render() {
    let {dictionaries} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Verification and Validation</h1>
        </header>
        <div className="App-intro">
          {dictionaries.map((dictionary,index)=><Dictionary key={index} dictionary={dictionary}/>)}
          <div className="card-footer text-muted">
            <Dropzone className="dropfiles" onDrop={this.onDrop.bind(this)}>
              <p>Try dropping some files here, or click to select files to upload.</p>
            </Dropzone>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
