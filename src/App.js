import './App.css';
import { ReactComponent as Logo } from './assets/52g_logo_RGB_only_symbol.svg';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

//2ca69434a3044893aca290fc114af8a3

function Content({
  contents
}) {
  console.log(contents)
  return (
    contents.length > 0 ?
      (
        contents.map((content, index) => {
          switch (content.type) {
            case 'header':
              return <h1 key={index}>{content.content}</h1>
            case 'sub_header':
              return <h2 key={index}>{content.content}</h2>
            case 'sub_sub_header':
              return <h3 key={index}>{content.content}</h3>
            case 'text':
              return <p key={index}>{content.content}</p>
            default:
              return <></>
          }
        })
      ) : <></>
  )
}

function App() {
  // Sets the number of stars we wish to display
  const numStars = 100;

  // Gets random x, y values based on the size of the container
  function getRandomPosition() {
    var y = window.innerWidth;
    var x = window.innerHeight;
    var randomX = Math.floor(Math.random() * x);
    var randomY = Math.floor(Math.random() * y);
    return [randomX, randomY];
  }

  // For every star we want to display
  for (let i = 0; i < numStars; i++) {
    let star = document.createElement("div");
    star.className = "star";
    var xy = getRandomPosition();
    star.style.top = xy[0] + 'px';
    star.style.left = xy[1] + 'px';
    document.body.append(star);
  }

  const [contents, setContents] = useState([]);
  const [searchParams, /*setSearchParams*/ ] = useSearchParams();

  let pageId = searchParams.get('pageId');

  if (pageId === null) {
    pageId = "2ca69434a3044893aca290fc114af8a3";
  }

  useEffect(() => {
    fetch("https://notion-api.splitbee.io/v1/page/" + pageId)
    .then((res) => res.json()).then((data) => {
      const arr = [];
        
      Object.keys(data).forEach((key) => {
        const block = data[key];
        if (block.value.type === 'page') {
          document.title = block.value.properties.title[0][0];
        }
        if (block.value.content !== undefined) {
          block.value.content.forEach((content) => {
            if (data[content].value.properties !== undefined) {
              arr.push(
                {
                  type: data[content].value.type,
                  content: data[content].value.properties.title[0][0]
                }
              )              
            }            
          })
        }
      });
      setContents(arr);      
  });
  }, [pageId])  

  return (
    <div className="App">
      
      <section className="intro">
        A long time ago, in a galaxy far,<br /> far away....
      </section>

      <section className="logo">
        <Logo></Logo>
      </section>

      <div id="board">
        <div id="content">
          <Content contents={contents}></Content>
        </div>
      </div>

    </div>
  );
}

export default App;
